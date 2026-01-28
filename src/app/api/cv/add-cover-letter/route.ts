import { NextResponse } from 'next/server';

/**
 * Deprecated endpoint (old upstream-based cover letter APIs).
 * Use `/api/cv/cover-letter` instead.
 */
export async function POST() {
    return NextResponse.json(
        { error: 'Deprecated. Use /api/cv/cover-letter (POST) instead.' },
        { status: 410 },
    );
}

export async function GET() {
    return NextResponse.json(
        { error: 'Deprecated. Use /api/cv/cover-letter (GET) instead.' },
        { status: 410 },
    );
}
