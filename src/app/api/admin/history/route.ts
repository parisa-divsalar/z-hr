import crypto from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

function withCors(res: NextResponse) {
  res.headers.set('Cache-Control', 'no-store, max-age=0');
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

function json(data: any, init?: { status?: number }) {
  return withCors(NextResponse.json(data, init));
}

function safeId() {
  // Prefer UUID if available; fallback to random bytes.
  // Node 18+ supports randomUUID in most environments.
  const anyCrypto: any = crypto as any;
  if (typeof anyCrypto.randomUUID === 'function') return anyCrypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

function normalizeUserId(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Admin CRUD for history rows (file-based JSON).
 * NOTE: This endpoint is CORS-open because admin-dashboard is a separate app.
 *
 * GET    /api/admin/history                  -> list all (optionally include deleted)
 * POST   /api/admin/history                  -> create (or upsert if id exists)
 * PATCH  /api/admin/history                  -> patch update by (user_id, id)
 * DELETE /api/admin/history?id=...&user_id=.. -> delete (hard by default; hard=0 for soft)
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const includeDeleted = url.searchParams.get('include_deleted') === '1' || url.searchParams.get('include_deleted') === 'true';
  const rows = db.history.findAll();
  const filtered = includeDeleted ? rows : rows.filter((r: any) => !r?.deleted_at);
  return json({ data: filtered });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = normalizeUserId(body?.user_id);
    if (userId == null) return json({ error: 'user_id is required' }, { status: 400 });

    const id = String(body?.id ?? '').trim() || safeId();
    const now = new Date().toISOString();

    const rowToUpsert = {
      ...(typeof body === 'object' && body ? body : {}),
      id,
      user_id: userId,
      name: String(body?.name ?? ''),
      date: String(body?.date ?? ''),
      Percentage: String(body?.Percentage ?? ''),
      position: String(body?.position ?? ''),
      level: String(body?.level ?? ''),
      title: String(body?.title ?? ''),
      Voice: String(body?.Voice ?? ''),
      Photo: String(body?.Photo ?? ''),
      size: String(body?.size ?? ''),
      Video: String(body?.Video ?? ''),
      description: String(body?.description ?? ''),
      is_bookmarked: body?.is_bookmarked == null ? false : Boolean(body.is_bookmarked),
      deleted_at: body?.deleted_at ?? null,
      created_at: body?.created_at ?? now,
      updated_at: body?.updated_at ?? now,
    };

    const saved = db.history.upsert(rowToUpsert as any);
    return json({ data: saved });
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = normalizeUserId(body?.user_id);
    const id = String(body?.id ?? '').trim();
    if (userId == null) return json({ error: 'user_id is required' }, { status: 400 });
    if (!id) return json({ error: 'id is required' }, { status: 400 });

    const patch = body?.patch && typeof body.patch === 'object' ? body.patch : body;
    // Never allow key fields to change via patch
    const { user_id: _u, id: _id, ...safePatch } = patch ?? {};

    const updated = db.history.update(userId, id, safePatch as any);
    if (!updated) return json({ error: 'Not found' }, { status: 404 });
    return json({ data: updated });
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = String(url.searchParams.get('id') ?? '').trim();
  const userId = normalizeUserId(url.searchParams.get('user_id'));
  const hard = !(url.searchParams.get('hard') === '0' || url.searchParams.get('hard') === 'false');

  if (!id) return json({ error: 'id is required' }, { status: 400 });
  if (userId == null) return json({ error: 'user_id is required' }, { status: 400 });

  const ok = hard ? db.history.deleteHard(userId, id) : db.history.markDeleted(userId, id);
  if (!ok) return json({ error: 'Not found' }, { status: 404 });

  return json({ ok: true, hard });
}

export async function OPTIONS() {
  return withCors(
    new NextResponse(null, {
      status: 204,
    })
  );
}






