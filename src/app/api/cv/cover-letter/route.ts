import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { consumeCredit } from '@/lib/credits';
import { db } from '@/lib/db';
import { isMoreFeatureUnlocked } from '@/lib/more-features/access-store';
import { getResumeFeatureCoinCost } from '@/lib/pricing/get-resume-feature-coin-cost';
import { recordUserStateTransition } from '@/lib/user-state';
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

const normalizeCoverLetterText = (text: string) => text.replace(/\r\n/g, '\n').trim();

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

    const userId = await getUserId(request);
    const userIdNum = userId != null && String(userId).trim() ? Number(userId) : null;
    const safeUserIdNum = Number.isFinite(userIdNum as any) ? (userIdNum as number) : null;
    // If row is owned by a user, enforce access (but remain backward compatible for older rows missing user_id)
    if (safeUserIdNum != null && row?.user_id != null && Number(row.user_id) !== Number(safeUserIdNum)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        // Accept both shapes:
        // - { cvData, jobDescription, isFinalStep, requestId? }
        // - { cvContent, companyName, positionTitle, jobDescription, isFinalStep?, requestId? }
        const jobDescription = normalize(body?.jobDescription);
        const isFinalStep = Boolean(body?.isFinalStep ?? true);
        // Multi-cover-letter support:
        // - `cvRequestId` identifies the resume (many cover letters can point to it)
        // - `requestId` identifies the cover letter row (unique per cover letter). If omitted we generate a new one.
        const cvRequestId = normalize(body?.cvRequestId ?? body?.resumeRequestId ?? body?.cv_request_id) || '';
        const requestId = normalize(body?.requestId) || makeRequestId();
        const effectiveCvRequestId = cvRequestId || requestId; // backward compatible: 1:1 when cvRequestId isn't provided

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

        // Deduct dynamic coin cost for cover letter generation (from resume_feature_pricing.json)
        if (userId) {
            const uid = Number(userId);
            const alreadyUnlocked = Number.isFinite(uid) ? isMoreFeatureUnlocked(uid, 'ai_cover_letter') : false;
            if (!alreadyUnlocked) {
                const coinCost = await getResumeFeatureCoinCost('AI Cover Letter', 1);
                const creditResult = await consumeCredit(userId, coinCost, 'cover_letter');
                if (!creditResult.success) {
                    return NextResponse.json(
                        { 
                            error: creditResult.error || 'Failed to consume credit',
                            remainingCredits: creditResult.remainingCredits,
                            requiredCredits: coinCost,
                        },
                        { status: 402 }
                    );
                }
            }
        }

        const logContext = userId ? { userId, endpoint: '/api/cv/cover-letter', action: 'generateCoverLetter' } : undefined;
        const companyName = normalize(cvData?.companyName ?? body?.companyName);
        const positionTitle = normalize(cvData?.positionTitle ?? body?.positionTitle);

        const subjectFromInputs = () => {
            const parts = [
                positionTitle ? `Application for ${positionTitle}` : 'Application',
                companyName ? `- ${companyName}` : '',
            ].filter(Boolean);
            return parts.join(' ').trim();
        };

        let coverLetterJson: { companyName: string; positionTitle: string; subject: string; content: string };
        try {
            coverLetterJson = await ChatGPTService.generateCoverLetterJson(
                {
                    cvData,
                    jobDescription,
                    companyName,
                    positionTitle,
                },
                logContext,
            );
        } catch {
            // Hard fallback: avoid JSON parsing issues causing 500s.
            const text = await ChatGPTService.generateCoverLetter(cvData, jobDescription, logContext);
            coverLetterJson = {
                companyName,
                positionTitle,
                subject: subjectFromInputs(),
                content: String(text ?? '').trim(),
            };
        }

        db.coverLetters.upsert({
            request_id: requestId,
            cv_request_id: effectiveCvRequestId,
            user_id: safeUserIdNum,
            // Backward-compatible plain text field (UI reads this today)
            cover_letter: coverLetterJson.content,
            // New structured output
            cover_letter_json: coverLetterJson,
            job_description: jobDescription,
            cv_data: cvData,
        });

        if (userId) {
            recordUserStateTransition(parseInt(userId), {}, { event: 'cover_letter' });
        }

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

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getUserId(request);
        const userIdNum = userId != null && String(userId).trim() ? Number(userId) : null;
        const safeUserIdNum = Number.isFinite(userIdNum as any) ? (userIdNum as number) : null;
        if (safeUserIdNum == null) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const requestId = normalize(body?.requestId ?? body?.RequestId);
        const coverLetter = normalizeCoverLetterText(String(body?.coverLetter ?? body?.cover_letter ?? ''));
        const subject = normalize(body?.subject ?? body?.title);

        if (!requestId) return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
        if (!coverLetter) return NextResponse.json({ error: 'coverLetter is required' }, { status: 400 });

        const existing = db.coverLetters.findByRequestId(requestId);
        if (!existing) return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 });
        if (existing?.user_id != null && Number(existing.user_id) !== Number(safeUserIdNum)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const nextJson =
            existing?.cover_letter_json && typeof existing.cover_letter_json === 'object'
                ? { ...existing.cover_letter_json }
                : {};
        (nextJson as any).content = coverLetter;
        if (subject) (nextJson as any).subject = subject;

        const updated = db.coverLetters.updateByRequestId(requestId, {
            user_id: existing?.user_id ?? safeUserIdNum, // claim ownership if older rows were missing user_id
            cover_letter: coverLetter,
            cover_letter_json: nextJson,
        });

        return NextResponse.json({
            requestId,
            coverLetter: updated?.cover_letter ?? coverLetter,
            ...(updated?.cover_letter_json && typeof updated.cover_letter_json === 'object' ? updated.cover_letter_json : {}),
            data: updated,
        });
    } catch (error: any) {
        console.error('Error updating cover letter:', error);
        const msg = error?.message || 'Failed to update cover letter';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
