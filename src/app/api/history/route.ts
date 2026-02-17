import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

type THistorySortOption = 'NEW_TO_OLD' | 'OLD_TO_NEW' | 'SIZE' | 'FIT_SCORE';

function toMMDDYYYY(iso: string) {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
}

function sizeMBFromCvContent(cv: any): string {
    const str = typeof cv?.content === 'string' ? cv.content : JSON.stringify(cv?.content ?? '');
    const bytes = Buffer.byteLength(str, 'utf8');
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseDateToTimestamp(value: unknown): number {
    const s = String(value ?? '').trim();
    if (!s) return 0;

    // Handle MM/DD/YYYY explicitly (history rows use this format)
    const parts = s.split('/');
    if (parts.length === 3) {
        const mm = Number(parts[0]);
        const dd = Number(parts[1]);
        const yyyy = Number(parts[2]);
        if (mm && dd && yyyy) {
            const t = new Date(yyyy, mm - 1, dd).getTime();
            if (Number.isFinite(t)) return t;
        }
    }

    // Fallback: let JS parse ISO / "Nov 26, 2024" / etc.
    const t = Date.parse(s);
    return Number.isFinite(t) ? t : 0;
}

function parseSizeMB(value: unknown): number {
    const s = String(value ?? '').trim();
    if (!s) return 0;
    // Accept "2.85 MB", "2.85MB", "2.85 mb"
    const n = Number.parseFloat(s.replace(/mb/i, '').trim());
    return Number.isFinite(n) ? n : 0;
}

function parseFitScore(value: unknown): number {
    const s = String(value ?? '').trim();
    if (!s) return 0;
    const n = Number.parseFloat(s.replace('%', '').trim());
    return Number.isFinite(n) ? n : 0;
}

function sortHistoryRows(rows: any[], sort: THistorySortOption): any[] {
    const arr = [...rows];
    switch (sort) {
        case 'NEW_TO_OLD':
            return arr.sort(
                (a, b) =>
                    parseDateToTimestamp(b?.date) - parseDateToTimestamp(a?.date) ||
                    Date.parse(String(b?.created_at ?? '')) - Date.parse(String(a?.created_at ?? '')),
            );
        case 'OLD_TO_NEW':
            return arr.sort(
                (a, b) =>
                    parseDateToTimestamp(a?.date) - parseDateToTimestamp(b?.date) ||
                    Date.parse(String(a?.created_at ?? '')) - Date.parse(String(b?.created_at ?? '')),
            );
        case 'SIZE':
            return arr.sort((a, b) => parseSizeMB(b?.size) - parseSizeMB(a?.size));
        case 'FIT_SCORE':
            return arr.sort((a, b) => parseFitScore(b?.Percentage) - parseFitScore(a?.Percentage));
        default:
            return arr;
    }
}

function tryParseJson(value: unknown): any | null {
    if (value == null) return null;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
        return JSON.parse(trimmed);
    } catch {
        return null;
    }
}

function normalizeMainSkill(value: unknown): string {
    const s = String(value ?? '').trim();
    if (!s) return '';
    // Examples seen in cvs.json: "Wizard Status: Web Development • Visa: work_visa"
    const noPrefix = s.replace(/^wizard\s*status:\s*/i, '').trim();
    const beforeBullet = noPrefix.split('•')[0]?.trim() ?? noPrefix;
    return beforeBullet;
}

function extractFullNameFromWizardDataRow(wizardRow: any): string {
    const parsed = tryParseJson(wizardRow?.data);
    const fullName = String(parsed?.fullName ?? '').trim();
    return fullName;
}

function extractMainSkillFromWizardDataRow(wizardRow: any): string {
    const parsed = tryParseJson(wizardRow?.data);
    return normalizeMainSkill(parsed?.mainSkill);
}

function extractMainSkillFromCvRow(cv: any): string {
    const parsed = tryParseJson(cv?.content);
    const fromProfile = normalizeMainSkill(parsed?.profile?.mainSkill);
    if (fromProfile) return fromProfile;
    const direct = normalizeMainSkill(parsed?.mainSkill);
    if (direct) return direct;
    return '';
}

