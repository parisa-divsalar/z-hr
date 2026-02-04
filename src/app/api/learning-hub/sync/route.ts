import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { fetchCoursesFromUdemyRapidAPI } from '@/services/learningHub/fetchCourses';

const SYNC_INTERVAL_MINUTES = 5;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SEED_COURSES = [
  {
    title: 'Front-end Path',
    level: 'Mid-senior',
    price: '$20',
    isFree: true,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/front-end-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
  {
    title: 'Back-end Path',
    level: 'Senior',
    price: '$25',
    isFree: false,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/back-end-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
  {
    title: 'Full Stack Path',
    level: 'Mid-level',
    price: '$30',
    isFree: true,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/full-stack-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
  {
    title: 'DevOps Path',
    level: 'Mid-senior',
    price: '$22',
    isFree: true,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/devops-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
  {
    title: 'UI/UX Design Path',
    level: 'Junior',
    price: '$15',
    isFree: false,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/ui-ux-design-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
  {
    title: 'Mobile Development Path',
    level: 'Senior',
    price: '$28',
    isFree: true,
    source: 'Seed',
    source_url: 'https://z-hr.local/learning-hub/seed/mobile-development-path',
    description: 'Demo seed course. Set RAPIDAPI_KEY to sync real courses.',
  },
] as const;

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
  const totalBefore = db.learningHubCourses.findAll().length;
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

    // Dev-friendly fallback: if API key is missing and DB is empty, seed demo courses
    // so the admin panel table doesn't stay at 0 during local development.
    const msg = error instanceof Error ? error.message : 'Sync failed';
    if (totalBefore === 0 && msg.toLowerCase().includes('rapidapi_key is missing')) {
      const seeded = db.learningHubCourses.addMany(SEED_COURSES as any[]);
      const total = db.learningHubCourses.findAll().length;
      return NextResponse.json(
        {
          success: true,
          added: seeded,
          total,
          fetched: 0,
          message:
            `RAPIDAPI_KEY is missing, so ${seeded} demo course(s) were seeded locally. ` +
            'Set RAPIDAPI_KEY in the main project .env.local and restart the server to sync real courses.',
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: msg,
        total: totalBefore,
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
