import { apiClientClient } from '@/services/api-client';

export type ResetPasswordParams = {
    userId: string | number;
    code: string;
    password: string;
    confirmPassword: string;
};

/**
 * Calls Next.js API route `/api/auth/confirm-reset-password`.
 * Used when completing the "forgot password" flow with the code sent to the user.
 */
export async function resetPassword(params: ResetPasswordParams) {
    const { data } = await apiClientClient.post('auth/confirm-reset-password', {
        userId: params.userId,
        code: params.code,
        password: params.password,
        confirmPassword: params.confirmPassword,
    });
    return data;
}
