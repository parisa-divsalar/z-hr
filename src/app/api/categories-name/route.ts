import { NextResponse } from 'next/server';

/**
 * Deprecated endpoint (old upstream-based skills by category).
 * Use `/api/skills/by-category?category=...` instead.
 */
export async function GET() {
    return NextResponse.json({ error: 'Deprecated. Use /api/skills/by-category instead.' }, { status: 410 });
}
