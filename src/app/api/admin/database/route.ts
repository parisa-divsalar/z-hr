import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

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
