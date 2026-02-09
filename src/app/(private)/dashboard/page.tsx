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
  const cvsCount = userId ? db.cvs.findByUserId(userId).length : 0;

  // Show "Resumes Created" whenever we have an authenticated user (count can be 0).
  const shouldShowResumesCreatedCard = userId != null;

  return (
    <DashboardClient
      topStats={{
        cvsCount,
        shouldShowResumesCreatedCard,
        // TODO: wire these to real credit / interview data later
        creditsRemaining: 83,
        interviewPractices: 3,
      }}
    />
  );
}


