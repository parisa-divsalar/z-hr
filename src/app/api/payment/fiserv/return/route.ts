import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

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

    const prisma = getPrismaOrNull();
    const existing = prisma
      ? null
      : (db.fiservTransactions.findByOrderId(orderId) as { user_id?: number; customer_email?: string; purchased_coin_amount?: number; status?: string } | null);

    let userId: number | null = null;
    if (prisma) {
      const tx = await prisma.fiservTransaction.findUnique({ where: { orderId }, select: { userId: true } });
      userId = tx?.userId ?? null;
    }
    const authedUserId = await getUserIdFromAuth(request);
    if (userId == null && authedUserId != null) userId = authedUserId;
    if (userId == null && existing?.user_id != null) userId = Number(existing.user_id);
    if (!Number.isFinite(Number(userId))) userId = null;

    if (userId == null && existing?.customer_email) {
      const user = db.users.findByEmail(String(existing.customer_email));
      const uid = Number((user as any)?.id);
      if (Number.isFinite(uid)) userId = uid;
    }

    if (status === 'success' && userId != null) {
      if (prisma) {
        const tx = await prisma.fiservTransaction.findUnique({ where: { orderId }, select: { id: true, userId: true, purchasedCoinAmount: true, status: true } });
        if (tx && tx.userId && String(tx.status ?? '').toLowerCase() !== 'success') {
          const coinAdd = Number(tx.purchasedCoinAmount ?? 0);
          if (Number.isFinite(coinAdd) && coinAdd >= 0) {
            await prisma.$executeRaw`
              UPDATE users SET coin = COALESCE(coin, 0) + ${coinAdd}, plan_status = 'paid', payment_failed = FALSE, just_converted = TRUE, last_payment_at = NOW() WHERE id = ${tx.userId}
            `;
          }
          await prisma.fiservTransaction.update({ where: { id: tx.id }, data: { status: 'success' } });
        }
      } else {
        const existingRow = existing as { user_id?: number; purchased_coin_amount?: number; status?: string } | null;
        const currentStatus = String(existingRow?.status ?? '').toLowerCase();
        if (existingRow && currentStatus !== 'success') {
          const coinAdd = Number(existingRow?.purchased_coin_amount ?? 0) || 0;
          if (coinAdd >= 0) {
            const u = db.users.findById(userId);
            if (u) {
              const current = Number((u as any)?.coin ?? 0) || 0;
              db.users.update(userId, { coin: current + coinAdd, plan_status: 'paid', payment_failed: false, just_converted: true, last_payment_at: new Date().toISOString() } as any);
            }
          }
        }
      }
    }

    let updated: any;
    if (prisma) {
      const tx = await prisma.fiservTransaction.findUnique({ where: { orderId } });
      if (tx) {
        updated = await prisma.fiservTransaction.update({
          where: { id: tx.id },
          data: { status, ...(planId ? { planId } : {}) },
        });
      } else {
        updated = { orderId, status };
      }
    } else {
      updated = db.fiservTransactions.upsert({
        ...(existing ?? {}),
        user_id: userId,
        order_id: orderId,
        status,
        ...(planId ? { plan_id: planId } : {}),
        return_received_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, data: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Fiserv return update error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

