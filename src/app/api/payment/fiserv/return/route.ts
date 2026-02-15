import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function normalizeStatus(raw: unknown): 'success' | 'failed' | 'cancelled' {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'success') return 'success';
  if (s === 'cancelled') return 'cancelled';
  return 'failed';
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

/**
 * POST /api/payment/fiserv/return
 * Called by `/payment/return` page to update the persisted transaction status.
 *
 * Note: Redirect return URLs usually don't include full transaction details (approval code, masked PAN, etc).
 * Those can be added later via a provider webhook if needed.
 */
export async function POST(request: NextRequest) {
  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      body = null;
    }

    const orderId = String(body?.orderId ?? body?.order_id ?? '').trim();
    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

    const status = normalizeStatus(body?.status);
    const planId = String(body?.planId ?? body?.plan_id ?? '').trim() || null;

    const existing = db.fiservTransactions.findByOrderId(orderId);
    const authedUserId = await getUserIdFromAuth(request);

    let userId: number | null =
      authedUserId != null ? authedUserId : existing?.user_id != null ? Number(existing.user_id) : null;
    if (!Number.isFinite(Number(userId))) userId = null;

    if (userId == null && existing?.customer_email) {
      const user = db.users.findByEmail(String(existing.customer_email));
      const uid = Number((user as any)?.id);
      if (Number.isFinite(uid)) userId = uid;
    }

    const updated = db.fiservTransactions.upsert({
      ...(existing ?? {}),
      user_id: userId,
      order_id: orderId,
      status,
      ...(planId ? { plan_id: planId } : {}),
      return_received_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, data: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Fiserv return update error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

