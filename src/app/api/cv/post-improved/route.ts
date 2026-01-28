import { NextResponse } from 'next/server';

/**
 * Deprecated legacy endpoint (old upstream improve flow).
 * Use `/api/cv/improve` instead.
 */
export async function POST() {
    return NextResponse.json({ error: 'Deprecated. Use /api/cv/improve instead.' }, { status: 410 });
}

