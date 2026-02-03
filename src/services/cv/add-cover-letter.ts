import { apiClientClient } from '@/services/api-client';

export type AddCoverLetterParams = {
    userId?: string | null;
    lang?: string;
    jobDescription: string;
    cvContent: string;
    companyName: string;
    positionTitle: string;
    requestId?: string | null;
};

export async function addCoverLetter(params: AddCoverLetterParams) {
    const { data } = await apiClientClient.post('cv/cover-letter', {
        requestId: params.requestId ?? undefined,
        isFinalStep: true,
        jobDescription: params.jobDescription,
        cvContent: params.cvContent,
        companyName: params.companyName,
        positionTitle: params.positionTitle,
    });

    return data;
}
























