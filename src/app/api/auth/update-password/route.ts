import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { db } from '@/lib/db';
import { getPrismaOrNull } from '@/lib/db/require-prisma';

type ApiError = { error: { message: string } };
type ApiSuccess = { data: { message: string } };

function jsonError(message: string, status: number) {
    return NextResponse.json<ApiError>({ error: { message } }, { status });
}

function normalizeString(value: unknown): string {
    return String(value ?? '').trim();
}

export async function POST(request: NextRequest) {
    try {
        let body: any = null;
        try {
            body = await request.json();
        } catch {
            body = null;
        }

        // Accept multiple client shapes:
        // - { oldPassword, newPassword }
        // - { currentPassword, password, confirmPassword }
        // - { currentPassword, password, repeatPassword }
        const oldPassword = normalizeString(body?.oldPassword ?? body?.currentPassword);
        const newPassword = normalizeString(body?.newPassword ?? body?.password);
        const confirmPassword = normalizeString(body?.confirmPassword ?? body?.repeatPassword ?? body?.confirm);

        const authedUserId = await getUserIdFromAuth(request);
        const fallbackUserId = Number(body?.userId);
        const finalUserId = authedUserId ?? (Number.isFinite(fallbackUserId) ? fallbackUserId : null);

        if (!finalUserId) return jsonError('Authentication required', 401);
        if (!oldPassword || !newPassword) return jsonError('Current password and new password are required', 400);
        if (confirmPassword && confirmPassword !== newPassword) return jsonError('Passwords do not match', 400);
        if (newPassword.length < 8) return jsonError('Password must be at least 8 characters', 400);
        if (oldPassword === newPassword) return jsonError('New password must be different from current password', 400);

        const prisma = getPrismaOrNull();

        // SQL/Prisma mode
        if (prisma) {
            const user = await prisma.user.findUnique({
                where: { id: finalUserId },
                select: { id: true, passwordHash: true },
            });
            if (!user) return jsonError('User not found', 404);

            const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!isValidPassword) return jsonError('Invalid current password', 401);

            const newHash = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: finalUserId },
                data: { passwordHash: newHash },
                select: { id: true },
            });

            return NextResponse.json<ApiSuccess>({ data: { message: 'Password updated successfully' } });
        }

        // JSON-db mode (dev)
        const user = db.users.findById(finalUserId);
        if (!user) return jsonError('User not found', 404);
        if (!user.password_hash) return jsonError('Password is not set for this account', 400);

        const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isValidPassword) return jsonError('Invalid current password', 401);

        const newHash = await bcrypt.hash(newPassword, 10);
        const updated = db.users.update(finalUserId, { password_hash: newHash });
        if (!updated) return jsonError('Failed to update password', 500);

        return NextResponse.json<ApiSuccess>({ data: { message: 'Password updated successfully' } });
    } catch (error: any) {
        console.error('Error updating password:', error);
        return jsonError('Failed to update password', 500);
    }
}
