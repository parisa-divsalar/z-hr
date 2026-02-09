import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { buildSuggestedJobsForUser } from '@/lib/suggested-positions';

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

const normalize = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const user = db.users.findById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const url = new URL(request.url);
  const requestId = normalize(url.searchParams.get('requestId') ?? url.searchParams.get('cvRequestId'));

  const maxParam = Number(url.searchParams.get('max') ?? url.searchParams.get('limit') ?? 20);
  const max = Number.isFinite(maxParam) ? Math.max(1, Math.min(50, Math.floor(maxParam))) : 20;

  const allCvs = db.cvs.findByUserId(userId) ?? [];
  const cvs = requestId
    ? allCvs.filter((cv: any) => String(cv?.request_id ?? '').trim() === requestId)
    : allCvs;

  if (requestId && cvs.length === 0) {
    return NextResponse.json({ data: [], requestId, max }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  }

  const suggestedJobs = buildSuggestedJobsForUser({ user, cvs, max });

  return NextResponse.json(
    {
      data: suggestedJobs,
      requestId: requestId || null,
      max,
      resumesUsed: cvs.length,
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}


