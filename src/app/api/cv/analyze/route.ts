import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { consumeCredit } from '@/lib/credits';
import { db } from '@/lib/db';
import { getResumeFeatureCoinCost } from '@/lib/pricing/get-resume-feature-coin-cost';
import { recordUserStateTransition } from '@/lib/user-state';
import { ChatGPTService } from '@/services/chatgpt/service';

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

type WizardAllFilesSummaryItem = {
    id?: string;
    kind?: 'file' | 'voice' | string;
    name?: string | null;
};

type AttachmentKind = 'file' | 'image' | 'video' | 'voice';

function safeParseJson(value: string): any | null {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function getExtensionLower(name: string): string {
    const trimmed = String(name ?? '').trim().toLowerCase();
    const lastDot = trimmed.lastIndexOf('.');
    if (lastDot === -1) return '';
    return trimmed.slice(lastDot + 1).trim();
}

function classifyFileNameToKind(fileName: string): Exclude<AttachmentKind, 'voice'> {
    const imageExts = new Set([
        'png',
        'jpg',
        'jpeg',
        'webp',
        'gif',
        'bmp',
        'svg',
        'ico',
        'avif',
        'heic',
        'heif',
        'tif',
        'tiff',
        'jfif',
    ]);
    const videoExts = new Set(['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'flv', 'wmv', '3gp']);

    const ext = fileName ? getExtensionLower(fileName) : '';
    if (ext && imageExts.has(ext)) return 'image';
    if (ext && videoExts.has(ext)) return 'video';
    return 'file';
}

function extractAttachmentsFromWizardText(wizardText: string): Array<{ id: string; kind: AttachmentKind }> {
    const parsed = safeParseJson(wizardText);
    const list: WizardAllFilesSummaryItem[] = Array.isArray(parsed?.allFilesSummary) ? parsed.allFilesSummary : [];

    const out: Array<{ id: string; kind: AttachmentKind }> = [];
    for (const item of list) {
        const id = String(item?.id ?? '').trim();
        if (!id) continue;
        const rawKind = String(item?.kind ?? '').trim().toLowerCase();
        if (rawKind === 'voice') {
            out.push({ id, kind: 'voice' });
            continue;
        }
        if (rawKind !== 'file') continue;

        const name = String(item?.name ?? '').trim();
        out.push({ id, kind: classifyFileNameToKind(name) });
    }

    return out;
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

        // If this is a NEW CV creation, consume coins before expensive AI work.
        // Total = AI Resume Builder (once per requestId) + attachment inputs (charged per NEW attachment id).
        //
        // Important: Users may add attachments later and re-run analysis. We should only charge for NEW attachments
        // (delta charging) to avoid double-spending for the same file/image/voice.
        if (finalUserId) {
            const userIdNum = parseInt(finalUserId, 10);
            const existingCv = (db as any).cvs.findByRequestId(reqId) as any | null;
            const isNewCv = !existingCv;

            const attachmentsNow = extractAttachmentsFromWizardText(finalCvText);
            const attachmentIdsNow = attachmentsNow.map((a) => a.id);

            const existingChargedRaw = existingCv?.charged_attachment_ids ?? existingCv?.chargedAttachmentIds ?? null;
            const existingChargedIds: string[] | null = Array.isArray(existingChargedRaw)
                ? existingChargedRaw.map((x: any) => String(x ?? '').trim()).filter(Boolean)
                : null;

            // Migration behavior:
            // - If CV already exists but has no charged list (legacy), we DO NOT retroactively charge.
            //   We initialize "charged_attachment_ids" to current attachments so future new attachments are charged correctly.
            if (!isNewCv && existingChargedIds == null) {
                try {
                    (db as any).cvs.update(reqId, {
                        charged_attachment_ids: attachmentIdsNow,
                    });
                } catch {
                    // ignore
                }
            } else {
                const chargedSet = new Set((existingChargedIds ?? []).map((x) => String(x ?? '').trim()).filter(Boolean));
                const newlyAdded = attachmentsNow.filter((a) => !chargedSet.has(a.id));

                const baseCost = isNewCv ? await getResumeFeatureCoinCost('AI Resume Builder', 6) : 0;
                const fileUnit = await getResumeFeatureCoinCost('File Input', 0);
                const imageUnit = await getResumeFeatureCoinCost('Images Input', 0);
                const videoUnit = await getResumeFeatureCoinCost('Video Input', 0);
                const voiceUnit = await getResumeFeatureCoinCost('Voice Input', 0);

                const counts = { file: 0, image: 0, video: 0, voice: 0 } as Record<AttachmentKind, number>;
                for (const a of newlyAdded) {
                    counts[a.kind] += 1;
                }

                const attachmentCost =
                    Math.max(0, fileUnit) * counts.file +
                    Math.max(0, imageUnit) * counts.image +
                    Math.max(0, videoUnit) * counts.video +
                    Math.max(0, voiceUnit) * counts.voice;

                const totalCost = Math.max(0, baseCost) + Math.max(0, attachmentCost);

                if (totalCost > 0) {
                    const charge = await consumeCredit(userIdNum, totalCost, 'ai_resume_builder');
                    if (!charge.success) {
                        return NextResponse.json(
                            {
                                error: charge.error || 'Insufficient coins to create/update your resume',
                                remainingCredits: charge.remainingCredits,
                                requiredCredits: totalCost,
                                breakdown: {
                                    base: baseCost,
                                    newly_added: counts,
                                    file_input: { unit: fileUnit, qty: counts.file, total: fileUnit * counts.file },
                                    images_input: { unit: imageUnit, qty: counts.image, total: imageUnit * counts.image },
                                    video_input: { unit: videoUnit, qty: counts.video, total: videoUnit * counts.video },
                                    voice_input: { unit: voiceUnit, qty: counts.voice, total: voiceUnit * counts.voice },
                                },
                            },
                            { status: 402 },
                        );
                    }
                }

                // Persist charged ids so we only charge delta next time.
                const nextChargedIds = Array.from(new Set([...(existingChargedIds ?? []), ...attachmentIdsNow])).filter(Boolean);
                try {
                    (db as any).cvs.update(reqId, {
                        charged_attachment_ids: nextChargedIds,
                    });
                } catch {
                    // ignore
                }
            }
        }

        const logContext = finalUserId
            ? { userId: finalUserId, endpoint: '/api/cv/analyze', action: 'analyzeCV' }
            : undefined;
        const analysis = await ChatGPTService.analyzeCV(finalCvText, undefined, logContext);

        const normalizeAnalysisForStorage = (value: unknown) => {
            if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
            const anyValue = value as any;
            if (anyValue.improvedResume && typeof anyValue.improvedResume === 'object') return anyValue;
            const looksLikeStructured =
                'personalInfo' in anyValue ||
                'summary' in anyValue ||
                'technicalSkills' in anyValue ||
                'professionalExperience' in anyValue ||
                'education' in anyValue ||
                'certifications' in anyValue ||
                'languages' in anyValue ||
                'additionalInfo' in anyValue;
            if (!looksLikeStructured) return value;
            return { improvedResume: value };
        };

        // Save to database if authenticated
        if (finalUserId) {
            const userIdNum = parseInt(finalUserId, 10);

            // ذخیره CV در database
            let cv: any = (db as any).cvs.findByRequestId(reqId);
            if (cv) {
                cv = (db as any).cvs.update(reqId, {
                    content: typeof finalCvText === 'string' ? finalCvText : JSON.stringify(finalCvText),
                    // Store in the requested shape for DB/admin: { improvedResume: ... }
                    analysis_result: JSON.stringify(normalizeAnalysisForStorage(analysis)),
                });
            } else {
                cv = (db as any).cvs.create({
                    user_id: userIdNum,
                    request_id: reqId,
                    content: typeof finalCvText === 'string' ? finalCvText : JSON.stringify(finalCvText),
                    // Store in the requested shape for DB/admin: { improvedResume: ... }
                    analysis_result: JSON.stringify(normalizeAnalysisForStorage(analysis)),
                });
            }

            recordUserStateTransition(parseInt(finalUserId), {}, { event: 'cv_analyze' });

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
