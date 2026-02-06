import { apiClientClient } from '@/services/api-client';

export type UpdateCoverLetterParams = {
    requestId: string;
    coverLetter: string;
    subject?: string;
};

export async function updateCoverLetter(params: UpdateCoverLetterParams) {
    const { data } = await apiClientClient.patch('cv/cover-letter', {
        requestId: params.requestId,
        coverLetter: params.coverLetter,
        subject: params.subject,
    });

    return data;
}



