import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const parsedId = Number(decoded?.userId);
    return Number.isFinite(parsedId) ? parsedId : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let requestId = '';
  try {
    const body = await request.json();
    requestId = String(body?.requestId ?? body?.request_id ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!requestId) {
    return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
  }

  // Find draftId before delete (needed to delete section outputs).
  const draft = db.resumeDrafts.findByRequestId(requestId);
  const draftId =
    draft && Number(draft?.user_id) === Number(userId) ? Number(draft?.id) : null;

  const deletedWizardRows =
    typeof (db as any)?.wizardData?.deleteByUserIdAndRequestId === 'function'
      ? (db as any).wizardData.deleteByUserIdAndRequestId(userId, requestId)
      : 0;

  const deletedDraftRows =
    typeof (db as any)?.resumeDrafts?.deleteByUserIdAndRequestId === 'function'
      ? (db as any).resumeDrafts.deleteByUserIdAndRequestId(userId, requestId)
      : 0;

  const deletedSectionOutputs =
    draftId != null && Number.isFinite(draftId) && typeof (db as any)?.resumeSectionOutputs?.deleteByDraftId === 'function'
      ? (db as any).resumeSectionOutputs.deleteByDraftId(draftId)
      : 0;

  return NextResponse.json({
    ok: true,
    requestId,
    deleted: {
      wizardRows: deletedWizardRows,
      draftRows: deletedDraftRows,
      sectionOutputs: deletedSectionOutputs,
    },
  });
}


