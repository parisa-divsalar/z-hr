import { NextResponse } from 'next/server';

/**
 * Deprecated endpoint (old upstream-based skills categories).
 * Use `/api/skills/categories` instead.
 */
export async function GET() {
    return NextResponse.json({ error: 'Deprecated. Use /api/skills/categories instead.' }, { status: 410 });
}
