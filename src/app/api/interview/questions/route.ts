import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ChatGPTService } from '@/services/chatgpt/service';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromAuth(request: NextRequest): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get('accessToken')?.value;
        const authHeader = request.headers.get('authorization');
        const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.userId?.toString() || null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { position, cvData, userId, isFinalStep } = await request.json();
        const authedUserId = await getUserIdFromAuth(request);
        const finalUserId = authedUserId || (userId ? String(userId) : null);

        if (!position || !cvData) {
            return NextResponse.json(
                { error: 'Position and CV data are required' },
                { status: 400 }
            );
        }

        // فقط در مرحله نهایی از ChatGPT استفاده می‌کنیم
        if (!isFinalStep) {
            return NextResponse.json({
                sessionId: null,
                questions: [],
                message: 'Interview questions will be available in final step',
            });
        }

        const logContext = finalUserId
            ? { userId: finalUserId, endpoint: '/api/interview/questions', action: 'generateInterviewQuestions' }
            : undefined;
        const questions = await ChatGPTService.generateInterviewQuestions(position, cvData, undefined, logContext);

        // Save to database if userId provided
        let sessionId = null;
        if (finalUserId) {
            const session = db.interviewSessions.create({
                user_id: parseInt(finalUserId),
                type: 'chat',
                questions: JSON.stringify(questions),
                status: 'active',
            });
            sessionId = session.id;
        }

        return NextResponse.json({
            sessionId,
            questions,
        });
    } catch (error: any) {
        console.error('Error generating interview questions:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate interview questions' },
            { status: 500 }
        );
    }
}
