import crypto from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

export const runtime = 'nodejs';

type CreateSessionBody = {
    coinPackageId?: number | string;
    planId?: string;
};

const FISERV_PLACEHOLDERS = new Set(['PASTE_YOUR_API_KEY_HERE', 'PASTE_YOUR_SECRET_HERE', 'PASTE_YOUR_STORE_ID_HERE']);

function readEnvValue(name: string): string {
    const raw = String(process.env[name] ?? '').trim();
    if (!raw) return '';
    if (FISERV_PLACEHOLDERS.has(raw)) return '';
    return raw;
}

function defaultFiservBaseUrl(): string {
    // Fiserv EMEA Checkout API (docs.fiserv.dev):
    // - Sandbox: https://prod.emea.api.fiservapps.com/sandbox/exp/v1/checkouts
    // - Production: https://prod.emea.api.fiservapps.com/exp/v1/checkouts
    return process.env.NODE_ENV === 'production'
        ? 'https://prod.emea.api.fiservapps.com/exp/v1/checkouts'
        : 'https://prod.emea.api.fiservapps.com/sandbox/exp/v1/checkouts';
}

function resolveOrigin(request: NextRequest): string {
    const origin = request.headers.get('origin');
    if (origin) return origin;
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') ?? 'https';
    if (host) return `${proto}://${host}`;
    return 'http://localhost:3000';
}

function generateUUID(): string {
    const anyCrypto = crypto as any;
    if (typeof anyCrypto.randomUUID === 'function') return anyCrypto.randomUUID();
    return crypto.randomBytes(16).toString('hex');
}

function generateOrderId(): string {
    // Exactly 10 characters (ZR + 8 random A-Z0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let out = 'ZR';
    for (let i = 0; i < 8; i += 1) {
        out += chars[crypto.randomInt(0, chars.length)];
    }
    return out.slice(0, 10);
}

function generateSignature(params: { apiKey: string; clientRequestId: string; timestampMs: string; body: string; secret: string }): string {
    const raw = params.apiKey + params.clientRequestId + params.timestampMs + params.body;
    return crypto.createHmac('sha256', params.secret).update(raw).digest('base64');
}

