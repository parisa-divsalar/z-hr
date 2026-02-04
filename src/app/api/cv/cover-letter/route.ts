import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

import { db } from '@/lib/db';
import { ChatGPTService } from '@/services/chatgpt/service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserId(request: NextRequest): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.userId?.toString() ?? null;
    } catch {
        return null;
    }
}

const normalize = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const makeRequestId = () => {
    try {
        const anyCrypto = (globalThis as any)?.crypto;
        if (typeof anyCrypto?.randomUUID === 'function') return anyCrypto.randomUUID();
    } catch {
        // ignore
    }
    return `cl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requestId = normalize(searchParams.get('requestId') ?? searchParams.get('RequestId'));

    if (!requestId) {
        return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
    }

    const row = db.coverLetters.findByRequestId(requestId);
    if (!row) {
        return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
    }

    return NextResponse.json({
        requestId,
        coverLetter: row.cover_letter ?? row.coverLetter ?? row?.cover_letter_json?.content ?? '',
        ...(row?.cover_letter_json && typeof row.cover_letter_json === 'object' ? row.cover_letter_json : {}),
        data: row,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Accept both shapes:
        // - { cvData, jobDescription, isFinalStep, requestId? }
        // - { cvContent, companyName, positionTitle, jobDescription, isFinalStep?, requestId? }
        const jobDescription = normalize(body?.jobDescription);
        const isFinalStep = Boolean(body?.isFinalStep ?? true);
        // IMPORTANT:
        // - requestId should usually be the resume requestId (1 cover letter per resume)
        // - if missing, we still generate a requestId, but it won't be linked to a resume
        const requestId = normalize(body?.requestId) || makeRequestId();

        const cvData =
            body?.cvData ?? {
                cvContent: normalize(body?.cvContent),
                companyName: normalize(body?.companyName),
                positionTitle: normalize(body?.positionTitle),
            };

        if (!jobDescription) {
            return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }

        if (!isFinalStep) {
            return NextResponse.json({
                requestId,
                coverLetter: '',
                message: 'Cover letter generation will be available in final step',
            });
        }

        const userId = await getUserId(request);
        const userIdNum = userId != null && String(userId).trim() ? Number(userId) : null;
        const safeUserIdNum = Number.isFinite(userIdNum as any) ? (userIdNum as number) : null;

        const logContext = userId ? { userId, endpoint: '/api/cv/cover-letter', action: 'generateCoverLetter' } : undefined;
        const coverLetterJson = await ChatGPTService.generateCoverLetterJson(
            {
                cvData,
                jobDescription,
                companyName: normalize(cvData?.companyName ?? body?.companyName),
                positionTitle: normalize(cvData?.positionTitle ?? body?.positionTitle),
            },
            logContext,
        );

        db.coverLetters.upsert({
            request_id: requestId,
            cv_request_id: requestId,
            user_id: safeUserIdNum,
            // Backward-compatible plain text field (UI reads this today)
            cover_letter: coverLetterJson.content,
            // New structured output
            cover_letter_json: coverLetterJson,
            job_description: jobDescription,
            cv_data: cvData,
        });

        return NextResponse.json({
            requestId,
            // Backward compatibility
            coverLetter: coverLetterJson.content,
            // New fields
            ...coverLetterJson,
        });
    } catch (error: any) {
        console.error('Error generating cover letter:', error);
        const msg = error?.message || 'Failed to generate cover letter';
        if (msg === 'OPENAI_TIMEOUT') {
            return NextResponse.json({ error: 'Cover letter generation timed out. Please try again.' }, { status: 504 });
        }
        if (typeof msg === 'string' && msg.includes('OPENAI_API_KEY is not set')) {
            return NextResponse.json({ error: msg }, { status: 503 });
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
