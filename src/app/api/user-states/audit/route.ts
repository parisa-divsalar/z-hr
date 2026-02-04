import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { ChatGPTService } from '@/services/chatgpt/service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

    const before = body.before ?? null;
    const after = body.after ?? null;
    const editor = body.editor ?? null;

    if (!after) {
      return NextResponse.json({ error: 'after is required' }, { status: 400 });
    }

    const logContext = { endpoint: '/api/user-states/audit', action: 'auditUserStateEdit' };
    const audit = await ChatGPTService.auditUserStateEdit(before, after, logContext);

    const logRow = db.userStateLogs.append({
      state_id: after?.id ?? null,
      state_name: after?.name ?? null,
      before,
      after,
      audit,
      editor,
    });

    return NextResponse.json({ audit, log: logRow });
  } catch (error: any) {
    console.error('Error auditing user state edit:', error);
    return NextResponse.json({ error: error.message || 'Failed to audit user state edit' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
