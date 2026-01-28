import { NextResponse } from 'next/server';

/**
 * Deprecated legacy endpoint (old upstream proxy).
 * Use `/api/cv/add-cv` or `/api/cv/edit-cv` instead.
 */
export async function POST() {
    return NextResponse.json(
        { error: 'Deprecated. Use /api/cv/add-cv or /api/cv/edit-cv instead.' },
        { status: 410 },
    );
}

