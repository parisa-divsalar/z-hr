import { NextRequest, NextResponse } from 'next/server';

import { fetchAllJobs } from '@/services/jobs/fetchJobs';

/**
 * GET /api/jobs/test
 * Fetch REAL job data from multiple APIs (NO mock data)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'developer';
    const location = searchParams.get('location') || 'Dubai';
    const limit = parseInt(searchParams.get('limit') || '20');

    const params = { query, location, limit };
    
    // Fetch from all available APIs
    const jobs = await fetchAllJobs(params);
    
    // Extract sources from jobs
    const sources = [...new Set(jobs.map(job => job.source))];

    if (jobs.length === 0) {
      return NextResponse.json({
        success: false,
        count: 0,
        jobs: [],
        message: '⚠️ No real job data found. Please configure at least one API key.',
        instructions: {
          title: 'How to get API keys:',
          steps: [
            {
              name: 'Adzuna API (Recommended - Free)',
              url: 'https://developer.adzuna.com/signup',
              envVars: ['ADZUNA_APP_ID', 'ADZUNA_APP_KEY'],
              description: 'Register for free and get app_id and app_key',
            },
            {
              name: 'JSearch API (via RapidAPI)',
              url: 'https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch',
              envVars: ['RAPIDAPI_KEY'],
              description: 'Subscribe to JSearch API on RapidAPI',
            },
            {
              name: 'JobData API',
              url: 'https://jobdataapi.com/',
              envVars: ['JOB_DATA_API_KEY'],
              description: 'Register and get API key',
            },
          ],
        },
        sources: [],
      }, { status: 200 }); // Return 200 so UI can show helpful message
    }

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
      sources,
      message: `Fetched ${jobs.length} real jobs from: ${sources.join(', ')}`,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        message: 'Please configure API keys in .env.local file',
      },
      { status: 500 }
    );
  }
}
