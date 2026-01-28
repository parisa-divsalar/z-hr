import { apiClientClient } from '@/services/api-client';

export type GetCoverLetterParams = {
    requestId: string;
};

export async function getCoverLetter(params: GetCoverLetterParams) {
    const { data } = await apiClientClient.get('cv/cover-letter', {
        params: {
            requestId: String(params.requestId),
        },
    });

    return data;
}


