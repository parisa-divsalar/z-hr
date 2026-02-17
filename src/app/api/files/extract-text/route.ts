import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { consumeCredit } from '@/lib/credits';
import { getResumeFeatureCoinCost } from '@/lib/pricing/get-resume-feature-coin-cost';
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

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userTextEntry = formData.get('userText');
        const userText = typeof userTextEntry === 'string' ? userTextEntry : userTextEntry ? String(userTextEntry) : '';

        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required for file upload', requiresPaidPlan: true },
                { status: 401 }
            );
        }

        const coinCost = getResumeFeatureCoinCost('File Input', 1);
        const creditResult = await consumeCredit(userId, coinCost, 'file_upload');
        if (!creditResult.success) {
            return NextResponse.json(
                { 
                    error: creditResult.error || 'Insufficient credits for file upload',
                    remainingCredits: creditResult.remainingCredits,
                    requiredCredits: coinCost,
                    requiresPaidPlan: true,
                },
                { status: 402 }
            );
        }

        const logContext = userId ? { userId, endpoint: '/api/files/extract-text', action: 'extractTextFromFile' } : undefined;
        const extractedText = await ChatGPTService.extractTextFromFile(file, logContext);

        let mergedText: string | null = null;
        if (userText.trim() || extractedText.trim()) {
            mergedText = await ChatGPTService.mergeUserTextWithFileText(
                {
                    userText,
                    extractedText,
                    fileName: file.name,
                    fileType: file.type,
                },
                logContext
            );
        }

        return NextResponse.json({
            text: extractedText,
            mergedText,
            fileName: file.name,
            fileType: file.type,
        });
    } catch (error: any) {
        console.error('Error extracting text from file:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to extract text from file' },
            { status: 500 }
        );
    }
}
