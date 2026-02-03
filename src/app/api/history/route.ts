import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getCountsFromWizardDataRow(wizardRow: any): { voiceCount: number; photoCount: number; videoCount: number } | null {
    if (!wizardRow?.data) return null;

    let data: any = wizardRow.data;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch {
            return null;
        }
    }

    const allFilesSummary = Array.isArray(data?.allFilesSummary) ? data.allFilesSummary : [];

    const imageExt = new Set([
        'png',
        'jpg',
        'jpeg',
        'webp',
        'gif',
        'bmp',
        'tiff',
        'svg',
        'heic',
        'heif',
    ]);
    const videoExt = new Set(['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', 'wmv', 'flv', '3gp']);

    let voiceCount = 0;
    let photoCount = 0;
    let videoCount = 0;

    for (const item of allFilesSummary) {
        if (item?.kind === 'voice') {
            voiceCount += 1;
            continue;
        }

        if (item?.kind === 'file') {
            const name = typeof item?.name === 'string' ? item.name : '';
            const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : '';
            if (ext && imageExt.has(ext)) photoCount += 1;
            else if (ext && videoExt.has(ext)) videoCount += 1;
        }
    }

    // Fallback: if there's no summary, at least count voice refs from sections (file type can't be determined).
    if (allFilesSummary.length === 0) {
        const safeArr = (v: any) => (Array.isArray(v) ? v : []);
        const countSection = (section: any) => {
            voiceCount += safeArr(section?.voices).length;
        };
        countSection(data?.background);
        safeArr(data?.experiences).forEach((s: any) => countSection(s));
        safeArr(data?.certificates).forEach((s: any) => countSection(s));
        countSection(data?.jobDescription);
        countSection(data?.additionalInfo);
    }

    return { voiceCount, photoCount, videoCount };
}

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

    // Enrich Voice/Photo/Video with counts computed from saved wizard data (if present).
    const enriched = filtered.map((row: any) => {
        const requestId = String(row?.id ?? '');
        if (!requestId) return row;
        const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
        const counts = getCountsFromWizardDataRow(wizardRow);
        if (!counts) return row;
        return {
            ...row,
            Voice: String(counts.voiceCount),
            Photo: String(counts.photoCount),
            Video: String(counts.videoCount),
        };
    });

    return NextResponse.json({ data: enriched }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
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

                const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, String(cv.request_id));
                const counts = getCountsFromWizardDataRow(wizardRow);
                const voice = counts ? String(counts.voiceCount) : '0';
                const photo = counts ? String(counts.photoCount) : '0';
                const video = counts ? String(counts.videoCount) : '0';

                db.history.upsert({
                    id: cv.request_id,
                    user_id: userId,
                    name: (cv.title as any) || "User's Resume",
                    date: toMMDDYYYY(cv.created_at || new Date().toISOString()),
                    Percentage: '0%',
                    position: '',
                    level: '',
                    title: (cv.title as any) || '',
                    Voice: voice,
                    Photo: photo,
                    size: sizeMB,
                    Video: video,
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


