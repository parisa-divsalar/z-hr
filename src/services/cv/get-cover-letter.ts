import { apiClientClient } from '@/services/api-client';

export type GetCoverLetterParams = {
    requestId: string;
};

export async function getCoverLetter(params: GetCoverLetterParams) {
    const { data } = await apiClientClient.get('cv/get-cover-letter', {
        params: {
            RequestId: String(params.requestId),
        },
    });

    return data;
}


