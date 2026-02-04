const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(process.cwd(), '.env.local');
const DATA_DIR = path.join(process.cwd(), 'data');
const SKILLS_FILE = path.join(DATA_DIR, 'skills.json');
const LEARNING_HUB_FILE = path.join(DATA_DIR, 'learning_hub_courses.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'youtube-sync-progress.json');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const TARGET_PER_SKILL = 5;
const DEFAULT_MAX_RESULTS = 5;
const RATE_LIMIT_MS = 120;

const loadEnv = () => {
  if (!fs.existsSync(ENV_PATH)) return;
  const content = fs.readFileSync(ENV_PATH, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) {
      process.env[key] = rest.join('=').trim();
    }
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJson = (filePath, fallback) => {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const readProgress = () => readJson(PROGRESS_FILE, { lastIndex: 0, addedTotal: 0 });
const writeProgress = (progress) => writeJson(PROGRESS_FILE, progress);

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`YouTube API ${response.status}: ${text.slice(0, 200)}`);
  }
  return response.json();
};

const inferLevel = (title) => {
  const normalized = String(title || '').toLowerCase();
  if (normalized.includes('beginner') || normalized.includes('basics') || normalized.includes('intro')) {
    return 'Junior';
  }
  if (normalized.includes('advanced') || normalized.includes('expert') || normalized.includes('masterclass')) {
    return 'Senior';
  }
  return 'Mid-level';
};

const mapToDbCourse = (item, category, skill) => {
  const title = item?.snippet?.title?.trim() || '';
  const videoId = item?.id?.videoId || '';
  if (!title || !videoId) return null;

  const imageUrl =
    item?.snippet?.thumbnails?.high?.url ||
    item?.snippet?.thumbnails?.medium?.url ||
    item?.snippet?.thumbnails?.default?.url ||
    undefined;

  return {
    title,
    level: inferLevel(title),
    price: 'Free',
    isFree: true,
    source: 'YouTube',
    source_url: `https://www.youtube.com/watch?v=${videoId}`,
    description: item?.snippet?.description?.trim() || undefined,
    image_url: imageUrl,
    category,
    skill,
  };
};

const fetchYouTubeCoursesForSkill = async (apiKey, skill, maxResults) => {
  const query = encodeURIComponent(`${skill} course`);
  const url = `${YOUTUBE_API_BASE}/search?part=snippet&type=video&maxResults=${maxResults}&order=relevance&q=${query}&key=${apiKey}`;
  const data = await fetchJson(url);
  return Array.isArray(data?.items) ? data.items : [];
};

const buildSkillCounts = (courses) => {
  const counts = new Map();
  for (const course of courses) {
    const skill = (course?.skill || '').trim();
    if (!skill) continue;
    counts.set(skill, (counts.get(skill) || 0) + 1);
  }
  return counts;
};

const buildSourceUrlSet = (courses) => {
  const urls = new Set();
  for (const course of courses) {
    const url = course?.source_url || course?.sourceUrl;
    if (url) urls.add(url);
  }
  return urls;
};

const main = async () => {
  loadEnv();
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is missing in .env.local');
  }

  const skills = readJson(SKILLS_FILE, []);
  if (!Array.isArray(skills) || skills.length === 0) {
    throw new Error('No skills found in data/skills.json');
  }

  const learningHubCourses = readJson(LEARNING_HUB_FILE, []);
  const skillCounts = buildSkillCounts(learningHubCourses);
  const sourceUrlSet = buildSourceUrlSet(learningHubCourses);
  const progress = readProgress();
  const startIndex = Math.max(0, Math.min(Number(progress.lastIndex || 0), skills.length));

  let addedTotal = Number(progress.addedTotal || 0);
  let processed = startIndex;
  let quotaExceeded = false;
  for (let i = startIndex; i < skills.length; i += 1) {
    const skillRow = skills[i];
    processed = i + 1;
    const skill = String(skillRow?.name || '').trim();
    const category = String(skillRow?.category || '').trim();
    if (!skill) continue;

    const existingCount = skillCounts.get(skill) || 0;
    const needed = Math.max(0, TARGET_PER_SKILL - existingCount);
    if (needed === 0) continue;

    try {
      const items = await fetchYouTubeCoursesForSkill(apiKey, skill, Math.max(DEFAULT_MAX_RESULTS, needed));
      const mapped = items
        .map((item) => mapToDbCourse(item, category || 'General', skill))
        .filter(Boolean);

      let addedForSkill = 0;
      for (const course of mapped) {
        if (addedForSkill >= needed) break;
        if (sourceUrlSet.has(course.source_url)) continue;
        sourceUrlSet.add(course.source_url);
        learningHubCourses.push({
          id: (learningHubCourses.at(-1)?.id || 0) + 1,
          ...course,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        addedForSkill += 1;
        addedTotal += 1;
      }

      if (addedForSkill > 0) {
        skillCounts.set(skill, existingCount + addedForSkill);
      }
    } catch (error) {
      const message = error?.message || String(error);
      console.error(`Failed to fetch for skill "${skill}":`, message);
      if (String(message).includes('YouTube API 403') && String(message).includes('quota')) {
        quotaExceeded = true;
        writeJson(LEARNING_HUB_FILE, learningHubCourses);
        writeProgress({ lastIndex: i, addedTotal });
        break;
      }
    }

    if (processed % 25 === 0) {
      console.log(`Progress: ${processed}/${skills.length} skills, added ${addedTotal}`);
      writeJson(LEARNING_HUB_FILE, learningHubCourses);
      writeProgress({ lastIndex: i, addedTotal });
    }

    await delay(RATE_LIMIT_MS);
  }

  writeJson(LEARNING_HUB_FILE, learningHubCourses);
  writeProgress({ lastIndex: quotaExceeded ? processed : skills.length, addedTotal });
  if (quotaExceeded) {
    console.log('Stopped early بسبب پایان quota. برای ادامه، بعد از reset quota دوباره اجرا کن.');
  } else {
    console.log(`Done. Added ${addedTotal} courses. Total now ${learningHubCourses.length}.`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
