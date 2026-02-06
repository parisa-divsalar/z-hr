import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ChatGPTService } from '@/services/chatgpt/service';
import { consumeCredit } from '@/lib/credits';

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
        const { cvData, jobDescription, isFinalStep } = await request.json();

        if (!cvData || !jobDescription) {
            return NextResponse.json(
                { error: 'CV data and job description are required' },
                { status: 400 }
            );
        }

        if (!isFinalStep) {
            return NextResponse.json({
                analysis: {
                    matchedSkills: [],
                    missingSkills: [],
                    recommendations: [],
                    matchPercentage: 0,
                },
                message: 'Skill gap analysis will be available in final step',
            });
        }

        const userId = await getUserId(request);
        
        // Deduct 1 credit for skill gap analysis
        if (userId) {
            const creditResult = await consumeCredit(userId, 1, 'skill_gap');
            if (!creditResult.success) {
                return NextResponse.json(
                    { 
                        error: creditResult.error || 'Failed to consume credit',
                        remainingCredits: creditResult.remainingCredits,
                    },
                    { status: 402 }
                );
            }
        }

        const logContext = userId ? { userId, endpoint: '/api/skills/analyze-gap', action: 'analyzeSkillGap' } : undefined;
        const analysis = await ChatGPTService.analyzeSkillGap(cvData, jobDescription, logContext);

        return NextResponse.json({
            analysis,
        });
    } catch (error: any) {
        console.error('Error analyzing skill gap:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze skill gap' },
            { status: 500 }
        );
    }
}
