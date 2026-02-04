import { db } from '@/lib/db';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export type YouTubeCourseForDb = {
  title: string;
  level: string;
  price: string;
  isFree: boolean;
  source: string;
  source_url: string;
  description?: string;
  image_url?: string;
  category?: string;
  skill?: string;
};

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type YouTubeVideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    tags?: string[];
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

const DEFAULT_FALLBACK_CATEGORIES = [
  { category: 'Programming Languages', skills: ['Python', 'JavaScript', 'TypeScript'] },
  { category: 'Web Development', skills: ['React', 'Next.js', 'Node.js'] },
  { category: 'Data Science', skills: ['Data Science', 'Machine Learning', 'SQL'] },
  { category: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Kubernetes'] },
];

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API ${response.status}: ${text.slice(0, 200)}`);
  }
  return response.json() as Promise<T>;
};

const inferLevel = (title: string): string => {
  const normalized = title.toLowerCase();
  if (normalized.includes('beginner') || normalized.includes('basics') || normalized.includes('intro')) {
    return 'Junior';
  }
  if (normalized.includes('advanced') || normalized.includes('expert') || normalized.includes('masterclass')) {
    return 'Senior';
  }
  return 'Mid-level';
};

const mapToDbCourse = (video: YouTubeVideoItem, category: string, skill: string): YouTubeCourseForDb | null => {
  const title = video.snippet?.title?.trim() || '';
  const id = video.id?.trim() || '';
  if (!title || !id) return null;

  const image =
    video.snippet?.thumbnails?.high?.url ||
    video.snippet?.thumbnails?.medium?.url ||
    video.snippet?.thumbnails?.default?.url ||
    undefined;

  return {
    title,
    level: inferLevel(title),
    price: 'Free',
    isFree: true,
    source: 'YouTube',
    source_url: `https://www.youtube.com/watch?v=${id}`,
    description: video.snippet?.description?.trim() || undefined,
    image_url: image,
    category,
    skill,
  };
};

const getSkillCategoriesFromDb = (maxCategories: number, maxSkillsPerCategory: number) => {
  const skills = db.skills.findAll();
  if (!Array.isArray(skills) || skills.length === 0) {
    return DEFAULT_FALLBACK_CATEGORIES.slice(0, maxCategories);
  }

  const grouped = new Map<string, string[]>();
  for (const row of skills) {
    const category = String(row.category || '').trim();
    const name = String(row.name || '').trim();
    if (!category || !name) continue;
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(name);
  }

  const sortedCategories = Array.from(grouped.entries())
    .map(([category, names]) => ({ category, count: names.length, names }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCategories);

  return sortedCategories.map(({ category, names }) => ({
    category,
    skills: Array.from(new Set(names)).sort().slice(0, maxSkillsPerCategory),
  }));
};

const fetchYouTubeVideos = async (apiKey: string, query: string, maxResults: number) => {
  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('maxResults', String(maxResults));
  searchUrl.searchParams.set('order', 'relevance');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('key', apiKey);

  const searchResponse = await fetchJson<{ items?: YouTubeSearchItem[] }>(searchUrl.toString());
  const ids = (searchResponse.items || [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const detailsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
  detailsUrl.searchParams.set('part', 'snippet');
  detailsUrl.searchParams.set('id', ids.join(','));
  detailsUrl.searchParams.set('key', apiKey);

  const detailsResponse = await fetchJson<{ items?: YouTubeVideoItem[] }>(detailsUrl.toString());
  return detailsResponse.items || [];
};

export const fetchCoursesFromYouTube = async (options?: {
  maxCategories?: number;
  maxSkillsPerCategory?: number;
  maxPerSkill?: number;
}) => {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is missing. Add it to .env.local.');
  }

  const maxCategories = Math.min(8, Math.max(1, options?.maxCategories ?? 6));
  const maxSkillsPerCategory = Math.min(5, Math.max(1, options?.maxSkillsPerCategory ?? 3));
  const maxPerSkill = Math.min(10, Math.max(1, options?.maxPerSkill ?? 5));

  const categories = getSkillCategoriesFromDb(maxCategories, maxSkillsPerCategory);
  const results: YouTubeCourseForDb[] = [];
  const seen = new Set<string>();

  for (const { category, skills } of categories) {
    for (const skill of skills) {
      const query = `${skill} course`;
      const videos = await fetchYouTubeVideos(apiKey, query, maxPerSkill);
      for (const video of videos) {
        const mapped = mapToDbCourse(video, category, skill);
        if (!mapped) continue;
        if (seen.has(mapped.source_url)) continue;
        seen.add(mapped.source_url);
        results.push(mapped);
      }
    }
  }

  return results;
};
