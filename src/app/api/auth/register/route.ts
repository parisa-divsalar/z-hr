import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';
import { recordUserStateTransition } from '@/lib/user-state';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, firstName, lastName, username } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const prisma = getPrismaOrNull();

        // Hash password (always server-side)
        const passwordHash = await bcrypt.hash(password, 10);

        // Create full name from firstName and lastName if available
        let fullName = name;
        if (!fullName && firstName && lastName) {
            fullName = `${firstName} ${lastName}`.trim();
        } else if (!fullName && firstName) {
            fullName = firstName;
        } else if (!fullName && lastName) {
            fullName = lastName;
        }

        const fakeUserId = `fake_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

        // SQL/Prisma mode: new user receives Free coins exactly once at creation.
        if (prisma) {
            const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
            if (existing) {
                return NextResponse.json({ error: 'User already exists. Please sign in instead.' }, { status: 409 });
            }

            const created = await prisma.$transaction(async (tx) => {
                const freeRows = await tx.$queryRaw<Array<{ coin_amount: number }>>`
                    SELECT coin_amount
                    FROM coin_packages
                    WHERE price_aed = 0
                      AND package_name ILIKE '%free%'
                    ORDER BY coin_amount DESC
                    LIMIT 1
                `;
                const freeAmount = Number(freeRows?.[0]?.coin_amount ?? NaN);
                if (!Number.isFinite(freeAmount) || freeAmount <= 0) throw new Error('Free coin package not configured');

                return tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        name: fullName || null,
                        coin: freeAmount,
                        hasUsedFreePlan: true,
                        planStatus: 'FREE',
                    },
                    select: { id: true, email: true, name: true },
                });
            });

            // Keep JSON registration log for now (analytics/dev); safe to keep even in SQL mode.
            db.registrationLogs.append({
                user_id: created.id,
                fake_user_id: fakeUserId,
                email,
                username: username || email,
                password_hash: passwordHash,
            });

            recordUserStateTransition(created.id, { isVerified: false, planStatus: 'none' }, { event: 'register' });

            return NextResponse.json({
                data: {
                    userId: created.id,
                    fakeUserId,
                    email: created.email,
                    name: created.name,
                },
            });
        }

        // JSON-db mode (dev): create user with Free coins once.
        const existingUser = db.users.findByEmail(email);
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists. Please sign in instead.' }, { status: 409 });
        }

        const freePkg = (db.coinPackages.findAll() ?? []).find((r: any) => {
            const n = String(r?.package_name ?? '').toLowerCase();
            const p = Number(r?.price_aed ?? 0);
            return p <= 0 && n.includes('free');
        }) as any;
        const freeAmount = Number(freePkg?.coin_amount ?? 0) || 0;

        const newUser = db.users.create({
            email,
            password_hash: passwordHash,
            name: fullName || null,
            fake_user_id: fakeUserId,
            coin: freeAmount,
            has_used_free_plan: true,
            plan_status: 'FREE',
        });

        db.registrationLogs.append({
            user_id: newUser.id,
            fake_user_id: fakeUserId,
            email,
            username: username || email,
            password_hash: passwordHash,
        });

        recordUserStateTransition(newUser.id, { isVerified: false, planStatus: 'none' }, { event: 'register' });

        return NextResponse.json({
            data: {
                userId: newUser.id,
                fakeUserId,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
