import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get('accessToken')?.value;
        const header = request.headers.get('authorization');
        const headerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const parsedId = Number(decoded?.userId);
        return Number.isFinite(parsedId) ? parsedId : null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const url = new URL(request.url);
    const bookmarkedOnly = url.searchParams.get('bookmarked') === '1' || url.searchParams.get('bookmarked') === 'true';
    const rows = db.history
        .findByUserId(userId)
        .filter((r: any) => !r?.deleted_at);
    const filtered = bookmarkedOnly ? rows.filter((r: any) => Boolean(r.is_bookmarked)) : rows;

    return NextResponse.json({ data: filtered }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function PATCH(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    try {
        const body = await request.json();
        const id = String(body?.id ?? '');
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        const isBookmarked =
            body?.is_bookmarked === undefined || body?.is_bookmarked === null ? undefined : Boolean(body.is_bookmarked);

        // If this history row doesn't exist yet, try to materialize it from user's CVs.
        let updated = db.history.toggleBookmark(userId, id, isBookmarked);
        if (!updated) {
            const cv = db.cvs.findByRequestId(id);
            if (cv && Number(cv.user_id) === Number(userId)) {
                const toMMDDYYYY = (iso: string) => {
                    const d = new Date(iso);
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    const yyyy = String(d.getFullYear());
                    return `${mm}/${dd}/${yyyy}`;
                };
                const sizeMB = (() => {
                    const str = typeof cv.content === 'string' ? cv.content : JSON.stringify(cv.content ?? '');
                    const bytes = Buffer.byteLength(str, 'utf8');
                    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                })();
                db.history.upsert({
                    id: cv.request_id,
                    user_id: userId,
                    name: (cv.title as any) || "User's Resume",
                    date: toMMDDYYYY(cv.created_at || new Date().toISOString()),
                    Percentage: '0%',
                    position: '',
                    level: '',
                    title: (cv.title as any) || '',
                    Voice: 'Voice',
                    Photo: 'Photo',
                    size: sizeMB,
                    Video: 'Video',
                    description: 'Resume',
                    is_bookmarked: Boolean(isBookmarked),
                    deleted_at: null,
                });
                updated = db.history.toggleBookmark(userId, id, isBookmarked);
            }
        }
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ data: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const url = new URL(request.url);
    const idFromQuery = url.searchParams.get('id');

    let id: string | null = idFromQuery ? String(idFromQuery) : null;
    if (!id) {
        try {
            const body = await request.json();
            if (body?.id) id = String(body.id);
        } catch {
            // ignore
        }
    }

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const ok = db.history.markDeleted(userId, id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}


