import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserIdFromAuth(request: NextRequest): Promise<number | null> {
    try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get('accessToken')?.value;
        const header = request.headers.get('authorization');
        const headerToken = header?.startsWith('Bearer ') ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const id = Number(decoded?.userId);
        return Number.isFinite(id) ? id : null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId, requestId, wizardData } = await request.json();

        // Prefer authenticated userId (cookie/header JWT), fallback to body for backward compatibility
        const authedUserId = await getUserIdFromAuth(request);
        const parsedUserId = Number(userId);
        const finalUserId = authedUserId ?? (Number.isFinite(parsedUserId) ? parsedUserId : null);
        if (!finalUserId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        if (!wizardData) {
            return NextResponse.json({ error: 'wizardData is required' }, { status: 400 });
        }

        // استفاده از requestId یا ایجاد یک requestId جدید
        const finalRequestId = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // ذخیره یا به‌روزرسانی اطلاعات wizard در database
        const saved = db.wizardData.upsert({
            user_id: finalUserId,
            request_id: finalRequestId,
            data: JSON.stringify(wizardData),
            step: wizardData.step || 'unknown',
        });

        recordUserStateTransition(finalUserId, {}, { event: 'wizard_save', step: wizardData.step || 'unknown' });

        return NextResponse.json({
            data: {
                requestId: finalRequestId,
                saved: true,
                updated_at: saved.updated_at,
            },
        });
    } catch (error: any) {
        console.error('Error saving wizard data:', error);
        return NextResponse.json({ error: 'Failed to save wizard data' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const requestId = searchParams.get('requestId');
        const latest = searchParams.get('latest');

        // Prefer authenticated userId (cookie/header JWT), fallback to query for backward compatibility
        const authedUserId = await getUserIdFromAuth(request);
        const parsedUserId = Number(userId);
        const finalUserId = authedUserId ?? (Number.isFinite(parsedUserId) ? parsedUserId : null);
        if (!finalUserId) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        if (requestId) {
            // دریافت اطلاعات خاص یک requestId
            const wizardData = db.wizardData.findByUserIdAndRequestId(finalUserId, requestId);
            if (!wizardData) {
                return NextResponse.json({ error: 'Wizard data not found' }, { status: 404 });
            }

            return NextResponse.json({
                data: {
                    ...wizardData,
                    data: wizardData.data ? JSON.parse(wizardData.data) : null,
                },
            });
        } else {
            // دریافت همه اطلاعات wizard کاربر (or latest)
            const allWizardData = db.wizardData.findByUserId(finalUserId);
            const mapped = allWizardData.map((w: any) => ({
                ...w,
                data: w.data ? JSON.parse(w.data) : null,
            }));

            if (latest === '1' || latest === 'true') {
                const sorted = [...mapped].sort((a: any, b: any) => {
                    const at = new Date(a.updated_at || a.created_at || 0).getTime();
                    const bt = new Date(b.updated_at || b.created_at || 0).getTime();
                    return bt - at;
                });
                return NextResponse.json({ data: sorted[0] ?? null });
            }

            return NextResponse.json({ data: mapped });
        }
    } catch (error: any) {
        console.error('Error getting wizard data:', error);
        return NextResponse.json({ error: 'Failed to get wizard data' }, { status: 500 });
    }
}
