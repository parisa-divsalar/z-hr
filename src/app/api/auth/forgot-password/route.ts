import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { ChatGPTService } from '@/services/chatgpt/service';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = db.users.findByEmail(email);

        if (!user) {
            return NextResponse.json({
                message: 'If an account with that email exists, a password reset link has been sent.',
            });
        }

        const resetToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        const logContext = { userId: String(user.id), endpoint: '/api/auth/forgot-password', action: 'chat' };

        await ChatGPTService.chat(
            [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Generate a friendly password reset message.',
                },
                {
                    role: 'user',
                    content: `Generate a password reset message for user ${user.email}. The reset token is ${resetToken}.`,
                },
            ],
            logContext
        );

        return NextResponse.json({
            message: 'If an account with that email exists, a password reset link has been sent.',
            ...(process.env.NODE_ENV === 'development' && { resetToken }),
        });
    } catch (error: any) {
        console.error('Error in forgot password:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
































