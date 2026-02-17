import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

function safeStr(v: unknown): string {
  return String(v ?? '').trim();
}

function normalizeKey(v: unknown): string {
  return safeStr(v)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toFiniteInt(v: unknown): number | null {
  const n =
    typeof v === 'number'
      ? v
      : typeof v === 'string'
        ? Number(v.replace(/,/g, '').trim())
        : Number(v as any);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

/**
 * Loads resume-feature pricing rows from the SQL database (when configured)
 * or from the JSON DB fallback.
 *
 * Source of truth:
 * - **SQL/Prisma mode**: `resume_feature_pricing` table
 * - **JSON-db mode**: `data/resume_feature_pricing.json` via `db.resumeFeaturePricing`
 */
type ResumeFeaturePricingRow = {
  id?: number | string;
  feature_name?: string;
  coin_per_action?: number | string;
  [k: string]: unknown;
};

let cachedRows: ResumeFeaturePricingRow[] | null = null;
let cachedAtMs = 0;
const CACHE_TTL_MS = 30_000;

async function loadResumeFeaturePricingRows(): Promise<ResumeFeaturePricingRow[]> {
  const now = Date.now();
  if (cachedRows && now - cachedAtMs < CACHE_TTL_MS) return cachedRows;

  const prisma = getPrismaOrNull();
  if (prisma) {
    try {
      // Keep this query permissive: we only require feature_name + coin_per_action.
      const rows = (await prisma.$queryRaw<
        Array<{ id: number; feature_name: string | null; coin_per_action: number | null }>
      >`SELECT id, feature_name, coin_per_action FROM resume_feature_pricing`) as any[];

      cachedRows = Array.isArray(rows) ? (rows as any) : [];
      cachedAtMs = now;
      return cachedRows;
    } catch {
      // If the SQL table isn't available yet, fall back to JSON rows below.
    }
  }

  const rows = (db.resumeFeaturePricing.findAll?.() ?? []) as ResumeFeaturePricingRow[];
  cachedRows = Array.isArray(rows) ? rows : [];
  cachedAtMs = now;
  return cachedRows;
}

export async function getResumeFeatureCoinCost(featureName: string, fallback: number): Promise<number> {
  const fallbackInt = Math.max(0, Math.trunc(Number.isFinite(fallback) ? fallback : 0));
  const target = normalizeKey(featureName);
  if (!target) return fallbackInt;

  try {
    const rows = await loadResumeFeaturePricingRows();
    const match =
      rows.find((r: any) => normalizeKey(r?.feature_name) === target) ??
      rows.find((r: any) => normalizeKey(r?.feature_name).includes(target)) ??
      rows.find((r: any) => target.includes(normalizeKey(r?.feature_name)));

    const cost = toFiniteInt((match as any)?.coin_per_action);
    if (cost != null && cost > 0) return cost;
  } catch {
    // ignore; use fallback
  }

  return fallbackInt;
}

