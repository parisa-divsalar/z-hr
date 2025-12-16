import { apiClientClient } from '@/services/api-client';

export type UpdatePasswordParams = {
    userId: string | number;
    [key: string]: unknown;
};

/**
 * Calls Next.js API route `/api/auth/update-password` which proxies to:
 * `https://apisrv.zenonrobotics.ae/api/Apps/UpdatePassword/{userId}`
 */
export async function updatePassword(params: UpdatePasswordParams) {
    const { data } = await apiClientClient.post('auth/update-password', params);
    return data;
}


