import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const states = db.userStates.findAll();
  return NextResponse.json({ data: states });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
