import { db } from '@/lib/db';

type SkillRow = { name?: string; category?: string };

type MainSkillResolver = (job: {
  title?: string;
  description?: string;
  requirements?: string;
  techStack?: string[] | null;
}) => string | null;

export function buildMainSkillResolver(skills: SkillRow[]): MainSkillResolver {
  const skillToCategory = new Map<string, string>();
  const categories = new Set<string>();

  for (const skill of skills) {
    const name = String(skill?.name ?? '').trim();
    const category = String(skill?.category ?? '').trim();
    if (!name || !category) continue;
    skillToCategory.set(name.toLowerCase(), category);
    categories.add(category);
  }

  return (job) => {
    if (categories.size === 0 || skillToCategory.size === 0) return null;

    const scores = new Map<string, number>();
    const addScore = (category: string, weight = 1) => {
      scores.set(category, (scores.get(category) ?? 0) + weight);
    };

    const techStack = Array.isArray(job?.techStack) ? job.techStack : [];
    for (const tech of techStack) {
      const key = String(tech ?? '').trim().toLowerCase();
      if (!key) continue;
      const category = skillToCategory.get(key);
      if (category) addScore(category, 3);
    }

    if (scores.size === 0) {
      const text = `${job?.title ?? ''} ${job?.description ?? ''} ${job?.requirements ?? ''}`.toLowerCase();
      if (text.trim()) {
        for (const [skillKey, category] of skillToCategory.entries()) {
          if (!skillKey) continue;
          const isShortAlpha = skillKey.length <= 2 && /^[a-z0-9]+$/i.test(skillKey);
          if (isShortAlpha) continue;
          if (text.includes(skillKey)) addScore(category, 1);
        }
      }
    }

    let best: string | null = null;
    let bestScore = 0;
    for (const [category, score] of scores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        best = category;
      }
    }

    return bestScore > 0 ? best : null;
  };
}

export function getMainSkillResolverFromDb(): MainSkillResolver {
  const skills = db.skills.findAll() as SkillRow[];
  return buildMainSkillResolver(skills);
}
