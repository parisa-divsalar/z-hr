import { NextResponse } from 'next/server';

/**
 * Deprecated legacy endpoint (old upstream analysis details).
 * Use `/api/cv/analyze` and/or stored CV data via `/api/cv/get-cv` instead.
 */
export async function GET() {
    return NextResponse.json(
        { error: 'Deprecated. Use /api/cv/analyze or /api/cv/get-cv instead.' },
        { status: 410 },
    );
}

