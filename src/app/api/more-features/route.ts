import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/more-features
 * Returns More Features data for the landing wizard step.
 */
export async function GET() {
  try {
    const rows = db.moreFeatures.findAll();
    return NextResponse.json(rows, { headers: corsHeaders });
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
















