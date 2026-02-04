import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { normalizeResolveInput, resolveUserState } from '@/lib/user-state';

export const runtime = 'nodejs';

function toNumberOrNull(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const userId = toNumberOrNull(params.userId);
  if (userId == null) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const input = normalizeResolveInput(params);
  const result = resolveUserState({ userId, ...input });

  const record = params.record === '1' || params.record === 'true';
  if (record) {
    db.userStateHistory.append({
      user_id: userId,
      state: result.state,
      reason: result.reason,
      input,
    });
  }

  return NextResponse.json({
    userId,
    ...result,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
