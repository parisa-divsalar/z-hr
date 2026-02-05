import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { fetchAdzunaJobsMultiplePages } from '@/services/jobs/fetchJobs';
import { getMainSkillResolverFromDb } from '@/services/jobs/main-skill';

const SYNC_INTERVAL_MINUTES = 5;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/jobs/sync
 * Fetches many jobs from Adzuna (multiple pages + multiple queries) and merges into database.
 * Call this every 5 min (cron or scheduler) to keep job_positions updated.
 */
export async function GET() {
  try {
    const pickMainSkill = getMainSkillResolverFromDb();

    const jobs = await fetchAdzunaJobsMultiplePages({
      location: 'New York',
      resultsPerPage: 50,
      maxPages: 10,
      queries: ['developer', 'software engineer', 'frontend', 'backend', 'full stack'],
    });

    const toInsert = jobs.map((j) => ({
      external_id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      locationType: j.locationType,
      description: j.description,
      requirements: j.requirements,
      techStack: j.techStack,
      main_skill: pickMainSkill(j),
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      salaryCurrency: j.salaryCurrency,
      employmentType: j.employmentType,
      experienceLevel: j.experienceLevel,
      postedDate: j.postedDate,
      applicationUrl: j.applicationUrl,
      source: j.source,
      sourceUrl: j.sourceUrl || j.applicationUrl,
    }));

    const added = db.jobPositions.addMany(toInsert);
    const total = db.jobPositions.findAll().length;
    const activeCount = db.jobPositions.findActive().length;
    const newCount = db.jobPositions.findNewlyAdded(SYNC_INTERVAL_MINUTES).length;

    return NextResponse.json(
      {
        success: true,
        added,
        total,
        activeCount,
        newCount,
        message: `Synced. ${added} new job(s) added. Total: ${total}. Next sync in ${SYNC_INTERVAL_MINUTES} min.`,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in /api/jobs/sync:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST() {
  return GET();
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
