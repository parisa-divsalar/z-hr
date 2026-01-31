import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

type PlanId = 'starter' | 'pro' | 'careerPlus' | 'elite';

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
  availability: Record<PlanId, boolean>;
};

type DbPlanRow = Record<string, unknown> & {
  name?: string;
  best_for?: string;
  price_aed?: number;
};

const ORDER: PlanId[] = ['starter', 'pro', 'careerPlus', 'elite'];

function normalizePlanId(name: string | undefined): PlanId | null {
  const n = String(name ?? '').trim().toLowerCase();
  if (!n) return null;
  if (n.includes('starter') || n.includes('free')) return 'starter';
  if (n.includes('pro')) return 'pro';
  if (n.includes('plus')) return 'careerPlus';
  if (n.includes('elite')) return 'elite';
  return null;
}

function valueToBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v > 0;
  if (typeof v === 'string') return v.trim() !== '' && v.trim() !== '0';
  return Boolean(v);
}

const FEATURE_DEFS: Array<{ id: string; label: string; key?: string }> = [
  { id: 'planName', label: 'Plan Name' },
  { id: 'atsFriendly', label: 'ATS-friendly', key: 'ats_friendly' },
  { id: 'withWatermark', label: 'With watermark', key: 'with_watermark' },
  { id: 'templates', label: 'Templates', key: 'templates' },
  { id: 'jobDescriptionMatch', label: 'Job Description Match', key: 'job_description_match' },
  { id: 'languagesSupported', label: 'languages supported', key: 'languages_supported' },
  { id: 'format', label: 'Format', key: 'format' },
  { id: 'aiResumeBuilder', label: 'AI resume builder', key: 'ai_resume_builder' },
  { id: 'aiCoverLetter', label: 'AI Cover Letter', key: 'ai_cover_letter' },
  { id: 'imagesInput', label: 'Images input', key: 'images_input' },
  { id: 'voiceInput', label: 'Voice input', key: 'voice_input' },
  { id: 'videoInput', label: 'Video input', key: 'video_input' },
  { id: 'fileInput', label: 'File input', key: 'file_input' },
  { id: 'wizardEdit', label: 'Wizard Edit', key: 'wizard_edit' },
  { id: 'learningHub', label: 'Learning Hub', key: 'learning_hub' },
  { id: 'skillGap', label: 'Skill gap', key: 'skill_gap' },
  { id: 'voiceInterview', label: 'Voice interview', key: 'voice_interview' },
  { id: 'videoInterview', label: 'Video interview', key: 'video_interview' },
  { id: 'questionInterview', label: 'Question interview', key: 'question_interview' },
  { id: 'positionSuggestion', label: 'Position Suggestion', key: 'position_suggestion' },
  { id: 'processingSpeed', label: 'Processing Speed', key: 'processing_speed' },
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
      const isPopular = id === 'careerPlus';

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
      const availability = ORDER.reduce((acc, planId) => {
        const row = byId.get(planId);
        const value = def.key ? row?.[def.key] : true;
        acc[planId] = valueToBool(value);
        return acc;
      }, {} as Record<PlanId, boolean>);

      return { id: def.id, label: def.label, availability };
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


