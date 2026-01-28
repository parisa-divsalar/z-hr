import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { ChatGPTService } from '@/services/chatgpt/service';

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
        coverLetter: row.cover_letter ?? row.coverLetter ?? '',
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

        const coverLetter = await ChatGPTService.generateCoverLetter(cvData, jobDescription);

        db.coverLetters.upsert({
            request_id: requestId,
            cover_letter: coverLetter,
            job_description: jobDescription,
            cv_data: cvData,
        });

        return NextResponse.json({
            requestId,
            coverLetter,
        });
    } catch (error: any) {
        console.error('Error generating cover letter:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate cover letter' }, { status: 500 });
    }
}
