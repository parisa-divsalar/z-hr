import { apiClientClient } from '@/services/api-client';

export type AddCoverLetterParams = {
    userId?: string | null;
    lang?: string;
    jobDescription: string;
    cvContent: string;
    companyName: string;
    positionTitle: string;
    /** Unique cover-letter id (optional; if omitted server generates a new one). */
    requestId?: string | null;
    /** Resume requestId to attach this cover letter to (enables multi cover letters per resume). */
    cvRequestId?: string | null;
};

export async function addCoverLetter(params: AddCoverLetterParams) {
    const { data } = await apiClientClient.post('cv/cover-letter', {
        requestId: params.requestId ?? undefined,
        cvRequestId: params.cvRequestId ?? undefined,
        isFinalStep: true,
        jobDescription: params.jobDescription,
        cvContent: params.cvContent,
        companyName: params.companyName,
        positionTitle: params.positionTitle,
    });

    return data;
}


























