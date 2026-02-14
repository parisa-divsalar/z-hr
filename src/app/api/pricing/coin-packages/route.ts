import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store, max-age=0',
};

/**
 * GET /api/pricing/coin-packages
 * Public endpoint for pricing UI (coin packages list).
 * Reads from file-based JSON DB (coin_packages.json via db.coinPackages.findAll()).
 */
export async function GET() {
  try {
    const rows = db.coinPackages.findAll() ?? [];
    return NextResponse.json({ data: rows, generatedAt: new Date().toISOString() }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in /api/pricing/coin-packages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load coin packages' },
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

