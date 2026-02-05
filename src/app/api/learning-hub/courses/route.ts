import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/learning-hub/courses
 * Returns all Learning Hub courses from DB (for the Learning Hub page).
 */
export async function GET(request: NextRequest) {
  try {
    const rows = db.learningHubCourses.findAll();

    // Query param: ?skill=...
    const skillQuery = request.nextUrl.searchParams.get('skill')?.trim() ?? '';
    const normalized = skillQuery.toLowerCase();

    const filteredRows =
      normalized.length > 0
        ? rows.filter((c: Record<string, unknown>) => {
            const title = String(c.title ?? '').toLowerCase();
            const description = String((c as any).description ?? '').toLowerCase();
            const category = String((c as any).category ?? '').toLowerCase();
            const skill = String((c as any).skill ?? '').toLowerCase();
            return (
              title.includes(normalized) ||
              description.includes(normalized) ||
              category.includes(normalized) ||
              skill.includes(normalized)
            );
          })
        : rows;

    const items = filteredRows.map((c: Record<string, unknown>) => ({
      id: c.id,
      title: c.title,
      level: c.level ?? 'Mid-level',
      price: c.price ?? 'Free',
      isFree: c.isFree === true,
      image: c.image_url ?? c.imageUrl ?? undefined,
    }));
    return NextResponse.json(items, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in /api/learning-hub/courses:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load courses' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...corsHeaders, 'Access-Control-Max-Age': '86400' },
  });
}
