import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { db } from '@/lib/db';

import DashboardClient from './DashboardClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

type SuggestedJob = {
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

async function getUserIdFromCookie(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const parsedId = Number(decoded?.userId);
    return Number.isFinite(parsedId) ? parsedId : null;
  } catch {
    return null;
  }
}

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

function toMMDDYYYY(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
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

  const merged = [...skills1, ...skills2, ...analysisSkills]
    .map(normalizeSkill)
    .filter(Boolean);
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

function buildSuggestedJobsForUser(params: {
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

export default async function DashboardPage() {
  const userId = await getUserIdFromCookie();
  const user = userId ? db.users.findById(userId) : null;
  const userCoin = user ? Number((user as any)?.coin ?? 0) : 0;
  const cvs = userId ? db.cvs.findByUserId(userId) : [];
  const cvsCount = cvs.length;

  // Show "Resumes Created" whenever we have an authenticated user (count can be 0).
  const shouldShowResumesCreatedCard = userId != null;

  const resumeInProgress = (() => {
    if (!userId) return null;

    const completedRequestIds = new Set(
      (cvs ?? [])
        .map((cv: any) => String(cv?.request_id ?? '').trim())
        .filter(Boolean),
    );

    const wizardRows = (db.wizardData.findByUserId(userId) ?? []).filter((row: any) => {
      const rid = String(row?.request_id ?? '').trim();
      return rid && !completedRequestIds.has(rid);
    });

    const draftRows = (db.resumeDrafts.findAll() ?? []).filter((row: any) => {
      const rid = String(row?.request_id ?? '').trim();
      return Number(row?.user_id) === Number(userId) && rid && !completedRequestIds.has(rid);
    });

    const candidates = [...wizardRows, ...draftRows];
    if (candidates.length === 0) return null;

    const getTs = (row: any) => {
      const t = Date.parse(String(row?.updated_at ?? row?.created_at ?? ''));
      return Number.isFinite(t) ? t : 0;
    };

    const latest = [...candidates].sort((a, b) => getTs(b) - getTs(a))[0];
    const requestId = String(latest?.request_id ?? '').trim();
    if (!requestId) return null;

    const wizardRow = wizardRows.find((w: any) => String(w?.request_id ?? '').trim() === requestId) ?? null;
    const draftRow = db.resumeDrafts.findByRequestId(requestId) ?? null;

    const draftId = Number(draftRow?.id);
    const outputs = Number.isFinite(draftId) ? db.resumeSectionOutputs.findByDraftId(draftId) : [];
    const generatedSections = (() => {
      if (!Array.isArray(outputs)) return 0;
      const keys = new Set<string>();
      for (const o of outputs) {
        const k = String(o?.section_key ?? '').trim();
        if (k) keys.add(k);
      }
      return keys.size;
    })();

    // Resume editor has 9 visible sections (including "profile"). AI-generated outputs cover 8 sections.
    const totalSections = 9;
    const completedSections = generatedSections + (wizardRow ? 1 : 0);

    return {
      requestId,
      updatedAt: String(latest?.updated_at ?? latest?.created_at ?? new Date().toISOString()),
      step: wizardRow ? String(wizardRow?.step ?? '').trim() : '',
      completedSections,
      totalSections,
    };
  })();

  const suggestedJobs: SuggestedJob[] =
    userId && user ? buildSuggestedJobsForUser({ user, cvs, max: 2 }) : [];

  return (
    <DashboardClient
      topStats={{
        cvsCount,
        shouldShowResumesCreatedCard,
        creditsRemaining: Number.isFinite(userCoin) ? userCoin : 0,
        interviewPractices: 3,
      }}
      resumeInProgress={resumeInProgress}
      suggestedJobs={suggestedJobs}
    />
  );
}


