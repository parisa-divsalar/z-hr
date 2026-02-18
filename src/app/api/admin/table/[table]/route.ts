import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type TableConfig = {
  file: string;
  /** Fields that uniquely identify a row (preferred). */
  keyFields?: string[];
  /** If true, allow operations using `_index` when no keyFields match. */
  allowIndexFallback?: boolean;
  /** Optional table alias (read/write will operate on the aliased table). */
  aliasTo?: string;
};

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

function resolveDataDir() {
  if (process.env.DATABASE_PATH) return path.dirname(process.env.DATABASE_PATH);

  const cwd = process.cwd();
  const candidates = [cwd, path.resolve(cwd, '..'), path.resolve(cwd, '../..'), path.resolve(cwd, '../../..')];
  for (const dir of candidates) {
    try {
      if (fs.existsSync(path.join(dir, 'data-seed'))) return path.join(dir, 'data');
      if (fs.existsSync(path.join(dir, 'data'))) return path.join(dir, 'data');
    } catch {
      // ignore
    }
  }
  return path.resolve(cwd, 'data');
}

function safeId() {
  const anyCrypto: any = crypto as any;
  if (typeof anyCrypto.randomUUID === 'function') return anyCrypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
}

function readJsonArray(filePath: string): any[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(`admin/table: failed to read ${filePath}`, e);
    return [];
  }
}

function writeJsonArray(filePath: string, rows: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), 'utf-8');
}

const TABLES: Record<string, TableConfig> = {
  users: { file: 'users.json', keyFields: ['id'] },
  cvs: { file: 'cvs.json', keyFields: ['id', 'request_id'], allowIndexFallback: true },
  skills: { file: 'skills.json', keyFields: ['id'], allowIndexFallback: true },
  user_skills: { file: 'user_skills.json', keyFields: ['id'], allowIndexFallback: true },
  interview_sessions: { file: 'interview_sessions.json', keyFields: ['id'], allowIndexFallback: true },
  registration_logs: { file: 'registered_users_log.json', allowIndexFallback: true },
  login_logs: { file: 'login_logs.json', allowIndexFallback: true },
  ai_interactions: { file: 'ai_interactions.json', allowIndexFallback: true },
  cover_letters: { file: 'cover_letters.json', keyFields: ['request_id'], allowIndexFallback: true },
  wizard_data: { file: 'wizard_data.json', keyFields: ['id', 'request_id'], allowIndexFallback: true },
  resume_drafts: { file: 'resume_drafts.json', keyFields: ['id', 'request_id'], allowIndexFallback: true },
  resume_section_outputs: { file: 'resume_section_outputs.json', keyFields: ['id'], allowIndexFallback: true },
  job_positions: { file: 'job_positions.json', keyFields: ['id'], allowIndexFallback: true },
  job_positions_active: { file: 'job_positions.json', aliasTo: 'job_positions', keyFields: ['id'], allowIndexFallback: true },
  job_positions_new: { file: 'job_positions.json', aliasTo: 'job_positions', keyFields: ['id'], allowIndexFallback: true },
  learning_hub_courses: { file: 'learning_hub_courses.json', keyFields: ['id'], allowIndexFallback: true },
  more_features: { file: 'more_features.json', keyFields: ['id'], allowIndexFallback: true },
  user_states: { file: 'user_states.json', keyFields: ['id'], allowIndexFallback: true },
  user_state_history: { file: 'user_state_history.json', keyFields: ['id'], allowIndexFallback: true },
  user_state_logs: { file: 'user_state_logs.json', keyFields: ['id'], allowIndexFallback: true },
  plans: { file: 'plans.json', keyFields: ['id'], allowIndexFallback: true },
  resume_feature_pricing: { file: 'resume_feature_pricing.json', keyFields: ['id'], allowIndexFallback: true },

  coin_packages: { file: 'coin_packages.json', keyFields: ['package_name'], allowIndexFallback: true },
  fiserv_transactions: { file: 'fiserv_transactions.json', keyFields: ['order_id', 'id'], allowIndexFallback: true },
  history: { file: 'history.json', keyFields: ['user_id', 'id'], allowIndexFallback: true },
};

function normalizeTable(tableParam: string) {
  const t = String(tableParam || '').trim();
  if (!t) return null;
  const cfg = TABLES[t];
  if (!cfg) return null;
  return { table: cfg.aliasTo ?? t, cfg: cfg.aliasTo ? TABLES[cfg.aliasTo] : cfg };
}

