import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
 * GET /api/payment/transactions
 * Returns the authenticated user's payment transactions (Fiserv).
 */
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const rows = (db.fiservTransactions.findByUserId(userId) ?? []) as any[];
  const data = rows
    .slice()
    .sort((a, b) => {
      const ta = Date.parse(String(a?.updated_at ?? a?.created_at ?? '')) || 0;
      const tb = Date.parse(String(b?.updated_at ?? b?.created_at ?? '')) || 0;
      return tb - ta;
    });

  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}

