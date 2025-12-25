import { apiClientClient } from '@/services/api-client';

export type PostImprovedParams = {
    userId?: string | null;
    lang?: string;
};

export async function postImproved(params: PostImprovedParams) {
    const { data } = await apiClientClient.post('cv/post-improved', {
        userId: params.userId ?? undefined,
        lang: params.lang ?? 'en',
    });
    return data;
}