function extractCheckoutUrl(responseJson: any): string | null {
    if (!responseJson || typeof responseJson !== 'object') return null;
    if (typeof responseJson.checkoutUrl === 'string') return responseJson.checkoutUrl;
    if (typeof responseJson?.checkout?.redirectionUrl === 'string') return responseJson.checkout.redirectionUrl;
    if (typeof responseJson?.checkout?.checkoutUrl === 'string') return responseJson.checkout.checkoutUrl;
    return null;
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

    if (!coinPackageId && !planId) {
        return NextResponse.json({ error: 'coinPackageId or planId is required' }, { status: 400 });
    }

    if (coinPackageId && planId) {
        return NextResponse.json({ error: 'Provide only one of coinPackageId or planId' }, { status: 400 });
    }

    const API_KEY = readEnvValue('FISERV_API_KEY');
    const SECRET = readEnvValue('FISERV_SECRET');
    const STORE_ID = readEnvValue('FISERV_STORE_ID');
    const BASE_URL = readEnvValue('FISERV_BASE_URL') || defaultFiservBaseUrl();
    const WEBHOOK_URL = readEnvValue('FISERV_WEBHOOK_URL');

    if (!API_KEY || !SECRET || !STORE_ID) {
        return NextResponse.json(
            {
                error:
                    'Fiserv is not configured. Missing env vars: FISERV_API_KEY, FISERV_SECRET, FISERV_STORE_ID (and optionally FISERV_BASE_URL, FISERV_WEBHOOK_URL).',
            },
            { status: 500 },
        );
    }

    const prisma = getPrismaOrNull();
    const origin = resolveOrigin(request);
    const orderId = generateOrderId();

    if (prisma) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        let priceAed: number | null = null;
        let purchasedCoinAmount: number | null = null;
        let resolvedCoinPackageId: number | null = null;
        let resolvedPlanId: string | null = null;

        if (coinPackageId) {
            const pkg = await prisma.coinPackage.findUnique({
                where: { id: coinPackageId },
                select: { id: true, coinAmount: true, priceAed: true },
            });
            if (!pkg) return NextResponse.json({ error: 'Coin package not found' }, { status: 404 });
            priceAed = Number(pkg.priceAed);
            resolvedCoinPackageId = pkg.id;
            purchasedCoinAmount = pkg.coinAmount;
        } else if (planId) {
            priceAed = resolvePlanPriceAed(planId);
            resolvedPlanId = planId;
        }

        if (!priceAed || !Number.isFinite(priceAed) || priceAed <= 0) {
            return NextResponse.json({ error: 'Invalid paid selection' }, { status: 400 });
        }

        const planParam = resolvedPlanId ? `&plan=${encodeURIComponent(resolvedPlanId)}` : '';
        const successUrl = `${origin}/payment/return?status=success&orderId=${encodeURIComponent(orderId)}${planParam}`;
        const failureUrl = `${origin}/payment/return?status=failure&orderId=${encodeURIComponent(orderId)}${planParam}`;

        const requestBody = {
            storeId: STORE_ID,
            transactionType: 'SALE',
            transactionOrigin: 'ECOM',
            transactionAmount: {
                total: Number(priceAed.toFixed(2)),
                currency: 'AED',
            },
            checkoutSettings: {
                ...(WEBHOOK_URL ? { webHooksUrl: WEBHOOK_URL } : {}),
                redirectBackUrls: { successUrl, failureUrl },
            },
            order: {
                orderId,
                orderDetails: { invoiceNumber: orderId },
                billing: {
                    person: { firstName: String(user.name ?? 'User').split(' ')[0] || 'User', lastName: String(user.name ?? '').split(' ').slice(1).join(' ') || 'Customer' },
                    contact: { mobilePhone: '+971501234567', email: user.email },
                    address: { address1: 'Dubai, UAE', city: 'Dubai', country: 'AE', postalCode: '00000' },
                },
            },
        };

        const clientRequestId = generateUUID();
        const timestampMs = String(Date.now());
        const bodyString = JSON.stringify(requestBody);
        const signature = generateSignature({ apiKey: API_KEY, clientRequestId, timestampMs, body: bodyString, secret: SECRET });

        const fiservRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': API_KEY,
                'Client-Request-Id': clientRequestId,
                Timestamp: timestampMs,
                'Message-Signature': signature,
            },
            body: bodyString,
            cache: 'no-store',
        });

        const text = await fiservRes.text();
        const json = (() => {
            try {
                return JSON.parse(text);
            } catch {
                return null;
            }
        })();

        if (!fiservRes.ok) {
            return NextResponse.json({ error: 'Fiserv API error', httpStatus: fiservRes.status, details: json ?? text }, { status: 502 });
        }

        const checkoutUrl = extractCheckoutUrl(json);
        if (!checkoutUrl) {
            return NextResponse.json({ error: 'No checkoutUrl found in Fiserv response', details: json ?? text }, { status: 502 });
        }

        // Persist pending transaction for webhook + audit (NO plan_status updates here).
        await prisma.fiservTransaction.create({
            data: {
                userId: user.id,
                orderId,
                checkoutId: typeof json?.checkout?.checkoutId === 'string' ? json.checkout.checkoutId : null,
                transactionId: null,
                status: 'pending',
                ...(resolvedPlanId ? { planId: resolvedPlanId } : {}),
                amount: priceAed,
                currency: 'AED',
                customerEmail: user.email,
                customerName: user.name ?? null,
                ...(resolvedCoinPackageId ? { coinPackageId: resolvedCoinPackageId, purchasedCoinAmount } : {}),
            },
        });

        return NextResponse.json(
            { paymentUrl: checkoutUrl, orderId },
            { headers: { 'Cache-Control': 'no-store, max-age=0' } },
        );
    }

    // JSON-db fallback (dev only)
    const user = db.users.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let priceAed: number | null = null;
    let purchasedCoinAmount: number | null = null;

    if (coinPackageId) {
        const pkgs = db.coinPackages.findAll() ?? [];
        const pkg = pkgs.find((p: any) => Number(p?.id) === coinPackageId) as any;
        if (!pkg) return NextResponse.json({ error: 'Coin package not found' }, { status: 404 });
        priceAed = Number(pkg?.price_aed ?? 0);
        purchasedCoinAmount = Number(pkg?.coin_amount ?? null);
    } else if (planId) {
        priceAed = resolvePlanPriceAed(planId);
    }

    if (!priceAed || !Number.isFinite(priceAed) || priceAed <= 0) return NextResponse.json({ error: 'Invalid paid selection' }, { status: 400 });

    const planParam = planId ? `&plan=${encodeURIComponent(planId)}` : '';
    const successUrl = `${origin}/payment/return?status=success&orderId=${encodeURIComponent(orderId)}${planParam}`;
    const failureUrl = `${origin}/payment/return?status=failure&orderId=${encodeURIComponent(orderId)}${planParam}`;

    const requestBody = {
        storeId: STORE_ID,
        transactionType: 'SALE',
        transactionOrigin: 'ECOM',
        transactionAmount: { total: Number(priceAed.toFixed(2)), currency: 'AED' },
        checkoutSettings: {
            ...(WEBHOOK_URL ? { webHooksUrl: WEBHOOK_URL } : {}),
            redirectBackUrls: { successUrl, failureUrl },
        },
        order: {
            orderId,
            orderDetails: { invoiceNumber: orderId },
            billing: {
                person: { firstName: 'User', lastName: 'Customer' },
                contact: { mobilePhone: '+971501234567', email: String((user as any)?.email ?? '') },
                address: { address1: 'Dubai, UAE', city: 'Dubai', country: 'AE', postalCode: '00000' },
            },
        },
    };

    const clientRequestId = generateUUID();
    const timestampMs = String(Date.now());
    const bodyString = JSON.stringify(requestBody);
    const signature = generateSignature({ apiKey: API_KEY, clientRequestId, timestampMs, body: bodyString, secret: SECRET });

    const fiservRes = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': API_KEY,
            'Client-Request-Id': clientRequestId,
            Timestamp: timestampMs,
            'Message-Signature': signature,
        },
        body: bodyString,
        cache: 'no-store',
    });

    const text = await fiservRes.text();
    const json = (() => {
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    })();

    if (!fiservRes.ok) {
        return NextResponse.json({ error: 'Fiserv API error', httpStatus: fiservRes.status, details: json ?? text }, { status: 502 });
    }

    const checkoutUrl = extractCheckoutUrl(json);
    if (!checkoutUrl) return NextResponse.json({ error: 'No checkoutUrl found in Fiserv response', details: json ?? text }, { status: 502 });

    db.fiservTransactions.upsert({
        user_id: userId,
        order_id: orderId,
        checkout_id: typeof json?.checkout?.checkoutId === 'string' ? json.checkout.checkoutId : null,
        transaction_id: null,
        status: 'pending',
        amount: Number(priceAed.toFixed(2)),
        currency: 'AED',
        customer_email: String((user as any)?.email ?? ''),
        customer_name: String((user as any)?.name ?? ''),
        ...(coinPackageId ? { coin_package_id: coinPackageId, purchased_coin_amount: purchasedCoinAmount } : {}),
        ...(planId ? { plan_id: planId } : {}),
    });

    return NextResponse.json({ paymentUrl: checkoutUrl, orderId }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

