import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

export const runtime = 'nodejs';

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(String(a ?? ''), 'utf8');
  const bb = Buffer.from(String(b ?? ''), 'utf8');
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getWebhookSecret(): string | null {
  const s = String(process.env.PAYMENT_WEBHOOK_SECRET ?? '').trim();
  return s ? s : null;
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = getWebhookSecret();
  if (!secret) return false;
  if (!signatureHeader) return false;
  // Expected: hex HMAC-SHA256(body)
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const provided = String(signatureHeader).trim();
  return timingSafeEqual(expected, provided);
}

function toInt(v: unknown): number | null {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').trim());
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function normalizeStatus(raw: unknown): 'success' | 'failed' | 'cancelled' | 'pending' {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'success') return 'success';
  if (s === 'cancelled') return 'cancelled';
  if (s === 'pending') return 'pending';
  return 'failed';
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get('x-webhook-signature') ??
      request.headers.get('x-signature') ??
      request.headers.get('x-payment-signature');

    // Enforce signature validation in production.
    if (process.env.NODE_ENV === 'production') {
      if (!verifySignature(rawBody, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = (() => {
      try {
        return JSON.parse(rawBody);
      } catch {
        return null;
      }
    })();

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = String((payload as any)?.event_type ?? (payload as any)?.type ?? '').trim();
    const eventId = String((payload as any)?.event_id ?? (payload as any)?.id ?? '').trim() || null;
    const orderId = String((payload as any)?.order_id ?? (payload as any)?.orderId ?? '').trim() || null;
    const status = normalizeStatus((payload as any)?.status ?? (payload as any)?.payment_status ?? eventType);

    if (!orderId) return NextResponse.json({ error: 'order_id is required' }, { status: 400 });

    const prisma = getPrismaOrNull();

    if (!prisma) {
      // JSON-db fallback (dev only): update stored transaction + user coins by coin_package metadata in transaction.
      const txRow = db.fiservTransactions.findByOrderId(orderId);
      if (!txRow) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
      const userId = toInt((txRow as any)?.user_id);
      if (!userId) return NextResponse.json({ error: 'Transaction has no user_id' }, { status: 400 });

      const user = db.users.findById(userId);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      if (status === 'success') {
        const coinAdd = toInt((txRow as any)?.purchased_coin_amount) ?? 0;
        const current = Number((user as any)?.coin ?? 0) || 0;
        db.users.update(userId, {
          coin: current + coinAdd,
          plan_status: 'paid',
          payment_failed: false,
          just_converted: true,
          last_payment_at: new Date().toISOString(),
        } as any);
      } else if (status === 'failed') {
        db.users.update(userId, { payment_failed: true, plan_status: 'failed' } as any);
      }

      db.fiservTransactions.upsert({
        ...(txRow as any),
        order_id: orderId,
        status,
        raw_webhook_event_id: eventId,
        raw_webhook_payload: payload,
        webhook_received_at: new Date().toISOString(),
      });

      return NextResponse.json({ received: true, mode: 'json', order_id: orderId, status });
    }

    // SQL/Prisma mode: transaction + row-level locks for idempotent, race-safe updates.
    const res = await prisma.$transaction(async (tx) => {
      const lockedTxRows = await tx.$queryRaw<
        Array<{
          id: number;
          status: string | null;
          user_id: number | null;
          coin_package_id: number | null;
          purchased_coin_amount: number | null;
          raw_webhook_event_id: string | null;
        }>
      >`
        SELECT id, status, user_id, coin_package_id, purchased_coin_amount, raw_webhook_event_id
        FROM fiserv_transactions
        WHERE order_id = ${orderId}
        FOR UPDATE
      `;

      const txRow = lockedTxRows?.[0];
      if (!txRow) return { status: 404 as const, body: { error: 'Transaction not found' } };

      if (eventId) {
        // Persistent idempotency: if any transaction already stored this eventId, treat as duplicate.
        const existingEvent = await tx.fiservTransaction.findUnique({ where: { rawWebhookEventId: eventId }, select: { id: true } });
        if (existingEvent) {
          return { status: 200 as const, body: { received: true, duplicate: true, event_id: eventId } };
        }
      }

      const userId = txRow.user_id;
      if (!userId) return { status: 400 as const, body: { error: 'Transaction has no user_id' } };

      if (status === 'success') {
        if (String(txRow.status ?? '').toLowerCase() === 'success') {
          // Already applied; still record payload if needed (idempotent success).
          await tx.fiservTransaction.update({
            where: { id: txRow.id },
            data: {
              rawWebhookEventId: eventId,
              rawWebhookPayload: payload as any,
              status: 'success',
            },
          });
          return { status: 200 as const, body: { received: true, already_applied: true } };
        }

        const lockedUsers = await tx.$queryRaw<Array<{ id: number; coin: number | null }>>`
          SELECT id, coin
          FROM users
          WHERE id = ${userId}
          FOR UPDATE
        `;
        const user = lockedUsers?.[0];
        if (!user) return { status: 404 as const, body: { error: 'User not found' } };

        let coinAdd = Number(txRow.purchased_coin_amount ?? NaN);
        if (!Number.isFinite(coinAdd) || coinAdd <= 0) {
          if (txRow.coin_package_id) {
            const pkgRows = await tx.$queryRaw<Array<{ coin_amount: number }>>`
              SELECT coin_amount FROM coin_packages WHERE id = ${txRow.coin_package_id} LIMIT 1
            `;
            coinAdd = Number(pkgRows?.[0]?.coin_amount ?? NaN);
          }
        }

        if (!Number.isFinite(coinAdd) || coinAdd <= 0) {
          // If this transaction is for a coin package, coinAdd must be resolvable.
          // If it's a plan-only upgrade (no coin package), allow zero-coin upgrades.
          if (txRow.coin_package_id) {
            return { status: 500 as const, body: { error: 'Could not resolve purchased coin amount' } };
          }
          coinAdd = 0;
        }

        await tx.$executeRaw`
          UPDATE users
          SET
            coin = COALESCE(coin, 0) + ${coinAdd},
            plan_status = 'paid',
            payment_failed = FALSE,
            just_converted = TRUE,
            last_payment_at = NOW()
          WHERE id = ${userId}
        `;

        await tx.fiservTransaction.update({
          where: { id: txRow.id },
          data: {
            status: 'success',
            rawWebhookEventId: eventId,
            rawWebhookPayload: payload as any,
          },
        });

        return { status: 200 as const, body: { received: true, status: 'success', order_id: orderId, coin_added: coinAdd } };
      }

      if (status === 'failed' || status === 'cancelled') {
        await tx.$executeRaw`
          UPDATE users
          SET
            payment_failed = ${status === 'failed'},
            plan_status = ${status === 'failed' ? 'failed' : 'cancelled'}
          WHERE id = ${userId}
        `;

        await tx.fiservTransaction.update({
          where: { id: txRow.id },
          data: {
            status,
            rawWebhookEventId: eventId,
            rawWebhookPayload: payload as any,
          },
        });

        return { status: 200 as const, body: { received: true, status, order_id: orderId } };
      }

      // pending or unknown: just store payload
      await tx.fiservTransaction.update({
        where: { id: txRow.id },
        data: {
          status,
          rawWebhookEventId: eventId,
          rawWebhookPayload: payload as any,
        },
      });

      return { status: 200 as const, body: { received: true, status, order_id: orderId } };
    });

    return NextResponse.json(res.body, { status: res.status, headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
