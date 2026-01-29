import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/admin/test-ping
 * Simple health check - confirms Z-HR API is reachable from admin panel.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      message: 'Z-HR API is reachable',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
