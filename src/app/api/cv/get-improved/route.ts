import { NextResponse } from 'next/server';

/**
 * Deprecated legacy endpoint (old upstream improve polling).
 * Use `/api/cv/improve` instead.
 */
export async function GET() {
    return NextResponse.json({ error: 'Deprecated. Use /api/cv/improve instead.' }, { status: 410 });
}

