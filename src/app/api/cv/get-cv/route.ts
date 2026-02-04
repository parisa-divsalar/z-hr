import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
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

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const requestId = searchParams.get('requestId');
        const userId = searchParams.get('userId');

        if (!requestId) {
            return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
        }

        // Get CV from database
        let cv = db.cvs.findByRequestId(requestId);

        if (!cv) {
            return NextResponse.json({ error: 'CV not found' }, { status: 404 });
        }

        // Check user access: prefer authenticated user
        const authedUserId = await getUserIdFromAuth(request);
        const finalUserId = authedUserId || userId;
        if (finalUserId && cv.user_id && cv.user_id.toString() !== finalUserId) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const analysisResultRaw = cv.analysis_result ? JSON.parse(cv.analysis_result) : null;
        // Backward compatibility: DB can store either:
        // - legacy structured resume JSON
        // - or `{ improvedResume: <structured resume JSON> }` (preferred/admin shape)
        const analysisResult =
            analysisResultRaw &&
            typeof analysisResultRaw === 'object' &&
            !Array.isArray(analysisResultRaw) &&
            (analysisResultRaw as any).improvedResume
                ? (analysisResultRaw as any).improvedResume
                : analysisResultRaw;
        const content = cv.content ? (typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content) : null;

        return NextResponse.json({
            data: {
                requestId: cv.request_id,
                content,
                title: cv.title,
                analysis: analysisResult,
                createdAt: cv.created_at,
                updatedAt: cv.updated_at,
            },
        });
    } catch (error: any) {
        console.error('Error getting CV:', error);
        return NextResponse.json({ error: 'Failed to get CV' }, { status: 500 });
    }
}
