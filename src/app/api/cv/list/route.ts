import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

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

function safeJsonParse(value: unknown): any | null {
  if (value == null) return null;
  if (typeof value === 'object') return value as any;
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function extractResumeDisplayName(cvRow: any, user: any): string {
  const parsed = safeJsonParse(cvRow?.content) ?? cvRow?.content ?? null;
  const root = parsed?.content && typeof parsed?.content === 'object' ? parsed.content : parsed;
  const name =
    String(root?.profile?.fullName ?? root?.fullName ?? root?.name ?? (cvRow?.title as any) ?? user?.name ?? '').trim() ||
    'Your';
  return name;
}

function extractMainSkill(cvRow: any): string {
  const parsed = safeJsonParse(cvRow?.content) ?? cvRow?.content ?? null;
  const root = parsed?.content && typeof parsed?.content === 'object' ? parsed.content : parsed;
  return String(root?.mainSkill ?? root?.main_skill ?? root?.title ?? cvRow?.title ?? '').trim();
}

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const user = db.users.findById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get('limit') ?? 50);
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(200, Math.floor(limitParam))) : 50;

  const rows = (db.cvs.findByUserId(userId) ?? [])
    .slice()
    .sort((a: any, b: any) => String(b?.updated_at ?? b?.created_at ?? '').localeCompare(String(a?.updated_at ?? a?.created_at ?? '')))
    .slice(0, limit);

  return NextResponse.json(
    {
      data: rows.map((cv: any) => ({
        id: cv?.id ?? null,
        requestId: String(cv?.request_id ?? '').trim(),
        createdAt: cv?.created_at ?? null,
        updatedAt: cv?.updated_at ?? null,
        title: String(cv?.title ?? '').trim() || null,
        displayName: extractResumeDisplayName(cv, user),
        mainSkill: extractMainSkill(cv),
        raw: cv,
      })),
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}


