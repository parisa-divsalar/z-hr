import { NextResponse } from 'next/server';

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
export async function GET() {
  try {
    const rows = db.learningHubCourses.findAll();
    const items = rows.map((c: Record<string, unknown>) => ({
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
