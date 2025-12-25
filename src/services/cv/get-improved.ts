import { apiClientClient } from '@/services/api-client';

export type GetImprovedParams = {
    requestId: string;
};

/**
 * Polls the result of an "improve CV part" job.
 */
export async function getImproved(params: GetImprovedParams) {
    const { data } = await apiClientClient.get('cv/get-improved', {
        params: {
            requestId: params.requestId,
        },
    });
    return data;
}


