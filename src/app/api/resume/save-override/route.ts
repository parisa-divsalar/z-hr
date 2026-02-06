import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { SectionKeyType } from '@/lib/ai/outputSchemas';
import { getOrCreateDraft, saveSectionOutput, setResumeDirty } from '@/server/resumeAiRepo';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Extract userId from request
 */
async function getUserId(request: NextRequest): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                return decoded.userId?.toString() || null;
            } catch {
                // Token invalid
            }
        }
        
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                return decoded.userId?.toString() || null;
            } catch {
                // Token invalid
            }
        }
        
        return null;
    } catch {
        return null;
    }
}

/**
 * POST /api/resume/save-override
 * Save user override for a section and set resume_dirty flag
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { requestId, sectionKey, userOverrideJson, userOverrideText, aiOutputJson } = body;
        
        if (!requestId || !sectionKey) {
            return NextResponse.json({ error: 'requestId and sectionKey are required' }, { status: 400 });
        }
        
        // Get userId
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        
        // Get or create draft
        const draftId = await getOrCreateDraft(userId, requestId);
        
        // Save user override
        await saveSectionOutput({
            draftId,
            sectionKey: sectionKey as SectionKeyType,
            outputJson: aiOutputJson || {},
            model: 'gpt-4o',
            inputHash: '', // Will be computed if needed
            userOverrideJson: userOverrideJson,
            userOverrideText: userOverrideText || null,
            generationMode: 'default',
        });
        
        // Set resume_dirty = true
        await setResumeDirty(draftId, true);
        
        return NextResponse.json({
            success: true,
            draftId,
        });
    } catch (error: any) {
        console.error('Error saving user override:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save user override' },
            { status: 500 }
        );
    }
}
