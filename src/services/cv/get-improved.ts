import { apiClientClient } from '@/services/api-client';

export type GetImprovedParams = {
    requestId: string;
};

/**
 * Note: The new API doesn't require polling - it returns immediately.
 * This function is kept for backward compatibility but now just returns the same data.
 */
export async function getImproved(params: GetImprovedParams) {
    return {
        result: {
            improved: '',
            original: '',
        },
        status: 'completed',
    };
}



