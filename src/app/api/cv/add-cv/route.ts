import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { recordUserStateTransition } from '@/lib/user-state';

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
        const { userId, requestId, bodyOfResume, title, analysis } = await request.json();
        const authedUserId = await getUserIdFromAuth(request);
        const finalUserId = authedUserId || (userId ? String(userId) : null);
        if (!finalUserId) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const finalRequestId = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

        // Check if CV exists
        let cv = db.cvs.findByRequestId(finalRequestId);
        
        if (cv) {
            // Update existing CV
            cv = db.cvs.update(finalRequestId, {
                content: bodyOfResume ? JSON.stringify(bodyOfResume) : cv.content,
                title: title || cv.title,
                // Store in the requested shape for DB/admin: { improvedResume: ... }
                analysis_result: analysis ? JSON.stringify(normalizeAnalysisForStorage(analysis)) : cv.analysis_result,
            });
        } else {
            // Create new CV
            cv = db.cvs.create({
                user_id: parseInt(finalUserId),
                request_id: finalRequestId,
                content: bodyOfResume ? JSON.stringify(bodyOfResume) : null,
                title: title || null,
                // Store in the requested shape for DB/admin: { improvedResume: ... }
                analysis_result: analysis ? JSON.stringify(normalizeAnalysisForStorage(analysis)) : null,
            });
        }

        recordUserStateTransition(parseInt(finalUserId), {}, { event: 'cv_add' });

        return NextResponse.json({
            data: {
                requestId: cv.request_id,
                content: cv.content ? (typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content) : null,
                title: cv.title,
                createdAt: cv.created_at,
            },
        });
    } catch (error: any) {
        console.error('Error adding CV:', error);
        return NextResponse.json({ error: 'Failed to add CV' }, { status: 500 });
    }
}