function extractFullNameFromCvRow(cv: any): string {
    const parsed = tryParseJson(cv?.content);
    const fromProfile = String(parsed?.profile?.fullName ?? '').trim();
    if (fromProfile) return fromProfile;
    const direct = String(parsed?.fullName ?? '').trim();
    if (direct) return direct;
    return '';
}

function resolveDisplayNameForRequest(userId: number, requestId: string): string {
    const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
    const fromWizard = extractFullNameFromWizardDataRow(wizardRow);
    if (fromWizard) return fromWizard;
    const cv = db.cvs.findByRequestId(requestId);
    const fromCv = extractFullNameFromCvRow(cv);
    if (fromCv) return fromCv;
    return '';
}

function extractImprovedResumeFromAnalysisResult(cv: any): any | null {
    const raw = cv?.analysis_result;
    if (!raw) return null;
    const parsed = typeof raw === 'string' ? tryParseJson(raw) : raw;
    if (!parsed || typeof parsed !== 'object') return null;
    // Storage can be either `{ improvedResume: ... }` or the improved resume directly.
    const improved = (parsed as any).improvedResume ? (parsed as any).improvedResume : parsed;
    return improved && typeof improved === 'object' ? improved : null;
}

function parseMonthYearToken(token: string): { y: number; m: number } | null {
    const t = token.trim();
    // Match "01/2023" or "1/2023"
    const mmYYYY = t.match(/^(\d{1,2})\s*\/\s*(\d{4})$/);
    if (mmYYYY) {
        const m = Number(mmYYYY[1]);
        const y = Number(mmYYYY[2]);
        if (m >= 1 && m <= 12 && y >= 1900 && y <= 2100) return { y, m };
    }
    // Match "2023"
    const yyyy = t.match(/^(\d{4})$/);
    if (yyyy) {
        const y = Number(yyyy[1]);
        if (y >= 1900 && y <= 2100) return { y, m: 1 };
    }
    return null;
}

function diffMonths(a: { y: number; m: number }, b: { y: number; m: number }): number {
    return (b.y - a.y) * 12 + (b.m - a.m);
}

function inferExperienceLevelFromCvAnalysis(cv: any): string {
    const improved = extractImprovedResumeFromAnalysisResult(cv);
    const exps = Array.isArray(improved?.professionalExperience) ? improved.professionalExperience : [];
    let months = 0;
    const now = new Date();
    const nowToken = { y: now.getFullYear(), m: now.getMonth() + 1 };

    for (const e of exps) {
        const datesRaw = String(e?.dates ?? '').trim();
        if (!datesRaw) continue;
        const normalized = datesRaw.replace(/[–—]/g, '-');
        const parts = normalized.split('-').map((p) => p.trim()).filter(Boolean);
        if (parts.length < 1) continue;

        const start = parseMonthYearToken(parts[0]);
        const endPart = parts[1] ? parts[1] : '';
        const end =
            /present|current|now/i.test(endPart) || !endPart ? nowToken : parseMonthYearToken(endPart);
        if (!start || !end) continue;

        const d = Math.max(0, diffMonths(start, end));
        months += d;
    }

    const years = months / 12;
    if (years >= 6) return 'Senior';
    if (years >= 3) return 'Mid-senior';
    if (years >= 1) return 'Mid';
    // If we can't parse dates but we do have experience entries, avoid "Junior" mislabeling.
    if (exps.length > 0) return 'Mid';
    return '';
}

