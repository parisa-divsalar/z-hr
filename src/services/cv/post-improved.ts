import { apiClientClient } from '@/services/api-client';

export type PostImprovedParams = {
    userId?: string | null;
    lang?: string;
    cvSection: string;
    paragraph: string;
    /**
     * Optional - kept for backward compatibility with the API route.
     * (Some backends accept correlating a request to an existing requestId.)
     */
    requestId?: string | null;
};

export async function postImproved(params: PostImprovedParams) {
    const payload: Record<string, unknown> = {
        cvSection: params.cvSection,
        paragraph: params.paragraph,
        lang: params.lang ?? 'en',
    };

    if (params.userId) payload.userId = params.userId;
    if (params.requestId) payload.requestId = params.requestId;

    const { data } = await apiClientClient.post('cv/post-improved', payload);
    return data;
}

