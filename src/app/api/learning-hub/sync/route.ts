import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { fetchCoursesFromUdemyRapidAPI } from '@/services/learningHub/fetchCourses';

const SYNC_INTERVAL_MINUTES = 5;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET/POST /api/learning-hub/sync
 * Fetches courses from Udemy (RapidAPI) and merges into learning_hub_courses.
 * Call every 5 min (cron or scheduler) to keep list updated.
 * Requires RAPIDAPI_KEY in .env.local (same key as for Jobs).
 */
export async function GET() {
  return runSync();
}

export async function POST() {
  return runSync();
}

async function runSync() {
  try {
    const courses = await fetchCoursesFromUdemyRapidAPI();
    const toInsert = courses.map((c) => ({
      title: c.title,
      level: c.level,
      price: c.price,
      isFree: c.isFree,
      source: c.source,
      source_url: c.source_url,
      description: c.description,
      image_url: c.image_url,
    }));
    const added = db.learningHubCourses.addMany(toInsert);
    const total = db.learningHubCourses.findAll().length;

    let message = `Synced. ${added} new course(s) added. Total: ${total}. Next sync in ${SYNC_INTERVAL_MINUTES} min.`;
    if (courses.length === 0) {
      message =
        '0 courses fetched from Udemy API. Check: 1) RAPIDAPI_KEY is set in .env.local in the main project root (where you run npm run dev). 2) You are subscribed to "udemy-paid-courses-for-free-api" on RapidAPI. 3) Restart the dev server after adding the key.';
    } else if (added === 0 && total === 0) {
      message = `API returned ${courses.length} course(s) but none were saved. Check response format or duplicates. Total: ${total}.`;
    }

    return NextResponse.json(
      {
        success: true,
        added,
        total,
        fetched: courses.length,
        message,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in /api/learning-hub/sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
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
