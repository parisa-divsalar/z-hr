import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';
type FeatureValue = string | number | boolean | null;

type ApiPlan = {
  id: PlanId;
  topText: string;
  name: string;
  isPopular: boolean;
  price: string;
  priceTone: 'free' | 'paid';
  taxNote?: string;
  cta: { label: string; variant: 'contained' | 'outlined' | 'text' };
};

type ApiFeature = {
  id: string;
  label: string;
  values: Record<PlanId, FeatureValue>;
};

type DbPlanRow = Record<string, unknown> & {
  name?: string;
  best_for?: string;
  price_aed?: number;
};

const ORDER: PlanId[] = ['starter', 'pro', 'plus', 'elite'];

function normalizePlanId(name: string | undefined): PlanId | null {
  const n = String(name ?? '').trim().toLowerCase();
  if (!n) return null;
  if (n.includes('starter') || n.includes('free')) return 'starter';
  if (n.includes('pro')) return 'pro';
  if (n.includes('plus')) return 'plus';
  if (n.includes('elite')) return 'elite';
  return null;
}

function valueToBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v > 0;
  if (typeof v === 'string') return v.trim() !== '' && v.trim() !== '0';
  return Boolean(v);
}

const FEATURE_DEFS: Array<{
  id: string;
  label: string;
  key?: string;
  kind?: 'boolean' | 'value' | 'rank';
}> = [
  { id: 'planName', label: 'Plan Name' },
  { id: 'atsFriendly', label: 'ATS-friendly', key: 'ats_friendly', kind: 'boolean' },
  { id: 'withWatermark', label: 'With watermark', key: 'with_watermark', kind: 'boolean' },
  { id: 'templates', label: 'Templates', key: 'templates', kind: 'value' },
  { id: 'jobDescriptionMatch', label: 'Job Description Match', key: 'job_description_match', kind: 'boolean' },
  { id: 'languagesSupported', label: 'languages supported', key: 'languages_supported', kind: 'value' },
  { id: 'format', label: 'Format', key: 'format', kind: 'value' },
  { id: 'aiResumeBuilder', label: 'AI resume builder', key: 'ai_resume_builder', kind: 'value' },
  { id: 'aiCoverLetter', label: 'AI Cover Letter', key: 'ai_cover_letter', kind: 'value' },
  { id: 'imagesInput', label: 'Images input', key: 'images_input', kind: 'value' },
  { id: 'voiceInput', label: 'Voice input', key: 'voice_input', kind: 'value' },
  { id: 'videoInput', label: 'Video input', key: 'video_input', kind: 'value' },
  { id: 'fileInput', label: 'File input', key: 'file_input', kind: 'value' },
  { id: 'wizardEdit', label: 'Wizard Edit', key: 'wizard_edit', kind: 'value' },
  { id: 'learningHub', label: 'Learning Hub', key: 'learning_hub', kind: 'value' },
  { id: 'skillGap', label: 'Skill gap', key: 'skill_gap', kind: 'value' },
  { id: 'voiceInterview', label: 'Voice interview', key: 'voice_interview', kind: 'value' },
  { id: 'videoInterview', label: 'Video interview', key: 'video_interview', kind: 'value' },
  { id: 'questionInterview', label: 'Question interview', key: 'question_interview', kind: 'value' },
  { id: 'positionSuggestion', label: 'Position Suggestion', key: 'position_suggestion', kind: 'value' },
  { id: 'processingSpeed', label: 'Processing Speed', key: 'processing_speed', kind: 'rank' },
  // Keep these last to match the DB table view (price row at bottom, then optional coin).
  { id: 'price', label: 'Price' },
  { id: 'coin', label: 'coin', key: 'coin', kind: 'value' },
];

/**
 * GET /api/plans
 * Public endpoint for pricing comparison UI.
 * Reads from file-based JSON DB (plans.json via db.plans.findAll()).
 */
export async function GET() {
  try {
    const rows = (db.plans.findAll() ?? []) as DbPlanRow[];

    const byId = new Map<PlanId, DbPlanRow>();
    for (const row of rows) {
      const id = normalizePlanId(row.name);
      if (!id) continue;
      byId.set(id, row);
    }

    const plans: ApiPlan[] = ORDER.filter((id) => byId.has(id)).map((id) => {
      const row = byId.get(id)!;
      const priceAed = typeof row.price_aed === 'number' ? row.price_aed : Number(row.price_aed ?? 0);
      const isFree = !Number.isFinite(priceAed) ? false : priceAed <= 0;
      const isPopular = id === 'plus';

      return {
        id,
        topText: String(row.best_for ?? ''),
        name: String(row.name ?? id),
        isPopular,
        price: isFree ? 'Free' : `${priceAed} AED`,
        priceTone: isFree ? 'free' : 'paid',
        taxNote: 'Total price with 9% Tax',
        cta: { label: 'Upgrade Now', variant: isPopular ? 'contained' : 'outlined' },
      };
    });

    const features: ApiFeature[] = FEATURE_DEFS.map((def) => {
      const values = ORDER.reduce((acc, planId) => {
        const row = byId.get(planId);
        if (!row) {
          acc[planId] = null;
          return acc;
        }

        if (def.id === 'price') {
          const priceAed = typeof row.price_aed === 'number' ? row.price_aed : Number(row.price_aed ?? 0);
          const isFree = !Number.isFinite(priceAed) ? false : priceAed <= 0;
          acc[planId] = isFree ? '0' : `${priceAed} AED`;
          return acc;
        }

        if (!def.key) {
          // "Plan Name" row is rendered from `plan.name` in the UI (we still return it for completeness).
          acc[planId] = row.name ? String(row.name) : null;
          return acc;
        }

        const raw = row[def.key];
        if (def.kind === 'boolean') {
          acc[planId] = valueToBool(raw);
          return acc;
        }
        if (def.kind === 'rank') {
          const n = typeof raw === 'number' ? raw : Number(raw ?? NaN);
          acc[planId] = Number.isFinite(n) ? `#${n}` : raw == null ? null : String(raw);
          return acc;
        }

        // 'value' (default): preserve the DB value so counts/text show up in the UI.
        if (raw == null) acc[planId] = null;
        else if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') acc[planId] = raw;
        else acc[planId] = String(raw);
        return acc;
      }, {} as Record<PlanId, FeatureValue>);

      return { id: def.id, label: def.label, values };
    });

    return NextResponse.json(
      { plans, features, source: 'db.plans (data/plans.json)', generatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Error in /api/plans:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load plans' },
      { status: 500 }
    );
  }
}


