import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { fetchCoursesFromYouTube } from '@/services/learningHub/youtube';
import { fetchYouTubePlaylistCourses } from '@/services/learningHub/fetchYouTubeCourses';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const parseIntSafe = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export async function GET(request: NextRequest) {
  return runSync(request);
}

export async function POST(request: NextRequest) {
  return runSync(request);
}

async function runSync(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const usePlaylistsOnly = params.get('playlists') === 'true';

    let courses;
    if (usePlaylistsOnly) {
      // Fetch YouTube playlists only
      courses = await fetchYouTubePlaylistCourses();
    } else {
      // Fetch YouTube videos (existing behavior)
      const maxCategories = parseIntSafe(params.get('maxCategories'), 6);
      const maxSkillsPerCategory = parseIntSafe(params.get('maxSkillsPerCategory'), 3);
      const maxPerSkill = parseIntSafe(params.get('maxPerSkill'), 5);

      courses = await fetchCoursesFromYouTube({
        maxCategories,
        maxSkillsPerCategory,
        maxPerSkill,
      });
    }

    const added = db.learningHubCourses.addMany(courses);
    const total = db.learningHubCourses.findAll().length;

    return NextResponse.json(
      {
        success: true,
        added,
        total,
        fetched: courses.length,
        message: `YouTube sync complete. ${added} new course(s) added.`,
        source: usePlaylistsOnly ? 'playlists' : 'videos'
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in /api/learning-hub/youtube/sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'YouTube sync failed',
      },
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
