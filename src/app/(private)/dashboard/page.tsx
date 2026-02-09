import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { db } from '@/lib/db';

import DashboardClient from './DashboardClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

  return (
    <DashboardClient
      topStats={{
        cvsCount,
        shouldShowResumesCreatedCard,
        creditsRemaining: Number.isFinite(userCoin) ? userCoin : 0,
        interviewPractices: 3,
      }}
      resumeInProgress={resumeInProgress}
    />
  );
}


