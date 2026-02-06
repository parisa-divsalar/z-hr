import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ChatGPTService, InterviewQuestion } from '@/services/chatgpt/service';
import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';
import { consumeCredit } from '@/lib/credits';

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
        const { position, cvData, userId, isFinalStep, jobDescription, mode, requestId, planId } = await request.json();
        const authedUserId = await getUserIdFromAuth(request);
        const finalUserId = authedUserId || (userId ? String(userId) : null);
        const interviewMode = mode === 'voice' ? 'voice' : 'chat';

        const resolveCvData = () => {
            if (cvData) return cvData;
            if (!finalUserId) return null;
            const rows = db.cvs.findByUserId(Number(finalUserId)) ?? [];
            if (!rows.length) return null;
            const sorted = rows
                .slice()
                .sort((a: any, b: any) => String(b?.updated_at ?? b?.created_at ?? '').localeCompare(String(a?.updated_at ?? a?.created_at ?? '')));
            const latest = sorted[0] as any;
            const raw =
                latest?.analysis_result?.improvedResume ??
                latest?.analysis?.improvedResume ??
                latest?.content ??
                latest?.analysis_result ??
                latest?.analysis ??
                null;
            if (!raw) return null;
            if (typeof raw === 'string') {
                try {
                    return JSON.parse(raw);
                } catch {
                    return raw;
                }
            }
            return raw;
        };

        const resolvedCvData = resolveCvData();
        if (!resolvedCvData) {
            return NextResponse.json(
                { error: 'CV data is required' },
                { status: 400 }
            );
        }

        const derivedJobDescription =
            jobDescription ||
            resolvedCvData?.jobDescription?.text ||
            resolvedCvData?.jobDescriptionText ||
            resolvedCvData?.jobDescription ||
            undefined;

        // فقط در مرحله نهایی از ChatGPT استفاده می‌کنیم
        if (!isFinalStep) {
            return NextResponse.json({
                sessionId: null,
                inferredPosition: null,
                positionRationale: null,
                questions: [],
                message: 'Interview questions will be available in final step',
            });
        }

        // Plan-based limits for interview usage
        if (finalUserId) {
            const user = db.users.findById(Number(finalUserId));
            const planRows = db.plans.findAll() ?? [];

            const normalizePlanId = (name: string | undefined): 'starter' | 'pro' | 'plus' | 'elite' | null => {
                const n = String(name ?? '').trim().toLowerCase();
                if (!n) return null;
                if (n.includes('starter') || n.includes('free')) return 'starter';
                if (n.includes('pro')) return 'pro';
                if (n.includes('plus')) return 'plus';
                if (n.includes('elite')) return 'elite';
                return null;
            };

            const requestedPlanId = normalizePlanId(planId);
            const userPlanId = normalizePlanId((user as any)?.plan_name ?? (user as any)?.plan);
            const planIdFinal = requestedPlanId || userPlanId || ((user as any)?.plan_status === 'paid' ? 'pro' : 'starter');
            const planRow = planRows.find((p: any) => normalizePlanId(p?.name) === planIdFinal) ?? null;
            const limitKey = interviewMode === 'voice' ? 'voice_interview' : 'question_interview';
            const limitRaw = planRow ? (planRow as any)[limitKey] : 0;
            const allowedCount = typeof limitRaw === 'number' ? limitRaw : Number(limitRaw ?? 0);
            const sessions = db.interviewSessions.findAll() ?? [];
            const usedCount = sessions.filter((s: any) => Number(s?.user_id) === Number(finalUserId) && String(s?.type) === interviewMode).length;

            if (!Number.isFinite(allowedCount) || allowedCount <= 0 || usedCount >= allowedCount) {
                return NextResponse.json(
                    {
                        error: 'Interview limit reached for your plan',
                        remainingCredits: 0,
                        planId: planIdFinal,
                        usedCount,
                        allowedCount: Number.isFinite(allowedCount) ? allowedCount : 0,
                    },
                    { status: 402 }
                );
            }
        }

        const logContext = finalUserId
            ? { userId: finalUserId, endpoint: '/api/interview/questions', action: 'generateInterviewQuestions' }
            : undefined;
        
        // Pass position as null if not provided - service will infer from CV
        const result = await ChatGPTService.generateInterviewQuestions(
            position || null,
            resolvedCvData,
            derivedJobDescription,
            logContext
        );

        let audioClips: Array<{ id: number; audioBase64: string }> | null = null;
        if (interviewMode === 'voice') {
            const questions = result.questions as InterviewQuestion[];
            const out: Array<{ id: number; audioBase64: string }> = [];
            for (const q of questions) {
                const audioBase64 = await ChatGPTService.generateSpeechAudioBase64(q.question, undefined, logContext);
                out.push({ id: q.id, audioBase64 });
            }
            audioClips = out;
        }

        // Save to database if userId provided
        let sessionId = null;
        if (finalUserId) {
            const session = db.interviewSessions.create({
                user_id: parseInt(finalUserId),
                type: interviewMode,
                request_id: requestId ?? null,
                position: position ?? null,
                inferred_position: result.inferredPosition ?? null,
                position_rationale: result.positionRationale ?? null,
                questions: JSON.stringify({
                    ...result,
                    audioClips,
                }),
                status: 'active',
            });
            sessionId = session.id;

            recordUserStateTransition(parseInt(finalUserId), {}, { event: 'interview_questions' });
        }

        return NextResponse.json({
            sessionId,
            inferredPosition: result.inferredPosition,
            positionRationale: result.positionRationale,
            questions: result.questions,
            audioClips,
            mode: interviewMode,
        });
    } catch (error: any) {
        console.error('Error generating interview questions:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate interview questions' },
            { status: 500 }
        );
    }
}