function toNumberOrNull(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function matchWhere(row: any, where: any) {
  if (!where || typeof where !== 'object') return false;
  return Object.entries(where).every(([k, v]) => {
    if (k === '_index') return true; // handled separately
    const rowVal = (row as any)?.[k];
    const n1 = toNumberOrNull(rowVal);
    const n2 = toNumberOrNull(v);
    if (n1 != null && n2 != null) return n1 === n2;
    return String(rowVal ?? '') === String(v ?? '');
  });
}

function findIndex(rows: any[], where: any): number {
  if (where && typeof where === 'object' && where._index != null) {
    const idx = toNumberOrNull(where._index);
    if (idx == null) return -1;
    return idx >= 0 && idx < rows.length ? idx : -1;
  }
  return rows.findIndex((r) => matchWhere(r, where));
}

function applyTimestampsForUpsert(row: any) {
  const now = new Date().toISOString();
  if (row && typeof row === 'object') {
    if (!('created_at' in row)) row.created_at = now;
    row.updated_at = now;
  }
  return row;
}

function autoAssignIdIfNeeded(rows: any[], row: any) {
  if (!row || typeof row !== 'object') return row;
  if (row.id != null && row.id !== '') return row;
  const ids = rows.map((r) => toNumberOrNull(r?.id)).filter((v): v is number => v != null);
  if (ids.length === 0) return row;
  row.id = Math.max(...ids) + 1;
  return row;
}

export async function GET(_request: NextRequest, ctx: { params: Promise<{ table: string }> }) {
  const { table } = await ctx.params;
  const norm = normalizeTable(table);
  if (!norm) return json({ error: 'Unknown table' }, { status: 404 });
  const cfg = norm.cfg;
  const dataDir = resolveDataDir();
  const filePath = path.join(dataDir, cfg.file);
  const rows = readJsonArray(filePath);
  return json({ table: norm.table, data: rows });
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ table: string }> }) {
  const { table } = await ctx.params;
  const norm = normalizeTable(table);
  if (!norm) return json({ error: 'Unknown table' }, { status: 404 });
  const cfg = norm.cfg;
  const dataDir = resolveDataDir();
  const filePath = path.join(dataDir, cfg.file);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const inputRow = body?.row ?? body;
  if (!inputRow || typeof inputRow !== 'object') return json({ error: 'row is required' }, { status: 400 });

  const rows = readJsonArray(filePath);
  const row = applyTimestampsForUpsert(autoAssignIdIfNeeded(rows, { ...(inputRow as any) }));
  if (norm.table === 'history') {
    // Ensure history has stable ids
    if (!row.id) row.id = safeId();
  }

  rows.push(row);
  writeJsonArray(filePath, rows);
  return json({ data: row });
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ table: string }> }) {
  const { table } = await ctx.params;
  const norm = normalizeTable(table);
  if (!norm) return json({ error: 'Unknown table' }, { status: 404 });
  const cfg = norm.cfg;
  const dataDir = resolveDataDir();
  const filePath = path.join(dataDir, cfg.file);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const where = body?.where ?? body?.key ?? null;
  const patch = body?.patch && typeof body.patch === 'object' ? body.patch : body?.rowPatch ?? body?.data ?? body?.updates ?? null;
  if (!where || typeof where !== 'object') return json({ error: 'where is required' }, { status: 400 });
  if (!patch || typeof patch !== 'object') return json({ error: 'patch is required' }, { status: 400 });

  const rows = readJsonArray(filePath);
  const idx = findIndex(rows, where);
  if (idx === -1) return json({ error: 'Not found' }, { status: 404 });

  // Prevent changing key fields via patch (best effort)
  const safePatch: any = { ...(patch as any) };
  for (const k of cfg.keyFields ?? []) delete safePatch[k];
  delete safePatch._index;

  const now = new Date().toISOString();
  rows[idx] = { ...(rows[idx] as any), ...safePatch };
  if (rows[idx] && typeof rows[idx] === 'object') {
    if ('updated_at' in rows[idx]) rows[idx].updated_at = now;
  }
  writeJsonArray(filePath, rows);
  return json({ data: rows[idx] });
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ table: string }> }) {
  const { table } = await ctx.params;
  const norm = normalizeTable(table);
  if (!norm) return json({ error: 'Unknown table' }, { status: 404 });
  const cfg = norm.cfg;
  const dataDir = resolveDataDir();
  const filePath = path.join(dataDir, cfg.file);

  let where: any = null;
  try {
    const body = await request.json().catch(() => null);
    where = body?.where ?? body?.key ?? null;
  } catch {
    // ignore
  }
  if (!where) {
    const url = new URL(request.url);
    const q: any = {};
    for (const [k, v] of url.searchParams.entries()) q[k] = v;
    where = Object.keys(q).length ? q : null;
  }

  if (!where || typeof where !== 'object') return json({ error: 'where is required' }, { status: 400 });

  const rows = readJsonArray(filePath);
  const idx = findIndex(rows, where);
  if (idx === -1) return json({ error: 'Not found' }, { status: 404 });

  const deleted = rows.splice(idx, 1)[0];
  writeJsonArray(filePath, rows);
  return json({ ok: true, deleted });
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}


