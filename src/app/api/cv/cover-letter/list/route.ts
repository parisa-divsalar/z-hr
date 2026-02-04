import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserId(request: NextRequest): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token =
            cookieStore.get('accessToken')?.value ??
            request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.userId?.toString() ?? null;
    } catch {
        return null;
    }
}

const normalize = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function GET(request: NextRequest) {
    const userId = await getUserId(request);
    const userIdNum = userId != null && String(userId).trim() ? Number(userId) : null;
    const safeUserIdNum = Number.isFinite(userIdNum as any) ? (userIdNum as number) : null;
    const { searchParams } = new URL(request.url);
    const cvRequestId = normalize(searchParams.get('cvRequestId') ?? searchParams.get('resumeRequestId') ?? searchParams.get('requestId'));
    if (!cvRequestId) return NextResponse.json({ error: 'cvRequestId is required' }, { status: 400 });

    const rows =
        safeUserIdNum == null
            ? // Guest mode: list only rows with missing user_id (so users don't see each other's data).
              db.coverLetters.findByCvRequestId(cvRequestId).filter((r: any) => r?.user_id == null)
            : db.coverLetters.findByCvRequestIdAndUserId(cvRequestId, safeUserIdNum);

    return NextResponse.json({
        cvRequestId,
        items: rows.map((row: any) => ({
            requestId: row.request_id,
            cvRequestId: row.cv_request_id,
            coverLetter: row.cover_letter ?? row?.cover_letter_json?.content ?? '',
            ...(row?.cover_letter_json && typeof row.cover_letter_json === 'object' ? row.cover_letter_json : {}),
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            data: row,
        })),
    });
}


