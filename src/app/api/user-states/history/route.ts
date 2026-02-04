import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

function toNumberOrNull(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: NextRequest) {
  const userId = toNumberOrNull(request.nextUrl.searchParams.get('userId'));
  if (userId == null) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const rows = db.userStateHistory.findByUserId(userId);
  return NextResponse.json({ data: rows });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
