import { NextRequest, NextResponse } from 'next/server';

import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

export const runtime = 'nodejs';

const ZENON_PAYMENT_API = 'https://apisrv.zenonrobotics.ae/PaymentAPI/api/create';

type CreateSessionBody = {
    coinPackageId?: number | string;
    planId?: string;
    /** Custom amount (AED) for features/assets selection; use with purchasedCoinAmount. */
    amountAed?: number;
    /** Coins to credit on success when using amountAed (custom checkout). */
    purchasedCoinAmount?: number;
};

function readEnv(name: string, fallback = ''): string {
    const raw = String(process.env[name] ?? '').trim();
    return raw || fallback;
}

function resolveOrigin(request: NextRequest): string {
    const origin = request.headers.get('origin');
    if (origin) return origin;
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') ?? 'https';
    if (host) return `${proto}://${host}`;
    return 'http://localhost:3000';
}

function toInt(v: unknown): number | null {
    const n = typeof v === 'number' ? v : Number(String(v ?? '').trim());
    return Number.isFinite(n) ? Math.trunc(n) : null;
}

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';
function normalizePlanId(name: string | undefined): PlanId | null {
    const n = String(name ?? '').trim().toLowerCase();
    if (!n) return null;
    if (n === 'starter' || n.includes('starter') || n.includes('free')) return 'starter';
    if (n === 'pro' || n.includes('pro')) return 'pro';
    if (n === 'plus' || n.includes('plus')) return 'plus';
    if (n === 'elite' || n.includes('elite')) return 'elite';
    return null;
}

function resolvePlanPriceAed(planId: PlanId): number | null {
    const rows = (db.plans.findAll() ?? []) as Array<Record<string, unknown> & { name?: string; price_aed?: number }>;
    for (const row of rows) {
        const id = normalizePlanId(row?.name);
        if (!id || id !== planId) continue;
        const n = typeof row.price_aed === 'number' ? row.price_aed : Number(row.price_aed ?? NaN);
        if (!Number.isFinite(n) || n <= 0) return null;
        return n;
    }
    return null;
}

type ZenonCreatePayload = {
    amount: number;
    currency: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    userId: string;
    description: string;
    metadata: {
        merchantName: string;
        mid: string;
        storeId: string;
        transactionType: string;
        transactionOrigin: string;
    };
    successUrl: string;
    failureUrl: string;
    webhookUrl?: string;
};

function buildZenonPayload(params: {
    amount: number;
    origin: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    orderId?: string;
    planParam?: string;
}): ZenonCreatePayload {
    const {
        amount,
        origin,
        userId,
        firstName,
        lastName,
        email,
        orderId = '',
        planParam = '',
    } = params;

    const successUrl = `${origin}/payment/return?status=success&orderId=${encodeURIComponent(orderId)}${planParam}`;
    const failureUrl = `${origin}/payment/return?status=failure&orderId=${encodeURIComponent(orderId)}${planParam}`;

    const merchantName = readEnv('ZENON_MERCHANT_NAME', 'ZENON ROBOTICS & SMART MACHINES TR');
    const mid = readEnv('ZENON_MID', '760076310429');
    const storeId = readEnv('ZENON_STORE_ID', '811676310429');
    const webhookUrl = readEnv('ZENON_WEBHOOK_URL');

    return {
        amount: Number(amount.toFixed(2)),
        currency: 'AED',
        firstName,
        lastName,
        email,
        phone: '+971501234567',
        address: 'Dubai, UAE',
        city: 'Dubai',
        country: 'AE',
        postalCode: '00000',
        userId,
        description: 'Zenon Robotics - Fiserv IPG Checkout (Production)',
        metadata: {
            merchantName,
            mid,
            storeId,
            transactionType: 'SALE',
            transactionOrigin: 'ECOM',
        },
        successUrl,
        failureUrl,
        ...(webhookUrl ? { webhookUrl } : {}),
    };
}

