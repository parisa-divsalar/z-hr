import { NextRequest, NextResponse } from 'next/server';

import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { consumeCredit } from '@/lib/credits';

type Body = {
  amount?: number;
  feature?: string;
};

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: Body | null = null;
  try {
    body = (await request.json()) as Body;
  } catch {
    body = null;
  }

  const amountRaw = (body as any)?.amount;
  const feature = String((body as any)?.feature ?? '').trim() || 'generic';
  const amount = typeof amountRaw === 'number' ? amountRaw : Number(String(amountRaw ?? '').trim());

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
  }

  const result = await consumeCredit(userId, Math.trunc(amount), feature);

  if (!result.success) {
    return NextResponse.json(
      {
        error: result.error || 'Insufficient credits',
        remainingCredits: result.remainingCredits,
        requiredCredits: Math.trunc(amount),
      },
      { status: result.error === 'Insufficient credits' ? 402 : 400 },
    );
  }

  return NextResponse.json(
    { ok: true, remainingCredits: result.remainingCredits },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

