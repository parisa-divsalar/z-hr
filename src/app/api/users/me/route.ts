import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);

    if (!userId) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } },
        );
    }

    const prisma = getPrismaOrNull();

    if (prisma) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                coin: true,
                planStatus: true,
                hasUsedFreePlan: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } },
            );
        }

        return NextResponse.json(
            {
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    coin: user.coin ?? 0,
                    plan_status: user.planStatus ?? null,
                    has_used_free_plan: Boolean(user.hasUsedFreePlan),
                },
            },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } },
        );
    }

    const user = db.users.findById(userId);

    if (!user) {
        return NextResponse.json(
            { error: 'User not found' },
            { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } },
        );
    }

    return NextResponse.json(
        {
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                coin: user.coin ?? 0,
                plan_status: (user as any)?.plan_status ?? null,
                has_used_free_plan: Boolean((user as any)?.has_used_free_plan ?? false),
                // onboarding/profile extras (optional)
                mainSkill: (user as any).main_skill ?? (user as any).mainSkill ?? '',
                dateOfBirth: (user as any).date_of_birth ?? (user as any).dateOfBirth ?? '',
            },
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
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









