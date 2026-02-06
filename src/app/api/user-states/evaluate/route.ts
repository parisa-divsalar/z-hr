import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';

export const runtime = 'nodejs';

export async function GET() {
  const users = db.users.findAll();
  let transitionCount = 0;

  for (const user of users) {
    const userId = (user as any)?.id;
    if (!userId) continue;

    const prevState = (user as any)?.user_state ?? null;
    
    const result = recordUserStateTransition(userId, {}, {
      evaluatedAt: new Date().toISOString(),
      trigger: 'scheduled_evaluation',
    });

    if (prevState !== result.state) {
      transitionCount++;
    }
  }

  return NextResponse.json({
    message: 'User state evaluation completed',
    totalUsers: users.length,
    transitionsRecorded: transitionCount,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
