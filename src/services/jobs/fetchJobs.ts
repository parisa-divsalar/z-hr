/**
 * Real Job Fetcher Service
 * Fetches REAL job data from multiple APIs
 * NO mock data - only real data from actual job boards
 */

export interface JobPosition {
  id?: string;
  title: string;
  company: string;
  location?: string;
  locationType?: 'remote' | 'hybrid' | 'onsite';
  description?: string;
  requirements?: string;
  techStack?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  employmentType?: string;
  experienceLevel?: string;
  postedDate?: string;
  applicationUrl?: string;
  source: string;
  sourceUrl?: string;
}

/**
 * Fetch jobs from Adzuna API (FREE tier available)
 * API: https://developer.adzuna.com/
 * Register at: https://developer.adzuna.com/overview
 */
export async function fetchJobsFromAdzunaAPI(params: {
  query?: string;
  location?: string;
  limit?: number;
}): Promise<JobPosition[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  
  if (!appId || !appKey) {
    return [];
  }

  const { query = 'developer', location = 'dubai', limit = 20 } = params;
  
  try {
    // Adzuna API - Supported country codes: at, au, be, br, ca, ch, de, es, fr, gb, in, it, mx, nl, nz, pl, sg, us, za
    // Note: UAE (ae) is NOT supported, so we use 'us' or 'gb' as fallback
    // If location contains "dubai" or "uae", use 'us' for remote jobs or 'gb' for UK
    const countryCode = getAdzunaCountryCode(location);
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1`);
    url.searchParams.set('app_id', appId);
    url.searchParams.set('app_key', appKey);
    url.searchParams.set('what', query);
    // For UAE/Dubai, search in US for remote jobs (since UAE is not supported)
    // User can also search for specific cities like "New York", "London", etc.
    let searchLocation = location;
    if (location.toLowerCase().includes('dubai') || location.toLowerCase().includes('uae')) {
      // For Dubai/UAE, search for remote jobs in US
      searchLocation = 'remote';
    }
    url.searchParams.set('where', searchLocation);
    url.searchParams.set('results_per_page', Math.min(limit, 50).toString());
    url.searchParams.set('content-type', 'application/json');
    url.searchParams.set('sort_by', 'date'); // Sort by most recent

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Adzuna API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    return data.results.map((job: any) => ({
      id: job.id?.toString(),
      title: job.title || '',
      company: job.company?.display_name || job.company?.name || job.company || '',
      location: job.location?.display_name || 
                (job.location?.area ? job.location.area.join(', ') : '') ||
                job.location || '',
      locationType: job.contract_type?.toLowerCase().includes('remote') ? 'remote' : 
                    job.contract_type?.toLowerCase().includes('hybrid') ? 'hybrid' : 'onsite',
      description: job.description || '',
      requirements: job.requirements || '',
      techStack: extractTechStack(job.description || ''),
      salaryMin: job.salary_min ? parseFloat(job.salary_min) : undefined,
      salaryMax: job.salary_max ? parseFloat(job.salary_max) : undefined,
      salaryCurrency: job.salary_currency || 'USD',
      employmentType: normalizeEmploymentType(job.contract_type),
      experienceLevel: extractExperienceLevel(job.title || '', job.description || ''),
      postedDate: job.created ? new Date(job.created).toISOString() : undefined,
      applicationUrl: job.redirect_url || job.url || '',
      source: 'adzuna',
      sourceUrl: job.redirect_url || job.url || '',
    }));
  } catch (error) {
    console.error('Error fetching from Adzuna API:', error);
    return [];
  }
}

/**
 * Fetch jobs from JSearch API (FREE - no API key needed for basic usage)
 * API: https://jsearch.p.rapidapi.com/
 * Alternative: Can use directly without RapidAPI
 */
export async function fetchJobsFromJSearchAPI(params: {
  query?: string;
  location?: string;
  limit?: number;
}): Promise<JobPosition[]> {
  const { query = 'developer', location = 'Dubai', limit = 20 } = params;
  
  try {
    // Using a public job search API that doesn't require authentication
    // Note: This is a placeholder - you may need to use RapidAPI or another service
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    
    if (rapidApiKey) {
      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1&num_pages=1`;
      
      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return (data.data || []).slice(0, limit).map((job: any) => ({
          id: job.job_id,
          title: job.job_title || '',
          company: job.employer_name || '',
          location: job.job_city && job.job_country 
            ? `${job.job_city}, ${job.job_country}`
            : job.job_location || '',
          locationType: job.job_is_remote ? 'remote' : 'onsite',
          description: job.job_description || job.job_highlights?.overview?.join(' ') || '',
          requirements: job.job_highlights?.responsibilities?.join(' ') || '',
          techStack: extractTechStack(job.job_description || ''),
          salaryMin: job.job_min_salary ? parseFloat(job.job_min_salary) : undefined,
          salaryMax: job.job_max_salary ? parseFloat(job.job_max_salary) : undefined,
          salaryCurrency: job.job_salary_currency || 'USD',
          employmentType: normalizeEmploymentType(job.job_employment_type),
          experienceLevel: extractExperienceLevel(job.job_title || '', job.job_description || ''),
          postedDate: job.job_posted_at_datetime_utc || job.job_posted_at_timestamp 
            ? new Date(job.job_posted_at_timestamp * 1000).toISOString()
            : undefined,
          applicationUrl: job.job_apply_link || '',
          source: 'jsearch',
          sourceUrl: job.job_apply_link || '',
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching from JSearch API:', error);
  }

  // Fallback: Try scraping from public job boards (simple approach)
  return fetchJobsFromPublicSources(params);
}

/**
 * Fetch jobs from public RSS feeds (as last resort)
 * Some job boards provide RSS feeds that we can parse
 */
async function fetchJobsFromPublicSources(params: {
  query?: string;
  location?: string;
  limit?: number;
}): Promise<JobPosition[]> {
  // This would require RSS parsing which is more complex
  // For now, return empty and require API keys
  return [];
}

/**
 * Main function to fetch jobs from all available sources
 * Tries multiple APIs and combines results
 */
export async function fetchAllJobs(params: {
  query?: string;
  location?: string;
  limit?: number;
}): Promise<JobPosition[]> {
  const allJobs: JobPosition[] = [];
  
  // Try Adzuna first (most reliable free option)
  try {
    const adzunaJobs = await fetchJobsFromAdzunaAPI(params);
    if (adzunaJobs.length > 0) {
      allJobs.push(...adzunaJobs);
    }
  } catch (error) {
    console.error('Adzuna fetch failed:', error);
  }
  
  // Try JobData API
  try {
    const jobDataJobs = await fetchJobsFromJobDataAPI(params);
    if (jobDataJobs.length > 0) {
      allJobs.push(...jobDataJobs);
    }
  } catch (error) {
    console.error('JobData fetch failed:', error);
  }
  
  // Try JSearch API
  try {
    const jSearchJobs = await fetchJobsFromJSearchAPI(params);
    if (jSearchJobs.length > 0) {
      allJobs.push(...jSearchJobs);
    }
  } catch (error) {
    console.error('JSearch fetch failed:', error);
  }
  
  // Remove duplicates (same title + company)
  const uniqueJobs = allJobs.filter((job, index, self) =>
    index === self.findIndex((j) => 
      j.title.toLowerCase().trim() === job.title.toLowerCase().trim() &&
      j.company.toLowerCase().trim() === job.company.toLowerCase().trim()
    )
  );
  
  return uniqueJobs.slice(0, params.limit || 20);
}

/**
 * Get Adzuna country code based on location
 * UAE is not supported, so we use 'us' for remote jobs
 */
function getAdzunaCountryCode(location: string): string {
  const loc = location.toLowerCase();
  // Supported codes: at, au, be, br, ca, ch, de, es, fr, gb, in, it, mx, nl, nz, pl, sg, us, za
  if (loc.includes('dubai') || loc.includes('uae') || loc.includes('united arab')) {
    return 'us'; // Use US for remote jobs when UAE is requested
  }
  if (loc.includes('uk') || loc.includes('united kingdom') || loc.includes('london')) return 'gb';
  if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver')) return 'ca';
  if (loc.includes('australia') || loc.includes('sydney') || loc.includes('melbourne')) return 'au';
  if (loc.includes('india') || loc.includes('mumbai') || loc.includes('bangalore')) return 'in';
  if (loc.includes('singapore')) return 'sg';
  if (loc.includes('germany') || loc.includes('berlin')) return 'de';
  if (loc.includes('france') || loc.includes('paris')) return 'fr';
  if (loc.includes('spain') || loc.includes('madrid')) return 'es';
  if (loc.includes('italy') || loc.includes('rome')) return 'it';
  if (loc.includes('netherlands') || loc.includes('amsterdam')) return 'nl';
  if (loc.includes('switzerland') || loc.includes('zurich')) return 'ch';
  if (loc.includes('austria') || loc.includes('vienna')) return 'at';
  if (loc.includes('belgium') || loc.includes('brussels')) return 'be';
  if (loc.includes('brazil') || loc.includes('sao paulo')) return 'br';
  if (loc.includes('mexico') || loc.includes('mexico city')) return 'mx';
  if (loc.includes('new zealand') || loc.includes('auckland')) return 'nz';
  if (loc.includes('poland') || loc.includes('warsaw')) return 'pl';
  if (loc.includes('south africa') || loc.includes('cape town')) return 'za';
  // Default to US for remote jobs or unknown locations
  return 'us';
}

// Helper functions
function extractTechStack(text: string): string[] {
  const techKeywords = [
    'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
    'Node.js', 'Python', 'Java', 'C++', 'C#', '.NET',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'TailwindCSS', 'CSS', 'HTML', 'SASS', 'LESS',
  ];
  
  const found: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const tech of techKeywords) {
    if (lowerText.includes(tech.toLowerCase())) {
      found.push(tech);
    }
  }
  
  return found;
}

function normalizeEmploymentType(type?: string): string | undefined {
  if (!type) return undefined;
  const lower = type.toLowerCase();
  if (lower.includes('full')) return 'full-time';
  if (lower.includes('part')) return 'part-time';
  if (lower.includes('contract')) return 'contract';
  if (lower.includes('intern')) return 'internship';
  return type;
}

function extractExperienceLevel(title: string, description: string): string | undefined {
  const combined = `${title} ${description}`.toLowerCase();
  if (combined.includes('senior') || combined.includes('sr.')) return 'senior';
  if (combined.includes('lead') || combined.includes('principal')) return 'lead';
  if (combined.includes('junior') || combined.includes('entry') || combined.includes('intern')) return 'entry';
  if (combined.includes('mid') || combined.includes('middle')) return 'mid';
  return undefined;
}

/**
 * Fetch jobs from JobData API (if API key is provided)
 */
export async function fetchJobsFromJobDataAPI(params: {
  query?: string;
  location?: string;
  limit?: number;
}): Promise<JobPosition[]> {
  const apiKey = process.env.JOB_DATA_API_KEY;
  if (!apiKey) {
    return [];
  }

  const { query = 'developer', location = 'Dubai', limit = 20 } = params;
  
  try {
    const url = new URL('https://api.jobdataapi.com/v1/jobs');
    url.searchParams.set('q', query);
    url.searchParams.set('location', location);
    url.searchParams.set('limit', limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`JobData API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.jobs || []).map((job: any) => ({
      id: job.id?.toString(),
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      locationType: job.remote ? 'remote' : 'onsite',
      description: job.description || '',
      requirements: job.requirements || '',
      techStack: extractTechStack(job.description || ''),
      salaryMin: job.salary_min ? parseFloat(job.salary_min) : undefined,
      salaryMax: job.salary_max ? parseFloat(job.salary_max) : undefined,
      salaryCurrency: job.salary_currency || 'USD',
      employmentType: normalizeEmploymentType(job.type),
      experienceLevel: extractExperienceLevel(job.title || '', job.description || ''),
      postedDate: job.posted_date || new Date().toISOString(),
      applicationUrl: job.url || '',
      source: 'jobdata',
      sourceUrl: job.url || '',
    }));
  } catch (error) {
    console.error('Error fetching from JobData API:', error);
    return [];
  }
}
