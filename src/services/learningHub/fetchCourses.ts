/**
 * Fetch courses from Udemy Paid Courses for Free API (RapidAPI).
 * API: https://rapidapi.com/udemy-paid-courses-for-free-api/api/udemy-paid-courses-for-free-api
 * Uses same RAPIDAPI_KEY as jobs (JSearch).
 */

const UDEMY_RAPIDAPI_HOST = 'udemy-paid-courses-for-free-api.p.rapidapi.com';
const BASE_URL = `https://${UDEMY_RAPIDAPI_HOST}/rapidapi/courses/search`;

export type RawCourseForDb = {
  title: string;
  level: string;
  price: string;
  isFree: boolean;
  source: string;
  source_url: string;
  description?: string;
  image_url?: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize a single course from API response (handles various field names).
 */
function mapCourseItem(item: Record<string, unknown>): RawCourseForDb | null {
  const title =
    (item.title as string) ||
    (item.name as string) ||
    (item.headline as string) ||
    (item.course_title as string) ||
    '';
  const url =
    (item.url as string) ||
    (item.link as string) ||
    (item.course_url as string) ||
    (item.udemy_url as string) ||
    (item.link_to_course as string) ||
    (item.course_link as string) ||
    '';
  const slug = item.slug as string;
  const finalUrl = url || (typeof slug === 'string' && slug ? `https://www.udemy.com/course/${slug}/` : '');
  if (!title || !finalUrl) return null;

  const priceNum = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0));
  const salePrice =
    typeof item.sale_price === 'number' ? item.sale_price : parseFloat(String(item.sale_price ?? priceNum));
  const isFree = salePrice === 0 || priceNum === 0 || (item.is_paid as boolean) === false;
  const price = isFree ? 'Free' : salePrice > 0 ? `$${salePrice}` : `$${priceNum}`;

  const image =
    (item.image as string) ||
    (item.image_240x135 as string) ||
    (item.thumbnail as string) ||
    (item.preview_image as string) ||
    '';

  const description = (item.description as string) || (item.headline as string) || undefined;

  return {
    title,
    level: (item.level as string) || 'Mid-level',
    price,
    isFree,
    source: 'Udemy',
    source_url: finalUrl.startsWith('http') ? finalUrl : `https://www.udemy.com${finalUrl.startsWith('/') ? '' : '/'}${finalUrl}`,
    description: description || undefined,
    image_url: image || undefined,
  };
}

/**
 * Extract array of courses from API response (handles different response shapes).
 */
function extractCourses(data: unknown): RawCourseForDb[] {
  if (!data || typeof data !== 'object') return [];
  const d = data as Record<string, unknown>;
  let list: unknown[] = [];
  if (Array.isArray(d.results)) list = d.results;
  else if (Array.isArray(d.data)) list = d.data;
  else if (Array.isArray(d.courses)) list = d.courses;
  else if (Array.isArray(d.items)) list = d.items;
  else if (Array.isArray(d.list)) list = d.list;
  else if (Array.isArray(d)) list = d as unknown[];
  else if (d.data && typeof d.data === 'object' && Array.isArray((d.data as Record<string, unknown>).courses)) {
    list = (d.data as Record<string, unknown>).courses as unknown[];
  }
  else if (d.result && Array.isArray(d.result)) list = d.result;
  else if (d.body && typeof d.body === 'object' && Array.isArray((d.body as Record<string, unknown>).courses)) {
    list = (d.body as Record<string, unknown>).courses as unknown[];
  }
  const out: RawCourseForDb[] = [];
  for (const item of list) {
    if (item && typeof item === 'object') {
      const mapped = mapCourseItem(item as Record<string, unknown>);
      if (mapped) out.push(mapped);
    }
  }
  return out;
}

/**
 * Fetch one page of courses from Udemy API.
 */
async function fetchUdemySearchPage(params: {
  query: string;
  page: number;
  pageSize: number;
  apiKey: string;
}): Promise<RawCourseForDb[]> {
  const { query, page, pageSize, apiKey } = params;
  const url = new URL(BASE_URL);
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(pageSize));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-host': UDEMY_RAPIDAPI_HOST,
      'x-rapidapi-key': apiKey,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Udemy API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return extractCourses(data);
}

/**
 * Fetch courses from Udemy (multiple queries and pages) for Learning Hub sync.
 * Call every 5 min via cron or GET /api/learning-hub/sync.
 */
export async function fetchCoursesFromUdemyRapidAPI(): Promise<RawCourseForDb[]> {
  const apiKey = process.env.RAPIDAPI_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'RAPIDAPI_KEY is missing. Add it to .env.local in the main project root (where you run npm run dev), then restart the server.'
    );
  }

  const queries = ['python', 'javascript', 'react', 'web development', 'programming'];
  const pageSize = 20;
  const maxPages = 2;
  const all: RawCourseForDb[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    for (let page = 1; page <= maxPages; page++) {
      try {
        const courses = await fetchUdemySearchPage({ query, page, pageSize, apiKey });
        for (const c of courses) {
          if (!seenUrls.has(c.source_url)) {
            seenUrls.add(c.source_url);
            all.push(c);
          }
        }
        await delay(250);
      } catch (e) {
        console.error(`Learning Hub fetch error (query=${query}, page=${page}):`, e);
      }
    }
  }

  return all;
}
