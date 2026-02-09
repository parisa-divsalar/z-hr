import { db } from '@/lib/db';

export type SuggestedJob = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  locationType?: string;
  postedDate?: string;
  description?: string;
  techStack?: string[];
  applicationUrl?: string;
  fitScore: number; // 0..100
  matchedResumeName: string;
};

function safeJsonParse(value: unknown): any | null {
  if (value == null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeSkill(s: unknown): string {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function extractCategory(raw: unknown): string {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  // e.g. "Wizard Status: Web Development • Visa: work_visa" -> "Web Development"
  const afterColon = s.includes(':') ? s.split(':').slice(1).join(':').trim() : s;
  const beforeBullet = afterColon.split('•')[0]?.trim() ?? afterColon;
  return beforeBullet;
}

function extractResumeSkills(cvRow: any): string[] {
  const parsed = safeJsonParse(cvRow?.content) ?? cvRow?.content ?? null;
  const root = parsed?.content && typeof parsed?.content === 'object' ? parsed.content : parsed;
  const skills1 = Array.isArray(root?.skills) ? root.skills : [];
  const skills2 = Array.isArray(root?.skillList) ? root.skillList : [];

  const analysis = safeJsonParse(cvRow?.analysis_result) ?? safeJsonParse(root?.analysis_result);
  const analysisSkills = Array.isArray(analysis?.improvedResume?.technicalSkills)
    ? analysis.improvedResume.technicalSkills
    : [];

  const merged = [...skills1, ...skills2, ...analysisSkills].map(normalizeSkill).filter(Boolean);
  return Array.from(new Set(merged));
}

function extractResumeDisplayName(cvRow: any, user: any): string {
  const parsed = safeJsonParse(cvRow?.content) ?? cvRow?.content ?? null;
  const root = parsed?.content && typeof parsed?.content === 'object' ? parsed.content : parsed;
  const name =
    String(root?.profile?.fullName ?? root?.fullName ?? root?.name ?? (cvRow?.title as any) ?? user?.name ?? '').trim() ||
    'Your';
  return name;
}

function computeFitScore(resumeSkills: string[], jobRow: any, resumeCategory: string): number {
  const jobTech = Array.isArray(jobRow?.techStack) ? jobRow.techStack : [];
  const jobTechNorm = jobTech.map(normalizeSkill).filter(Boolean);

  const jobCategory = String(jobRow?.main_skill ?? '').trim().toLowerCase();
  const resumeCatNorm = String(resumeCategory ?? '').trim().toLowerCase();
  const categoryMatch = Boolean(jobCategory && resumeCatNorm && jobCategory === resumeCatNorm);

  if (jobTechNorm.length === 0) {
    return categoryMatch ? 75 : 55;
  }

  const resumeSet = new Set(resumeSkills);
  let hit = 0;
  for (const t of jobTechNorm) {
    if (resumeSet.has(t)) hit += 1;
  }
  const ratio = hit / jobTechNorm.length; // 0..1
  let score = 50 + Math.round(50 * ratio);
  if (categoryMatch) score += 10;
  if (score > 100) score = 100;
  if (score < 0) score = 0;
  return score;
}

export function buildSuggestedJobsForUser(params: {
  user: any;
  cvs: any[];
  max: number;
}): SuggestedJob[] {
  const { user, cvs, max } = params;
  if (!Array.isArray(cvs) || cvs.length === 0) return [];

  const resumes = cvs
    .map((cv) => {
      const parsed = safeJsonParse(cv?.content) ?? cv?.content ?? null;
      const root = parsed?.content && typeof parsed?.content === 'object' ? parsed.content : parsed;
      const updatedAt = String(cv?.updated_at ?? cv?.created_at ?? '').trim();
      const category = extractCategory(root?.mainSkill ?? (user as any)?.main_skill ?? (user as any)?.mainSkill ?? '');
      return {
        cv,
        updatedAt,
        displayName: extractResumeDisplayName(cv, user),
        skills: extractResumeSkills(cv),
        category,
      };
    })
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));

  const bestCategory = String(resumes[0]?.category ?? '').trim();
  const bestCategoryNorm = bestCategory.toLowerCase();

  const activeJobs = db.jobPositions.findActive() ?? [];
  const candidates = bestCategoryNorm
    ? (activeJobs as any[]).filter((j) => String(j?.main_skill ?? '').trim().toLowerCase() === bestCategoryNorm)
    : (activeJobs as any[]);

  const pool = candidates.length > 0 ? candidates : (activeJobs as any[]);
  const limitedPool = pool.slice(0, 400); // keep it fast; `job_positions.json` can be huge

  const scored = limitedPool
    .map((job) => {
      let bestScore = -1;
      let bestResumeName = '';
      for (const r of resumes) {
        const score = computeFitScore(r.skills, job, r.category);
        if (score > bestScore) {
          bestScore = score;
          bestResumeName = r.displayName;
        }
      }
      return { job, fitScore: Math.max(0, bestScore), matchedResumeName: bestResumeName };
    })
    .sort((a, b) => b.fitScore - a.fitScore);

  const out: SuggestedJob[] = [];
  for (const row of scored) {
    const job = row.job;
    const id = String(job?.id ?? job?.external_id ?? job?.sourceUrl ?? job?.applicationUrl ?? '').trim();
    if (!id) continue;

    out.push({
      id,
      title: String(job?.title ?? '').trim() || 'Untitled position',
      company: String(job?.company ?? '').trim() || undefined,
      location: String(job?.location ?? '').trim() || undefined,
      locationType: String(job?.locationType ?? '').trim() || undefined,
      postedDate: String(job?.postedDate ?? job?.added_at ?? job?.created_at ?? '').trim() || undefined,
      description: String(job?.description ?? '').trim() || undefined,
      techStack: Array.isArray(job?.techStack) ? job.techStack : undefined,
      applicationUrl: String(job?.applicationUrl ?? job?.sourceUrl ?? '').trim() || undefined,
      fitScore: Math.round(row.fitScore),
      matchedResumeName: row.matchedResumeName || 'Your',
    });

    if (out.length >= max) break;
  }

  return out;
}


