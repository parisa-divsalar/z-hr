import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

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

  const imageExt = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'tiff', 'svg', 'heic', 'heif']);
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

/**
 * GET /api/admin/database
 * Returns full database overview for admin panel.
 * Used by free-nextjs-admin-dashboard to display DB info.
 */
export async function GET() {
  try {
    const users = db.users.findAll();
    const cvs = db.cvs.findAll();
    const skills = db.skills.findAll();
    const userSkills = db.userSkills.findAll();
    const interviewSessions = db.interviewSessions.findAll();
    const registrationLogs = db.registrationLogs.findAll();
    const loginLogs = db.loginLogs.findAll();
    const aiInteractions = db.aiInteractions.findAll();
    const coverLetters = db.coverLetters.findAll();
    const wizardData = db.wizardData.findAll();
    const resumeDrafts = db.resumeDrafts.findAll();
    const resumeSectionOutputs = db.resumeSectionOutputs.findAll();
    const jobPositions = db.jobPositions.findAll();
    const jobPositionsActive = db.jobPositions.findActive();
    const jobPositionsNew = db.jobPositions.findNewlyAdded(5);
    const learningHubCourses = db.learningHubCourses.findAll();
    const moreFeatures = db.moreFeatures.findAll();
    const plans = db.plans.findAll();
    const history = db.history.findAll();
    const historyEnriched = history.map((row: any) => {
      const userId = Number(row?.user_id);
      const requestId = String(row?.id ?? '');
      if (!Number.isFinite(userId) || !requestId) return row;
      const wizardRow = db.wizardData.findByUserIdAndRequestId(userId, requestId);
      const counts = getCountsFromWizardDataRow(wizardRow);
      if (!counts) return row;
      return {
        ...row,
        Voice: String(counts.voiceCount),
        Photo: String(counts.photoCount),
        Video: String(counts.videoCount),
      };
    });

    const overview = {
      summary: {
        users: users.length,
        cvs: cvs.length,
        skills: skills.length,
        user_skills: userSkills.length,
        interview_sessions: interviewSessions.length,
        registration_logs: registrationLogs.length,
        login_logs: loginLogs.length,
        ai_interactions: aiInteractions.length,
        cover_letters: coverLetters.length,
        wizard_data: wizardData.length,
        resume_drafts: resumeDrafts.length,
        resume_section_outputs: resumeSectionOutputs.length,
        job_positions: jobPositions.length,
        job_positions_active: jobPositionsActive.length,
        job_positions_new: jobPositionsNew.length,
        learning_hub_courses: learningHubCourses.length,
        more_features: moreFeatures.length,
        plans: plans.length,
        history: historyEnriched.length,
      },
      tables: {
        users,
        cvs,
        skills,
        user_skills: userSkills,
        interview_sessions: interviewSessions,
        registration_logs: registrationLogs,
        login_logs: loginLogs,
        ai_interactions: aiInteractions,
        cover_letters: coverLetters,
        wizard_data: wizardData,
        resume_drafts: resumeDrafts,
        resume_section_outputs: resumeSectionOutputs,
        job_positions: jobPositions,
        job_positions_active: jobPositionsActive,
        job_positions_new: jobPositionsNew,
        learning_hub_courses: learningHubCourses,
        more_features: moreFeatures,
        plans,
        history: historyEnriched,
      },
      source: 'data/ (file-based JSON)',
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(overview, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in /api/admin/database:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database read failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
