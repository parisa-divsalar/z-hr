import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
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
        const { section, context, isFinalStep, resume, mode } = await request.json();
        const userId = await getUserId(request);
        const logContext = userId ? { userId, endpoint: '/api/cv/improve', action: 'improve' } : undefined;

        if (resume && typeof resume === 'object') {
            if (!isFinalStep) {
                return NextResponse.json({
                    originalResume: resume,
                    improvedResume: resume,
                    message: 'Improvement will be available in final step',
                });
            }

            const improvedResume = await ChatGPTService.improveStructuredResume({
                resume,
                mode,
                logContext,
            });

            return NextResponse.json({
                originalResume: resume,
                improvedResume,
            });
        }

        if (!section) {
            return NextResponse.json({ error: 'Section text is required' }, { status: 400 });
        }

        if (!isFinalStep) {
            return NextResponse.json({
                original: section,
                improved: section,
                message: 'Improvement will be available in final step',
            });
        }

        const improved = await ChatGPTService.improveCVSection(section, context, undefined, logContext);

        return NextResponse.json({
            original: section,
            improved,
        });
    } catch (error: any) {
        console.error('Error improving CV section:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to improve CV section' },
            { status: 500 }
        );
    }
}
