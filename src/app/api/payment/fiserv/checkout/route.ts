import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';

type CheckoutRequestBody = {
  planId?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address1?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
};

const FISERV_PLACEHOLDERS = new Set([
  'PASTE_YOUR_API_KEY_HERE',
  'PASTE_YOUR_SECRET_HERE',
  'PASTE_YOUR_STORE_ID_HERE',
]);

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

function normalizePlanId(name: string | undefined): PlanId | null {
  const n = String(name ?? '').trim().toLowerCase();
  if (!n) return null;
  if (n.includes('starter') || n.includes('free')) return 'starter';
  if (n.includes('pro')) return 'pro';
  if (n.includes('plus')) return 'plus';
  if (n.includes('elite')) return 'elite';
  return null;
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

function generateSignature(params: {
  apiKey: string;
  clientRequestId: string;
  timestampMs: string;
  body: string;
  secret: string;
}): string {
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
  try {
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

    let body: CheckoutRequestBody | null = null;
    try {
      body = (await request.json()) as CheckoutRequestBody;
    } catch {
      body = null;
    }

    const planIdRaw = String(body?.planId ?? '').trim().toLowerCase();
    const planId = (planIdRaw === 'starter' || planIdRaw === 'pro' || planIdRaw === 'plus' || planIdRaw === 'elite'
      ? planIdRaw
      : null) as PlanId | null;

    if (!planId) {
      return NextResponse.json({ error: 'planId is required (starter|pro|plus|elite)' }, { status: 400 });
    }

    const priceAed = resolvePlanPriceAed(planId);
    if (!priceAed) {
      return NextResponse.json({ error: `Could not resolve a paid price for plan '${planId}'` }, { status: 400 });
    }

    const email = String(body?.customer?.email ?? '').trim();
    if (!email) {
      return NextResponse.json({ error: 'customer.email is required' }, { status: 400 });
    }

    const firstName = String(body?.customer?.firstName ?? 'Test').trim() || 'Test';
    const lastName = String(body?.customer?.lastName ?? 'User').trim() || 'User';
    const phone = String(body?.customer?.phone ?? '+971501234567').trim() || '+971501234567';
    const address1 = String(body?.customer?.address1 ?? 'Dubai, UAE').trim() || 'Dubai, UAE';
    const city = String(body?.customer?.city ?? 'Dubai').trim() || 'Dubai';
    const country = String(body?.customer?.country ?? 'AE').trim() || 'AE';
    const postalCode = String(body?.customer?.postalCode ?? '00000').trim() || '00000';

    const origin = resolveOrigin(request);
    const orderId = generateOrderId();
    const successUrl = `${origin}/payment/return?status=success&plan=${encodeURIComponent(planId)}&orderId=${encodeURIComponent(orderId)}`;
    const failureUrl = `${origin}/payment/return?status=failure&plan=${encodeURIComponent(planId)}&orderId=${encodeURIComponent(orderId)}`;

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
        redirectBackUrls: {
          successUrl,
          failureUrl,
        },
      },
      order: {
        orderId, // Exactly 10 chars
        orderDetails: {
          invoiceNumber: orderId,
        },
        billing: {
          person: { firstName, lastName },
          contact: { mobilePhone: phone, email },
          address: { address1, city, country, postalCode },
        },
      },
    };

    const clientRequestId = generateUUID();
    const timestampMs = String(Date.now());
    const bodyString = JSON.stringify(requestBody);
    const signature = generateSignature({
      apiKey: API_KEY,
      clientRequestId,
      timestampMs,
      body: bodyString,
      secret: SECRET,
    });

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
      return NextResponse.json(
        {
          error: 'Fiserv API error',
          httpStatus: fiservRes.status,
          details: json ?? text,
        },
        { status: 502 },
      );
    }

    const checkoutUrl = extractCheckoutUrl(json);
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkoutUrl found in Fiserv response', httpStatus: fiservRes.status, details: json ?? text },
        { status: 502 },
      );
    }

    // Persist a "pending" transaction immediately (so admin can see it as soon as user clicks Payment).
    try {
      const user = db.users.findByEmail(email);
      const userId = Number((user as any)?.id);
      const checkoutId = typeof json?.checkout?.checkoutId === 'string' ? json.checkout.checkoutId : null;
      db.fiservTransactions.upsert({
        user_id: Number.isFinite(userId) ? userId : null,
        order_id: orderId,
        checkout_id: checkoutId,
        transaction_id: null,
        status: 'pending',
        approval_code: null,
        processor_reference: null,
        amount: Number(priceAed.toFixed(2)),
        currency: 'AED',
        card_brand: null,
        masked_card: null,
        customer_email: email,
        customer_name: `${firstName} ${lastName}`.trim(),
        // helpful extra metadata (not part of SQL draft, but harmless in JSON storage)
        plan_id: planId,
      });
    } catch (e) {
      // Never block checkout creation due to local persistence errors
      console.warn('Failed to persist pending Fiserv transaction:', e);
    }

    return NextResponse.json(
      {
        checkoutUrl,
        orderId,
        checkoutId: typeof json?.checkout?.checkoutId === 'string' ? json.checkout.checkoutId : null,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch (error) {
    console.error('Fiserv checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

