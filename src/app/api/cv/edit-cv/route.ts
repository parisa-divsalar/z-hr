import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
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

export async function PUT(request: NextRequest) {
    try {
        const { userId, requestId, bodyOfResume, title, section, sectionText } = await request.json();
        const authedUserId = await getUserIdFromAuth(request);

        if (!requestId) {
            return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
        }

        const finalUserId = authedUserId || (userId ? String(userId) : null);
        let nextBodyOfResume = bodyOfResume;
        if (section && bodyOfResume && typeof bodyOfResume === 'object' && sectionText !== undefined) {
            nextBodyOfResume = await ChatGPTService.editResumeSection(
                bodyOfResume,
                String(section),
                sectionText,
                finalUserId ? { userId: finalUserId, endpoint: '/api/cv/edit-cv', action: 'edit' } : { endpoint: '/api/cv/edit-cv', action: 'edit' },
            );
        }

        // Check if CV exists
        let cv = db.cvs.findByRequestId(requestId);

        if (cv) {
            // Update existing CV
            const updateData: any = {};
            if (nextBodyOfResume !== undefined) {
                updateData.content = JSON.stringify(nextBodyOfResume);
            }
            if (title !== undefined) {
                updateData.title = title;
            }
            
            cv = db.cvs.update(requestId, updateData);
        } else {
            // Create new CV if doesn't exist
            if (!finalUserId) {
                return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
            }

            cv = db.cvs.create({
                user_id: parseInt(finalUserId),
                request_id: requestId,
                content: nextBodyOfResume ? JSON.stringify(nextBodyOfResume) : null,
                title: title || null,
            });
        }

        const content = cv.content ? (typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content) : null;

        return NextResponse.json({
            data: {
                requestId: cv.request_id,
                content,
                title: cv.title,
                createdAt: cv.created_at,
                updatedAt: cv.updated_at,
            },
        });
    } catch (error: any) {
        console.error('Error editing CV:', error);
        return NextResponse.json({ error: 'Failed to edit CV' }, { status: 500 });
    }
}