function computeFitScorePercent(params: { wizardRow: any | null; cv: any | null }): number {
    const wizard = params.wizardRow ? tryParseJson(params.wizardRow?.data) : null;
    const cvContent = params.cv ? tryParseJson(params.cv?.content) : null;
    const improved = params.cv ? extractImprovedResumeFromAnalysisResult(params.cv) : null;

    const fullName = String(wizard?.fullName ?? cvContent?.profile?.fullName ?? cvContent?.fullName ?? '').trim();
    const mainSkill = normalizeMainSkill(wizard?.mainSkill ?? cvContent?.mainSkill ?? cvContent?.profile?.mainSkill);
    const contactWays = Array.isArray(wizard?.contactWay)
        ? wizard.contactWay
        : Array.isArray(cvContent?.contactWay)
          ? cvContent.contactWay
          : Array.isArray(cvContent?.contactWays)
            ? cvContent.contactWays
            : [];
    const languages = Array.isArray(wizard?.languages)
        ? wizard.languages
        : Array.isArray(cvContent?.languages)
          ? cvContent.languages
          : Array.isArray(improved?.languages)
            ? improved.languages
            : [];
    const summaryText =
        String(wizard?.background?.text ?? cvContent?.summary ?? cvContent?.profile?.summary ?? improved?.summary ?? '').trim();
    const skillsArr = Array.isArray(wizard?.skills)
        ? wizard.skills
        : Array.isArray(cvContent?.skills)
          ? cvContent.skills
          : Array.isArray(cvContent?.skillList)
            ? cvContent.skillList
            : Array.isArray(improved?.technicalSkills)
              ? improved.technicalSkills
              : [];
    const expArr = Array.isArray(wizard?.experiences)
        ? wizard.experiences
        : Array.isArray(cvContent?.experiences)
          ? cvContent.experiences
          : Array.isArray(cvContent?.experience)
            ? cvContent.experience
            : Array.isArray(improved?.professionalExperience)
              ? improved.professionalExperience
              : [];
    const certArr = Array.isArray(wizard?.certificates)
        ? wizard.certificates
        : Array.isArray(cvContent?.certificates)
          ? cvContent.certificates
          : Array.isArray(cvContent?.certifications)
            ? cvContent.certifications
            : Array.isArray(improved?.certifications)
              ? improved.certifications
              : [];
    const educationArr = Array.isArray(cvContent?.education)
        ? cvContent.education
        : Array.isArray(improved?.education)
          ? improved.education
          : [];
    const projectsArr = Array.isArray(cvContent?.selectedProjects)
        ? cvContent.selectedProjects
        : Array.isArray(improved?.selectedProjects)
          ? improved.selectedProjects
          : [];
    const additionalText = String(
        wizard?.additionalInfo?.text ??
            cvContent?.additionalInfoText ??
            cvContent?.additionalInfo ??
            (typeof improved?.additionalInfo === 'string' ? improved.additionalInfo : ''),
    ).trim();

    let score = 0;

    if (fullName) score += 8;
    if (mainSkill) score += 8;
    if (contactWays.filter((x: any) => String(x ?? '').trim()).length >= 1) score += 10;
    if (languages.length >= 1) score += 10;
    if (summaryText.length >= 40) score += 12;

    const skillCount = skillsArr.filter((x: any) => String(x ?? '').trim()).length;
    score += Math.round(Math.min(1, skillCount / 8) * 15);

    // Experience: give points for having content (regardless of structure)
    const expHasText =
        expArr.length > 0 &&
        expArr.some((e: any) => String(e?.text ?? e?.description ?? '').replace(/\s+/g, ' ').trim().length >= 40);
    if (expHasText) score += 20;

    const certHasText =
        certArr.length > 0 &&
        certArr.some((c: any) => String(c?.text ?? c?.title ?? '').replace(/\s+/g, ' ').trim().length >= 10);
    if (certHasText) score += 7;

    if (educationArr.length > 0) score += 5;
    if (projectsArr.length > 0) score += 5;
    if (additionalText.length >= 20) score += 5;

    // Small bonus for visaStatus presence (wizard completeness)
    const visa = String(wizard?.visaStatus ?? cvContent?.visaStatus ?? '').trim();
    if (visa) score += 3;

    // Clamp to 5..99 to avoid awkward "0%" and "100%" UX
    const clamped = Math.max(5, Math.min(99, Math.round(score)));
    return clamped;
}

function enrichHistoryRow(userId: number, requestId: string, row: any) {
    const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
    const cv = db.cvs.findByRequestId(requestId);

    const mainSkill = extractMainSkillFromWizardDataRow(wizardRow) || extractMainSkillFromCvRow(cv);
    const fit = computeFitScorePercent({ wizardRow, cv });
    const inferredLevel = inferExperienceLevelFromCvAnalysis(cv);

    return {
        ...row,
        // Skill group from wizard selection
        position: mainSkill || row?.position || '',
        // Experience level inferred from AI analysis dates (fallback empty)
        level: inferredLevel || row?.level || '',
        // Fit score computed from resume completeness (not mock)
        Percentage: `${fit}%`,
    };
}

