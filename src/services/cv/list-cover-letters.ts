import { apiClientClient } from '@/services/api-client';

export type ListCoverLettersParams = {
    /** Resume requestId */
    cvRequestId: string;
};

export type CoverLetterListItem = {
    requestId: string;
    cvRequestId: string;
    coverLetter: string;
    subject?: string;
    companyName?: string;
    positionTitle?: string;
    createdAt?: string;
    updatedAt?: string;
    data?: unknown;
};

export async function listCoverLetters(params: ListCoverLettersParams) {
    const { data } = await apiClientClient.get('cv/cover-letter/list', {
        params: {
            cvRequestId: String(params.cvRequestId),
        },
    });

    return data as { cvRequestId: string; items: CoverLetterListItem[] };
}


