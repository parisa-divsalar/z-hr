import { apiClientClient } from '@/services/api-client';

export type UpdatePasswordParams = {
    currentPassword: string;
    password: string;
    confirmPassword: string;
};

/**
 * Calls Next.js API route `/api/auth/update-password`.
 *
 * Auth:
 * - Prefer cookie session when present (httpOnly `accessToken` set on login)
 * - Fallback to Authorization: Bearer <token> injected by `apiClientClient` from `useAuthStore`
 */
export async function updatePassword(params: UpdatePasswordParams) {
    const { data } = await apiClientClient.post('auth/update-password', {
        currentPassword: params.currentPassword,
        password: params.password,
        confirmPassword: params.confirmPassword,
    });
    return data;
}