/**
 * Ensure `history.json` has rows for each CV the user has created.
 * This prevents "empty history" UX when only `cvs.json` has data.
 *
 * - Does NOT resurrect deleted history rows.
 * - Only upserts missing entries.
 */
function materializeHistoryFromCvs(userId: number) {
    const allHistoryRows = db.history.findByUserId(userId); // includes deleted_at
    const existingIds = new Set(allHistoryRows.map((r: any) => String(r?.id ?? '')));

    const cvs = db.cvs.findByUserId(userId);
    for (const cv of cvs) {
        const requestId = String(cv?.request_id ?? '').trim();
        if (!requestId) continue;
        if (existingIds.has(requestId)) continue;

        const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
        const counts = getCountsFromWizardDataRow(wizardRow);
        const voice = counts ? String(counts.voiceCount) : '0';
        const photo = counts ? String(counts.photoCount) : '0';
        const video = counts ? String(counts.videoCount) : '0';
        const fullName = extractFullNameFromWizardDataRow(wizardRow) || extractFullNameFromCvRow(cv);
        const mainSkill = extractMainSkillFromWizardDataRow(wizardRow) || extractMainSkillFromCvRow(cv);
        const fit = computeFitScorePercent({ wizardRow, cv });
        const inferredLevel = inferExperienceLevelFromCvAnalysis(cv);

        db.history.upsert({
            id: requestId,
            user_id: userId,
            name: fullName || (cv?.title as any) || "User's Resume",
            date: toMMDDYYYY(String(cv?.created_at || new Date().toISOString())),
            Percentage: `${fit}%`,
            position: mainSkill || '',
            level: inferredLevel || '',
            title: (cv?.title as any) || '',
            Voice: voice,
            Photo: photo,
            size: sizeMBFromCvContent(cv),
            Video: video,
            description: 'Resume',
            is_bookmarked: false,
            deleted_at: null,
        });

        existingIds.add(requestId);
    }
}

function getCountsFromWizardDataRow(wizardRow: any): { voiceCount: number; photoCount: number; videoCount: number } | null {
    if (!wizardRow?.data) return null;

    let data: any = wizardRow.data;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch {
            return null;
        }
    }

    const allFilesSummary = Array.isArray(data?.allFilesSummary) ? data.allFilesSummary : [];

    const imageExt = new Set([
        'png',
        'jpg',
        'jpeg',
        'webp',
        'gif',
        'bmp',
        'tiff',
        'svg',
        'heic',
        'heif',
    ]);
    const videoExt = new Set(['mp4', 'mov', 'm4v', 'webm', 'mkv', 'avi', 'wmv', 'flv', '3gp']);

    let voiceCount = 0;
    let photoCount = 0;
    let videoCount = 0;

    for (const item of allFilesSummary) {
        if (item?.kind === 'voice') {
            voiceCount += 1;
            continue;
        }

        if (item?.kind === 'file') {
            const name = typeof item?.name === 'string' ? item.name : '';
            const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : '';
            if (ext && imageExt.has(ext)) photoCount += 1;
            else if (ext && videoExt.has(ext)) videoCount += 1;
        }
    }

    // Fallback: if there's no summary, at least count voice refs from sections (file type can't be determined).
    if (allFilesSummary.length === 0) {
        const safeArr = (v: any) => (Array.isArray(v) ? v : []);
        const countSection = (section: any) => {
            voiceCount += safeArr(section?.voices).length;
        };
        countSection(data?.background);
        safeArr(data?.experiences).forEach((s: any) => countSection(s));
        safeArr(data?.certificates).forEach((s: any) => countSection(s));
        countSection(data?.jobDescription);
        countSection(data?.additionalInfo);
    }

    return { voiceCount, photoCount, videoCount };
}