export async function POST(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    let body: CreateSessionBody | null = null;
    try {
        body = (await request.json()) as CreateSessionBody;
    } catch {
        body = null;
    }

    const coinPackageId = toInt(body?.coinPackageId);
    const planId = normalizePlanId(body?.planId);
    const amountAedRaw = body?.amountAed;
    const amountAedNum = typeof amountAedRaw === 'number' ? amountAedRaw : Number(amountAedRaw);
    const customAmountAed = Number.isFinite(amountAedNum) && amountAedNum > 0 ? amountAedNum : null;
    const purchasedCoinAmountRaw = body?.purchasedCoinAmount;
    const customCoins =
        typeof purchasedCoinAmountRaw === 'number' && Number.isFinite(purchasedCoinAmountRaw) && purchasedCoinAmountRaw >= 0
            ? Math.round(purchasedCoinAmountRaw)
            : typeof purchasedCoinAmountRaw === 'string'
              ? Math.max(0, Math.round(Number(purchasedCoinAmountRaw)) || 0)
              : null;
    const useCustomAmount = customAmountAed != null && customCoins != null;

    const hasPackage = !!coinPackageId;
    const hasPlan = !!planId;
    if (!hasPackage && !hasPlan && !useCustomAmount) {
        return NextResponse.json({ error: 'coinPackageId, planId, or (amountAed + purchasedCoinAmount) is required' }, { status: 400 });
    }
    const modes = [hasPackage, hasPlan, useCustomAmount].filter(Boolean).length;
    if (modes > 1) {
        return NextResponse.json({ error: 'Provide only one of: coinPackageId, planId, or (amountAed + purchasedCoinAmount)' }, { status: 400 });
    }

    const origin = resolveOrigin(request);
    const orderId = `ZR${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const planParam = planId ? `&plan=${encodeURIComponent(planId)}` : '';

    const prisma = getPrismaOrNull();

    if (prisma) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        let priceAed: number | null = null;

        let purchasedCoinAmount: number | null = null;
        let resolvedCoinPackageId: number | null = null;

        if (coinPackageId) {
            const pkg = await prisma.coinPackage.findUnique({
                where: { id: coinPackageId },
                select: { id: true, priceAed: true, coinAmount: true },
            });
            if (!pkg) return NextResponse.json({ error: 'Coin package not found' }, { status: 404 });
            priceAed = Number(pkg.priceAed);
            purchasedCoinAmount = pkg.coinAmount;
            resolvedCoinPackageId = pkg.id;
        } else if (planId) {
            priceAed = resolvePlanPriceAed(planId);
            purchasedCoinAmount = 0;
        } else if (useCustomAmount && customAmountAed != null && customCoins != null) {
            priceAed = customAmountAed;
            purchasedCoinAmount = customCoins;
            resolvedCoinPackageId = null;
        }

        if (!priceAed || !Number.isFinite(priceAed) || priceAed <= 0) {
            return NextResponse.json({ error: 'Invalid paid selection' }, { status: 400 });
        }

        const nameParts = String(user.name ?? 'User').trim().split(/\s+/);
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';

        const payload = buildZenonPayload({
            amount: priceAed,
            origin,
            userId: String(user.id),
            firstName,
            lastName,
            email: user.email ?? '',
            orderId,
            planParam,
        });

        const apiUrl = readEnv('ZENON_PAYMENT_API_URL', ZENON_PAYMENT_API);

        const zenonRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        const text = await zenonRes.text();
        let json: Record<string, unknown> | null = null;
        try {
            json = JSON.parse(text) as Record<string, unknown>;
        } catch {
            // ignore
        }

        if (!zenonRes.ok) {
            const errMsg = typeof json?.errorMessage === 'string' ? json.errorMessage : json?.error ?? text;
            return NextResponse.json(
                { error: 'Payment gateway error', details: errMsg, httpStatus: zenonRes.status },
                { status: 502 },
            );
        }

        const success = json?.success === true;
        const checkoutUrl = typeof json?.checkoutUrl === 'string' ? json.checkoutUrl : null;
        const responseOrderId = typeof json?.orderId === 'string' ? json.orderId : orderId;

        if (!success || !checkoutUrl) {
            return NextResponse.json(
                {
                    error: typeof json?.errorMessage === 'string' ? json.errorMessage : 'No checkout URL in response',
                    details: json ?? text,
                },
                { status: 502 },
            );
        }

        const checkoutId = typeof json?.checkoutId === 'string' ? json.checkoutId : null;
        await prisma.fiservTransaction.create({
            data: {
                userId: user.id,
                orderId,
                checkoutId,
                status: 'pending',
                ...(planId ? { planId } : {}),
                amount: priceAed,
                currency: 'AED',
                customerEmail: user.email,
                customerName: user.name ?? null,
                ...(resolvedCoinPackageId != null ? { coinPackageId: resolvedCoinPackageId, purchasedCoinAmount: purchasedCoinAmount ?? 0 } : { purchasedCoinAmount: purchasedCoinAmount ?? 0 }),
            },
        });

        return NextResponse.json(
            { paymentUrl: checkoutUrl, orderId: responseOrderId, checkoutId: json?.checkoutId ?? undefined },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } },
        );
    }

    // JSON-db fallback (dev only)
    const user = db.users.findById(userId) as { email?: string; name?: string } | null;
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let priceAed: number | null = null;

    let purchasedCoinAmount: number | null = null;

    if (coinPackageId) {
        const pkgs = db.coinPackages.findAll() ?? [];
        const pkg = pkgs.find((p: { id?: unknown }) => Number(p?.id) === coinPackageId) as { price_aed?: number; coin_amount?: number } | undefined;
        if (!pkg) return NextResponse.json({ error: 'Coin package not found' }, { status: 404 });
        priceAed = Number(pkg?.price_aed ?? 0);
        purchasedCoinAmount = Number(pkg?.coin_amount ?? 0);
    } else if (planId) {
        priceAed = resolvePlanPriceAed(planId);
        purchasedCoinAmount = 0;
    } else if (useCustomAmount && customAmountAed != null && customCoins != null) {
        priceAed = customAmountAed;
        purchasedCoinAmount = customCoins;
    }

    if (!priceAed || !Number.isFinite(priceAed) || priceAed <= 0) {
        return NextResponse.json({ error: 'Invalid paid selection' }, { status: 400 });
    }

    const nameParts = String(user?.name ?? 'User').trim().split(/\s+/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    const payload = buildZenonPayload({
        amount: priceAed,
        origin,
        userId: String(userId),
        firstName,
        lastName,
        email: String(user?.email ?? ''),
        orderId,
        planParam,
    });

    const apiUrl = readEnv('ZENON_PAYMENT_API_URL', ZENON_PAYMENT_API);

    const zenonRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
    });

    const text = await zenonRes.text();
    let json: Record<string, unknown> | null = null;
    try {
        json = JSON.parse(text) as Record<string, unknown>;
    } catch {
        // ignore
    }

    if (!zenonRes.ok) {
        return NextResponse.json(
            { error: 'Payment gateway error', details: json?.errorMessage ?? text, httpStatus: zenonRes.status },
            { status: 502 },
        );
    }

    const success = json?.success === true;
    const checkoutUrl = typeof json?.checkoutUrl === 'string' ? json.checkoutUrl : null;
    const responseOrderId = typeof json?.orderId === 'string' ? json.orderId : orderId;

    if (!success || !checkoutUrl) {
        return NextResponse.json(
            { error: typeof json?.errorMessage === 'string' ? json.errorMessage : 'No checkout URL in response' },
            { status: 502 },
        );
    }

    db.fiservTransactions.upsert({
        user_id: userId,
        order_id: orderId,
        checkout_id: typeof json?.checkoutId === 'string' ? json.checkoutId : null,
        status: 'pending',
        amount: Number(priceAed.toFixed(2)),
        currency: 'AED',
        customer_email: String((user as any)?.email ?? ''),
        customer_name: String((user as any)?.name ?? ''),
        ...(coinPackageId ? { coin_package_id: coinPackageId, purchased_coin_amount: purchasedCoinAmount ?? 0 } : { purchased_coin_amount: purchasedCoinAmount ?? 0 }),
        ...(planId ? { plan_id: planId } : {}),
    });

    return NextResponse.json(
        { paymentUrl: checkoutUrl, orderId: responseOrderId, checkoutId: json?.checkoutId },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
}
