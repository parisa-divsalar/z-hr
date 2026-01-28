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
    let requestId: string | undefined;
    try {
        let body: any;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { cvText, userId, requestId: providedRequestId } = body ?? {};
        const authedUserId = await getUserIdFromAuth(request);
        const finalUserId = authedUserId || (userId ? String(userId) : null);

        // دریافت یا ایجاد requestId
        const reqId: string =
            providedRequestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        requestId = reqId;

        // دریافت اطلاعات wizard از database (اگر وجود داشته باشد)
        const wizardDataFromDb: any = finalUserId
            ? (db as any).wizardData.findByUserIdAndRequestId(parseInt(finalUserId), reqId)
            : null;

        // استفاده از cvText یا داده‌های database
        const rawCv = wizardDataFromDb?.data ?? cvText;
        if (rawCv == null || rawCv === '') {
            return NextResponse.json(
                {
                    error:
                        'CV text is required (send `cvText` in body, or provide `requestId` for existing wizard data).',
                },
                { status: 400 }
            );
        }

        const finalCvText =
            typeof rawCv === 'string' ? rawCv : JSON.stringify(rawCv);

        // Analyze CV using ChatGPT (فقط در مرحله نهایی)
        const analysis = await ChatGPTService.analyzeCV(finalCvText);

        // Save to database if authenticated
        if (finalUserId) {
            // ذخیره CV در database
            let cv: any = (db as any).cvs.findByRequestId(reqId);
            if (cv) {
                cv = (db as any).cvs.update(reqId, {
                    content: typeof finalCvText === 'string' ? finalCvText : JSON.stringify(finalCvText),
                    analysis_result: JSON.stringify(analysis),
                });
            } else {
                cv = (db as any).cvs.create({
                    user_id: parseInt(finalUserId),
                    request_id: reqId,
                    content: typeof finalCvText === 'string' ? finalCvText : JSON.stringify(finalCvText),
                    analysis_result: JSON.stringify(analysis),
                });
            }

            // به‌روزرسانی wizard data به عنوان completed
            if (wizardDataFromDb) {
                // test/z-hr db has upsert (not update)
                (db as any).wizardData.upsert({
                    ...wizardDataFromDb,
                    user_id: parseInt(finalUserId),
                    request_id: reqId,
                    step: 'completed',
                });
            }

            return NextResponse.json({
                requestId: cv?.request_id || reqId,
                analysis,
                status: 'completed',
            });
        }

        return NextResponse.json({
            requestId: reqId,
            analysis,
            status: 'completed',
        });
    } catch (error: any) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error('Error analyzing CV:', {
            requestId,
            message: err.message,
            stack: err.stack,
        });
        const isDev = process.env.NODE_ENV !== 'production';
        return NextResponse.json(
            {
                error: 'Failed to analyze CV',
                requestId,
                ...(isDev ? { details: err.message } : {}),
            },
            { status: 500 }
        );
    }
}
