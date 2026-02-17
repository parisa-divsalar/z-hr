import { db } from '@/lib/db';

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
 * Reads coin cost from `data/resume_feature_pricing.json` (via `db.resumeFeaturePricing`).
 * This keeps feature coin consumption dynamic in dev/JSON-db mode.
 */
export function getResumeFeatureCoinCost(featureName: string, fallback: number): number {
  const fallbackInt = Math.max(0, Math.trunc(Number.isFinite(fallback) ? fallback : 0));
  const target = normalizeKey(featureName);
  if (!target) return fallbackInt;

  try {
    const rows = db.resumeFeaturePricing.findAll?.() ?? [];
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

