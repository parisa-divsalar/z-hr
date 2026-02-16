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
 * GET /api/pricing/coin-packages
 * Public endpoint for pricing UI (coin packages list).
 * Reads from file-based JSON DB (coin_packages.json via db.coinPackages.findAll()).
 */
export async function GET() {
  try {
    const prisma = getPrismaOrNull();
    const rows = prisma
      ? await prisma.coinPackage.findMany({
          orderBy: [{ priceAed: 'asc' }, { coinAmount: 'asc' }],
          select: {
            id: true,
            packageName: true,
            coinAmount: true,
            priceAed: true,
            aedPerCoin: true,
            calculatorValueAed: true,
            userSavingPercent: true,
          },
        }).then((items) =>
          items.map((p) => ({
            id: p.id,
            package_name: p.packageName,
            coin_amount: p.coinAmount,
            price_aed: p.priceAed,
            aed_per_coin: p.aedPerCoin,
            calculator_value_aed: p.calculatorValueAed,
            user_saving_percent: p.userSavingPercent,
          }))
        )
      : (db.coinPackages.findAll() ?? []);
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

