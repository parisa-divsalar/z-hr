import { NextRequest, NextResponse } from 'next/server';

import { ChatGPTService } from '@/services/chatgpt/service';

const SUPPORTED_SECTIONS = new Set([
    'summary',
    'skills',
    'contactWays',
    'languages',
    'certificates',
    'jobDescription',
    'experience',
    'additionalInfo',
]);

export async function POST(request: NextRequest) {
    try {
        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { resume, section } = body ?? {};
        if (!section || !SUPPORTED_SECTIONS.has(String(section))) {
            return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
        }
        if (!resume || typeof resume !== 'object') {
            return NextResponse.json({ error: 'Resume payload is required' }, { status: 400 });
        }

        const updatedResume = await ChatGPTService.deleteResumeSection(resume, String(section));

        return NextResponse.json({ updatedResume });
    } catch (error: any) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error deleting resume section:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to delete resume section' },
            { status: 500 },
        );
    }
}






