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
    isFinalStep?: boolean;
    context?: string;
};

export async function postImproved(params: PostImprovedParams) {
    const payload: Record<string, unknown> = {
        section: params.paragraph || params.cvSection,
        context: params.context || '',
        isFinalStep: params.isFinalStep ?? true,
    };

    if (params.userId) payload.userId = params.userId;
    if (params.requestId) payload.requestId = params.requestId;

    const { data } = await apiClientClient.post('cv/improve', payload);
    return {
        result: {
            improved: data.improved || data.original || params.paragraph,
            original: data.original || params.paragraph,
        },
    };
}

