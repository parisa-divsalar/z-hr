import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

    if (!userId) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = db.users.findById(userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        data: {
            id: user.id,
            email: user.email,
            name: user.name,
            coin: user.coin ?? 0,
            // onboarding/profile extras (optional)
            mainSkill: (user as any).main_skill ?? (user as any).mainSkill ?? '',
            dateOfBirth: (user as any).date_of_birth ?? (user as any).dateOfBirth ?? '',
        },
    });
}

function normalizeString(value: unknown): string {
    return String(value ?? '').trim();
}

/**
 * PATCH /api/users/me
 * Updates current user's profile fields captured in IntroDialog.
 */
export async function PATCH(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = db.users.findById(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let body: any = null;
    try {
        body = await request.json();
    } catch {
        body = null;
    }

    const fullName = normalizeString(body?.fullName ?? body?.name);
    const mainSkill = normalizeString(body?.mainSkill ?? body?.main_skill);
    const dateOfBirth = normalizeString(body?.dateOfBirth ?? body?.date_of_birth);

    // Keep it permissive; IntroDialog validates on client already.
    const patch: Record<string, unknown> = {
        intro_completed_at: new Date().toISOString(),
    };
    if (fullName) patch.name = fullName;
    if (mainSkill) patch.main_skill = mainSkill;
    if (dateOfBirth) patch.date_of_birth = dateOfBirth;

    const updated = db.users.update(userId, patch);
    if (!updated) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
        data: {
            id: (updated as any).id,
            email: (updated as any).email,
            name: (updated as any).name ?? null,
            coin: (updated as any).coin ?? 0,
            mainSkill: (updated as any).main_skill ?? (updated as any).mainSkill ?? '',
            dateOfBirth: (updated as any).date_of_birth ?? (updated as any).dateOfBirth ?? '',
        },
    });
}









