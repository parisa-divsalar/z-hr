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
 * GET /api/pricing/resume-feature-pricing
 * Public endpoint for pricing UI (features/coins calculator).
 * Reads from file-based JSON DB (resume_feature_pricing.json via db.resumeFeaturePricing.findAll()).
 */
export async function GET() {
  try {
    const prisma = getPrismaOrNull();
    const rows = prisma
      ? await prisma.$queryRaw`SELECT * FROM resume_feature_pricing ORDER BY id ASC`
      : (db.resumeFeaturePricing.findAll() ?? []);
    return NextResponse.json({ data: rows, generatedAt: new Date().toISOString() }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in /api/pricing/resume-feature-pricing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load resume feature pricing' },
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

