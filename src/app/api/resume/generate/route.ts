import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getGeneratedSections } from '@/server/resumeAiOrchestrator';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Extract userId from request
 * Tries cookies first, then request body/query params
 */
async function getUserId(request: NextRequest): Promise<string | null> {
    try {
        // Try to get from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                return decoded.userId?.toString() || null;
            } catch {
                // Token invalid, continue to try other methods
            }
        }
        
        // Try to get from Authorization header
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
 * POST /api/resume/generate
 * Generate resume sections from wizard data
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { wizardData, sectionKey, force, requestId, generationMode, userOverrides } = body;
        
        // Get userId
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        
        // Use wizard data from body or fetch from DB if requestId provided
        let finalWizardData = wizardData;
        let finalRequestId = requestId;
        
        if (!finalWizardData && finalRequestId) {
            // Fetch from database
            const { db } = await import('@/lib/db');
            const wizardDataFromDb = db.wizardData.findByUserIdAndRequestId(parseInt(userId), finalRequestId);
            if (wizardDataFromDb?.data) {
                try {
                    finalWizardData = typeof wizardDataFromDb.data === 'string' 
                        ? JSON.parse(wizardDataFromDb.data) 
                        : wizardDataFromDb.data;
                } catch (error) {
                    console.error('Error parsing wizard data:', error);
                }
            }
        }
        
        if (!finalWizardData) {
            return NextResponse.json({ error: 'Wizard data is required' }, { status: 400 });
        }
        
        // Generate requestId if not provided
        if (!finalRequestId) {
            finalRequestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // Get draft ID
        const { getOrCreateDraft, setResumeDirty } = await import('@/server/resumeAiRepo');
        const draftId = await getOrCreateDraft(userId, finalRequestId);
        
        // Check resume_dirty flag - if true, force regenerate all sections
        const { db } = await import('@/lib/db');
        const draft = db.resumeDrafts.findById(draftId);
        const shouldForceRegenerate = draft?.resume_dirty === true;
        
        // Return resume_dirty status in response so client knows
        const resumeDirtyStatus = draft?.resume_dirty === true;
        
        // Generate sections using wizard data directly
        const { generateSectionFromWizardData, generateAllSectionsFromWizardData, regenerateAllSectionsWithOverrides } = await import('@/server/resumeAiOrchestrator');
        
        // If resume_dirty and userOverrides provided, regenerate all sections
        if (shouldForceRegenerate && userOverrides && !sectionKey) {
            const sections = await regenerateAllSectionsWithOverrides({
                userId,
                requestId: finalRequestId,
                wizardData: finalWizardData,
                userOverrides: userOverrides || {},
                generationMode: generationMode || 'default',
            });
            
            // Clear resume_dirty flag after regeneration
            await setResumeDirty(draftId, false);
            
            return NextResponse.json({
                sections,
                draftId,
                requestId: finalRequestId,
            });
        }
        
        if (sectionKey) {
            // Generate single section
            const output = await generateSectionFromWizardData({
                userId,
                requestId: finalRequestId,
                wizardData: finalWizardData,
                sectionKey: sectionKey as any,
                force: force || shouldForceRegenerate || false,
                generationMode: generationMode || 'default',
                userOverrides: userOverrides || {},
            });
            
            return NextResponse.json({
                sections: {
                    [sectionKey]: output,
                },
                draftId,
                requestId: finalRequestId,
                resume_dirty: resumeDirtyStatus,
            });
        } else {
            // Generate all sections
            const sections = await generateAllSectionsFromWizardData({
                userId,
                requestId: finalRequestId,
                wizardData: finalWizardData,
                force: force || shouldForceRegenerate || false,
                generationMode: generationMode || 'default',
                userOverrides: userOverrides || {},
            });
            
            return NextResponse.json({
                sections,
                draftId,
                requestId: finalRequestId,
            });
        }
    } catch (error: any) {
        console.error('Error generating resume sections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate resume sections' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/resume/generate
 * Get generated resume sections
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const requestId = searchParams.get('requestId');
        const sectionKey = searchParams.get('sectionKey');
        
        if (!requestId) {
            return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
        }
        
        // Get userId
        const userId = await getUserId(request);
        if (!userId) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }
        
        // Get generated sections
        const sections = await getGeneratedSections(userId, requestId);
        
        if (!sections) {
            return NextResponse.json({ error: 'No sections found' }, { status: 404 });
        }
        
        if (sectionKey) {
            // Return specific section
            return NextResponse.json({
                data: {
                    sectionKey,
                    output: sections[sectionKey] || null,
                },
            });
        } else {
            // Return all sections
            return NextResponse.json({
                data: {
                    sections,
                },
            });
        }
    } catch (error: any) {
        console.error('Error getting resume sections:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get resume sections' },
            { status: 500 }
        );
    }
}