async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get('accessToken')?.value;
        const header = request.headers.get('authorization');
        const headerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const parsedId = Number(decoded?.userId);
        return Number.isFinite(parsedId) ? parsedId : null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const bookmarkedOnly = url.searchParams.get('bookmarked') === '1' || url.searchParams.get('bookmarked') === 'true';
    const sort = (url.searchParams.get('sort') || 'NEW_TO_OLD') as THistorySortOption;

    // If history is empty/incomplete, materialize from user's CVs so UI never shows empty history unexpectedly.
    materializeHistoryFromCvs(userId);

    const rows = db.history.findByUserId(userId).filter((r: any) => !r?.deleted_at);
    const filtered = bookmarkedOnly ? rows.filter((r: any) => Boolean(r.is_bookmarked)) : rows;

    // If `id` is provided, return just that row (or 404).
    if (id) {
        const row = filtered.find((r: any) => String(r?.id) === String(id));
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const requestId = String(id);
        const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
        const counts = getCountsFromWizardDataRow(wizardRow);
        const fullName = resolveDisplayNameForRequest(userId, requestId);
        const base = counts
            ? { ...row, name: fullName || row?.name, Voice: String(counts.voiceCount), Photo: String(counts.photoCount), Video: String(counts.videoCount) }
            : { ...row, name: fullName || row?.name };
        const enriched = enrichHistoryRow(userId, requestId, base);

        return NextResponse.json({ data: enriched }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    // Enrich Voice/Photo/Video with counts computed from saved wizard data (if present).
    const enriched = filtered.map((row: any) => {
        const requestId = String(row?.id ?? '');
        if (!requestId) return row;
        const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
        const counts = getCountsFromWizardDataRow(wizardRow);
        const fullName = resolveDisplayNameForRequest(userId, requestId);
        const base = fullName ? { ...row, name: fullName } : row;
        const withCounts = counts
            ? {
                ...base,
                Voice: String(counts.voiceCount),
                Photo: String(counts.photoCount),
                Video: String(counts.videoCount),
            }
            : base;
        return enrichHistoryRow(userId, requestId, withCounts);
    });

    const sorted = sortHistoryRows(enriched, sort);
    return NextResponse.json({ data: sorted }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}

export async function PATCH(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    try {
        const body = await request.json();
        const id = String(body?.id ?? '');
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

        const isBookmarked =
            body?.is_bookmarked === undefined || body?.is_bookmarked === null ? undefined : Boolean(body.is_bookmarked);

        // If this history row doesn't exist yet, try to materialize it from user's CVs.
        let updated = db.history.toggleBookmark(userId, id, isBookmarked);
        if (!updated) {
            const cv = db.cvs.findByRequestId(id);
            if (cv && Number(cv.user_id) === Number(userId)) {
                const toMMDDYYYY = (iso: string) => {
                    const d = new Date(iso);
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    const yyyy = String(d.getFullYear());
                    return `${mm}/${dd}/${yyyy}`;
                };
                const sizeMB = (() => {
                    const str = typeof cv.content === 'string' ? cv.content : JSON.stringify(cv.content ?? '');
                    const bytes = Buffer.byteLength(str, 'utf8');
                    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                })();

                const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, String(cv.request_id));
                const counts = getCountsFromWizardDataRow(wizardRow);
                const voice = counts ? String(counts.voiceCount) : '0';
                const photo = counts ? String(counts.photoCount) : '0';
                const video = counts ? String(counts.videoCount) : '0';

                db.history.upsert({
                    id: cv.request_id,
                    user_id: userId,
                    name: (cv.title as any) || "User's Resume",
                    date: toMMDDYYYY(cv.created_at || new Date().toISOString()),
                    Percentage: '0%',
                    position: '',
                    level: '',
                    title: (cv.title as any) || '',
                    Voice: voice,
                    Photo: photo,
                    size: sizeMB,
                    Video: video,
                    description: 'Resume',
                    is_bookmarked: Boolean(isBookmarked),
                    deleted_at: null,
                });
                updated = db.history.toggleBookmark(userId, id, isBookmarked);
            }
        }
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ data: updated }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const userId = await getUserIdFromAuth(request);
    if (!userId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const url = new URL(request.url);
    const idFromQuery = url.searchParams.get('id');

    let id: string | null = idFromQuery ? String(idFromQuery) : null;
    if (!id) {
        try {
            const body = await request.json();
            if (body?.id) id = String(body.id);
        } catch {
            // ignore
        }
    }

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const ok = db.history.markDeleted(userId, id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}


