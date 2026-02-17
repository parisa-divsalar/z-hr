import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, max-age=0',
};

/**
 * GET /api/more-features
 * Returns More Features data for the landing wizard step.
 */
export async function GET() {
  try {
    const rows = (db.moreFeatures.findAll?.() ?? []) as any[];
    const prisma = getPrismaOrNull();
    const pricingRows = prisma
      ? await prisma.$queryRaw<Array<{ feature_name: string | null; coin_per_action: number | null }>>`
          SELECT feature_name, coin_per_action FROM resume_feature_pricing
        `
      : ((db.resumeFeaturePricing.findAll?.() ?? []) as any[]);

    const safeStr = (v: unknown) => String(v ?? '').trim();
    const normalizeKey = (v: unknown) =>
      safeStr(v)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    const toFiniteInt = (v: unknown): number | null => {
      const n =
        typeof v === 'number'
          ? v
          : typeof v === 'string'
            ? Number(v.replace(/,/g, '').trim())
            : Number(v as any);
      if (!Number.isFinite(n)) return null;
      return Math.trunc(n);
    };

    const tokenize = (v: unknown): string[] => {
      const s = normalizeKey(v);
      if (!s) return [];
      // normalize very common plurals without overfitting
      return s
        .split(' ')
        .map((t) => (t.endsWith('s') && t.length > 3 ? t.slice(0, -1) : t))
        .filter(Boolean);
    };

    const scoreTokens = (aTokens: string[], bTokens: string[]) => {
      if (!aTokens.length || !bTokens.length) return 0;
      const b = new Set(bTokens);
      let hit = 0;
      for (const t of aTokens) if (b.has(t)) hit += 1;
      return hit / Math.min(aTokens.length, bTokens.length);
    };

    const bestPricingMatch = (featureTitle: unknown) => {
      const aTokens = tokenize(featureTitle);
      if (!aTokens.length) return null;

      let best: any | null = null;
      let bestScore = 0;
      for (const row of pricingRows) {
        const bTokens = tokenize(row?.feature_name);
        const s = scoreTokens(aTokens, bTokens);
        if (s > bestScore) {
          bestScore = s;
          best = row;
        }
      }

      // Require decent overlap to avoid accidental matches.
      return bestScore >= 0.6 ? best : null;
    };

    const merged = rows.map((r) => {
      const match = bestPricingMatch(r?.title);
      if (!match) {
        // Keep structure but avoid mock coin values if pricing is missing.
        return { ...r, coin: 0 };
      }

      const coin = toFiniteInt(match?.coin_per_action);
      return {
        ...r,
        title: safeStr(match?.feature_name) || r?.title,
        coin: coin != null && coin >= 0 ? coin : 0,
      };
    });

    return NextResponse.json(merged, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in /api/more-features:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load more features' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...corsHeaders, 'Access-Control-Max-Age': '86400' },
  });
}


















