import { NextResponse } from 'next/server';

import { USER_STATE_DEFINITIONS, USER_STATE_EVENTS } from '@/routes/user-state-events';

export const runtime = 'nodejs';

/**
 * GET /api/user-states/definitions
 * Returns user state definitions and supported event list for frontend usage.
 */
export async function GET() {
  return NextResponse.json({
    states: USER_STATE_DEFINITIONS,
    events: USER_STATE_EVENTS,
    generatedAt: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
