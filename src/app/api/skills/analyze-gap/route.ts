import { NextRequest, NextResponse } from 'next/server';
import { ChatGPTService } from '@/services/chatgpt/service';

export async function POST(request: NextRequest) {
    try {
        const { cvData, jobDescription, isFinalStep } = await request.json();

        if (!cvData || !jobDescription) {
            return NextResponse.json(
                { error: 'CV data and job description are required' },
                { status: 400 }
            );
        }

        // فقط در مرحله نهایی از ChatGPT استفاده می‌کنیم
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

        // Analyze skill gap using ChatGPT (فقط در مرحله نهایی)
        const analysis = await ChatGPTService.analyzeSkillGap(cvData, jobDescription);

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
