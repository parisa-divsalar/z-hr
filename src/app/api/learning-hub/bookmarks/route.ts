import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, max-age=0',
};

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
 * GET /api/learning-hub/bookmarks
 * Returns list of bookmarked course ids for current user.
 */
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders });

  const rows = db.learningHubBookmarks.findByUserId(userId);
  const courseIds = rows.map((r: any) => Number(r?.course_id)).filter((n: number) => Number.isFinite(n));
  return NextResponse.json({ data: courseIds }, { headers: corsHeaders });
}

/**
 * POST /api/learning-hub/bookmarks
 * Body: { courseId: number, bookmarked?: boolean }
 */
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders });

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const courseIdRaw = body?.courseId ?? body?.course_id ?? body?.id;
  const courseId = Number(courseIdRaw);
  if (!Number.isFinite(courseId)) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400, headers: corsHeaders });
  }

  const bookmarked =
    body?.bookmarked === undefined || body?.bookmarked === null
      ? body?.is_bookmarked === undefined || body?.is_bookmarked === null
        ? undefined
        : Boolean(body.is_bookmarked)
      : Boolean(body.bookmarked);

  const result = db.learningHubBookmarks.toggle(userId, courseId, bookmarked);
  return NextResponse.json({ data: result }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...corsHeaders, 'Access-Control-Max-Age': '86400' },
  });
}


