import { NextResponse } from 'next/server';

import { fetchAllJobs } from '@/services/jobs/fetchJobs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/admin/test-jobs
 * Tests Adzuna (or other job APIs) - fetches 1 job to verify connection.
 */
export async function GET() {
  try {
    const jobs = await fetchAllJobs({ query: 'developer', location: 'New York', limit: 1 });
    const connected = jobs.length > 0;
    return NextResponse.json(
      {
        success: connected,
        message: connected
          ? `Jobs API connected. Got ${jobs.length} job(s).`
          : 'No jobs returned. Check ADZUNA_APP_ID / ADZUNA_APP_KEY in .env.local.',
        count: jobs.length,
        sample: jobs[0] ? { title: jobs[0].title, company: jobs[0].company, source: jobs[0].source } : null,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message, message: 'Jobs API test failed.' },
      { status: 200, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
