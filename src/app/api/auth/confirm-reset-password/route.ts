import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

type ApiError = { error: { message: string } };
type ApiSuccess = { data: { message: string } };

const RESET_TOKEN_VALID_MS = 60 * 60 * 1000; // 1 hour

function jsonError(message: string, status: number) {
    return NextResponse.json<ApiError>({ error: { message } }, { status });
}

function normalizeString(value: unknown): string {
    return String(value ?? '').trim();
}

/** Verify reset code (base64 of "userId:timestamp" as sent from forgot-password). */
function verifyResetCode(code: string, expectedUserId: number): boolean {
    try {
        const decoded = Buffer.from(code, 'base64').toString('utf8');
        const [userIdStr, timestampStr] = decoded.split(':');
        const userId = Number(userIdStr);
        const timestamp = Number(timestampStr);
        if (!Number.isFinite(userId) || !Number.isFinite(timestamp)) return false;
        if (userId !== expectedUserId) return false;
        const age = Date.now() - timestamp;
        return age >= 0 && age <= RESET_TOKEN_VALID_MS;
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        let body: any = null;
        try {
            body = await request.json();
        } catch {
            body = null;
        }

        const userId = Number(body?.userId);
        const code = normalizeString(body?.code);
        const newPassword = normalizeString(body?.password);
        const confirmPassword = normalizeString(body?.confirmPassword ?? body?.repeatPassword);

        if (!Number.isFinite(userId)) return jsonError('Invalid or missing userId', 400);
        if (!code) return jsonError('Reset code is required', 400);
        if (!newPassword) return jsonError('New password is required', 400);
        if (confirmPassword && confirmPassword !== newPassword) return jsonError('Passwords do not match', 400);
        if (newPassword.length < 8) return jsonError('Password must be at least 8 characters', 400);

        if (!verifyResetCode(code, userId)) {
            return jsonError('Invalid or expired reset code', 400);
        }

        const prisma = getPrismaOrNull();

        if (prisma) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });
            if (!user) return jsonError('User not found', 404);

            const newHash = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: userId },
                data: { passwordHash: newHash },
                select: { id: true },
            });
            return NextResponse.json<ApiSuccess>({ data: { message: 'Password reset successfully' } });
        }

        const user = db.users.findById(userId);
        if (!user) return jsonError('User not found', 404);

        const newHash = await bcrypt.hash(newPassword, 10);
        const updated = db.users.update(userId, { password_hash: newHash });
        if (!updated) return jsonError('Failed to update password', 500);

        return NextResponse.json<ApiSuccess>({ data: { message: 'Password reset successfully' } });
    } catch (error: any) {
        console.error('Error confirming reset password:', error);
        return jsonError('Failed to reset password', 500);
    }
}
