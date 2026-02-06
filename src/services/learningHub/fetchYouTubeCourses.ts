/**
 * Fetch courses from YouTube Data API v3 (playlists).
 * Uses YOUTUBE_API_KEY from environment variables.
 * Searches for educational playlists based on predefined queries.
 */

import { LearningHubCourse } from '@/type/learningHub';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

type YouTubePlaylistSearchItem = {
  id?: {
    kind?: string;
    playlistId?: string;
  };
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

type YouTubeSearchResponse = {
  items?: YouTubePlaylistSearchItem[];
  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };
};

/**
 * Infer course level from title text.
 */
function inferLevel(title: string): string {
  const normalized = title.toLowerCase();
  if (normalized.includes('beginner') || normalized.includes('basics') || normalized.includes('intro')) {
    return 'Junior';
  }
  if (normalized.includes('advanced') || normalized.includes('expert') || normalized.includes('masterclass')) {
    return 'Senior';
  }
  return 'Mid-level';
}

/**
 * Fetch YouTube playlists for a given search query.
 */
export async function fetchYouTubePlaylists(
  query: string = 'programming course'
): Promise<LearningHubCourse[]> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY not configured. Add it to .env.local');
  }

  const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('type', 'playlist');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('maxResults', '20');
  searchUrl.searchParams.set('key', apiKey);

  const response = await fetch(searchUrl.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API ${response.status}: ${text.slice(0, 200)}`);
  }

  const data: YouTubeSearchResponse = await response.json();
  const items = data.items || [];

  return items.map((item, index) => {
    const title = item.snippet?.title?.trim() || 'Untitled Playlist';
    const playlistId = item.id?.playlistId || '';
    const thumbnailUrl =
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url ||
      undefined;

    return {
      id: Date.now() + index,
      title,
      level: inferLevel(title),
      price: 'Free',
      isFree: true,
      source: 'YouTube',
      source_url: `https://www.youtube.com/playlist?list=${playlistId}`,
      sourceUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
      description: item.snippet?.description?.trim() || undefined,
      image_url: thumbnailUrl,
      imageUrl: thumbnailUrl,
    };
  });
}

/**
 * Fetch YouTube playlists for multiple predefined queries.
 * Returns unique courses (deduped by source_url).
 */
export async function fetchYouTubePlaylistCourses(queries?: string[]): Promise<LearningHubCourse[]> {
  const defaultQueries = [
    'React course',
    'Node.js course',
    'Python programming',
    'JavaScript tutorial',
    'TypeScript course',
    'Web development',
    'Data science course',
    'Machine learning tutorial',
  ];

  const searchQueries = queries && queries.length > 0 ? queries : defaultQueries;
  const allCourses: LearningHubCourse[] = [];
  const seenUrls = new Set<string>();

  for (const query of searchQueries) {
    try {
      const courses = await fetchYouTubePlaylists(query);
      for (const course of courses) {
        if (course.source_url && !seenUrls.has(course.source_url)) {
          seenUrls.add(course.source_url);
          allCourses.push(course);
        }
      }
      // Small delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`YouTube playlist fetch error (query=${query}):`, error);
    }
  }

  return allCourses;
}
