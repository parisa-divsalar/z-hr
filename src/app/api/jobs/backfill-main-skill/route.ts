import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getMainSkillResolverFromDb } from '@/services/jobs/main-skill';

export const runtime = 'nodejs';

/**
 * POST /api/jobs/backfill-main-skill
 * Recompute main_skill for all job_positions based on current skills list.
 */
export async function POST() {
  try {
    const rows = db.jobPositions.findAll();
    const pickMainSkill = getMainSkillResolverFromDb();

    let updated = 0;
    let unchanged = 0;
    let skipped = 0;
    let nullCount = 0;

    for (const row of rows) {
      const id = Number((row as any)?.id);
      if (!Number.isFinite(id)) {
        skipped += 1;
        continue;
      }

      const mainSkill = pickMainSkill({
        title: (row as any)?.title,
        description: (row as any)?.description,
        requirements: (row as any)?.requirements,
        techStack: (row as any)?.techStack,
      });

      if (!mainSkill) nullCount += 1;

      if ((row as any)?.main_skill !== mainSkill) {
        db.jobPositions.update(id, { main_skill: mainSkill ?? null });
        updated += 1;
      } else {
        unchanged += 1;
      }
    }

    return NextResponse.json({
      success: true,
      total: rows.length,
      updated,
      unchanged,
      skipped,
      nullCount,
    });
  } catch (error) {
    console.error('Error in /api/jobs/backfill-main-skill:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Backfill failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
