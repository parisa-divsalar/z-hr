import { NextResponse } from 'next/server';

/**
 * Deprecated legacy endpoint (old upstream proxy).
 * Use `/api/cv/analyze` instead.
 */
export async function POST() {
    return NextResponse.json({ error: 'Deprecated. Use /api/cv/analyze instead.' }, { status: 410 });
}

