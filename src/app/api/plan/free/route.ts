import { NextRequest, NextResponse } from 'next/server';

import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

export const runtime = 'nodejs';

type ApiError = { error: string };

function findFreePackageAmountFromJson(): number | null {
    const rows = db.coinPackages.findAll() ?? [];
    const free = rows.find((r: any) => {
        const name = String(r?.package_name ?? '').toLowerCase();
        const price = Number(r?.price_aed ?? 0);
        return price <= 0 && name.includes('free');
    });
    const amount = free ? Number((free as any)?.coin_amount ?? NaN) : NaN;
    return Number.isFinite(amount) && amount > 0 ? amount : null;
}

const jsonLocks = new Map<number, Promise<void>>();
async function withJsonLock<T>(userId: number, fn: () => Promise<T>): Promise<T> {
    const prev = jsonLocks.get(userId) ?? Promise.resolve();
    let release!: () => void;
    const current = prev.then(
        () =>
            new Promise<void>((r) => {
                release = r;
            }),
    );
    jsonLocks.set(userId, current);

    await prev;
    try {
        return await fn();
    } finally {
        release();
        if (jsonLocks.get(userId) === current) jsonLocks.delete(userId);
    }
}

/**
 * POST /api/plan/free
 *
 * Backend-enforced Free Plan claim.
 * - Transactional + row-lock safe in SQL mode (Postgres).
 * - Rejects if user already used free plan.
 * - NEVER accepts coin amount from client; reads from CoinPackages/coin_packages.
 */
export async function POST(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json<ApiError>({ error: 'Authentication required' }, { status: 401 });

    const prisma = getPrismaOrNull();

    if (!prisma) {
        // JSON-db fallback (dev only)
        return withJsonLock(userId, async () => {
            const user = db.users.findById(userId);
            if (!user) return NextResponse.json<ApiError>({ error: 'User not found' }, { status: 404 });

            if (Boolean((user as any)?.has_used_free_plan ?? false)) {
                return NextResponse.json<ApiError>({ error: 'Free plan already used' }, { status: 400 });
            }

            const freeAmount = findFreePackageAmountFromJson();
            if (!freeAmount) {
                return NextResponse.json<ApiError>({ error: 'Free coin package not configured' }, { status: 500 });
            }

            const current = Number((user as any)?.coin ?? 0) || 0;
            const updated = db.users.update(userId, {
                coin: current + freeAmount,
                has_used_free_plan: true,
                plan_status: 'FREE',
            } as any);

            if (!updated) return NextResponse.json<ApiError>({ error: 'Failed to apply free plan' }, { status: 500 });

            return NextResponse.json({
                data: {
                    user_id: userId,
                    coin_added: freeAmount,
                    coin: Number((updated as any)?.coin ?? 0),
                    has_used_free_plan: true,
                    plan_status: (updated as any)?.plan_status ?? 'FREE',
                },
            });
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const lockedUsers = await tx.$queryRaw<Array<{ id: number; coin: number | null; has_used_free_plan: boolean }>>`
                SELECT id, coin, has_used_free_plan
                FROM users
                WHERE id = ${userId}
                FOR UPDATE
            `;

            const locked = lockedUsers?.[0];
            if (!locked) {
                return { status: 404 as const, body: { error: 'User not found' } };
            }

            if (locked.has_used_free_plan) {
                return { status: 400 as const, body: { error: 'Free plan already used' } };
            }

            const freeRows = await tx.$queryRaw<Array<{ coin_amount: number }>>`
                SELECT coin_amount
                FROM coin_packages
                WHERE price_aed = 0
                  AND package_name ILIKE '%free%'
                ORDER BY coin_amount DESC
                LIMIT 1
            `;

            const freeAmount = Number(freeRows?.[0]?.coin_amount ?? NaN);
            if (!Number.isFinite(freeAmount) || freeAmount <= 0) {
                return { status: 500 as const, body: { error: 'Free coin package not configured' } };
            }

            await tx.$executeRaw`
                UPDATE users
                SET
                  coin = COALESCE(coin, 0) + ${freeAmount},
                  has_used_free_plan = TRUE,
                  plan_status = 'FREE'
                WHERE id = ${userId}
            `;

            const updatedUsers = await tx.$queryRaw<Array<{ id: number; coin: number | null; has_used_free_plan: boolean; plan_status: string | null }>>`
                SELECT id, coin, has_used_free_plan, plan_status
                FROM users
                WHERE id = ${userId}
            `;

            const updated = updatedUsers?.[0];
            return {
                status: 200 as const,
                body: {
                    data: {
                        user_id: updated?.id ?? userId,
                        coin_added: freeAmount,
                        coin: updated?.coin ?? 0,
                        has_used_free_plan: Boolean(updated?.has_used_free_plan),
                        plan_status: updated?.plan_status ?? 'FREE',
                    },
                },
            };
        });

        return NextResponse.json(result.body, { status: result.status, headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch (e) {
        console.error('POST /api/plan/free failed:', e);
        return NextResponse.json<ApiError>({ error: 'Failed to apply free plan' }, { status: 500 });
    }
}

