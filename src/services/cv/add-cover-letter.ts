import { apiClientClient } from '@/services/api-client';

export type AddCoverLetterParams = {
    userId?: string | null;
    lang?: string;
    jobDescription: string;
    cvContent: string;
    companyName: string;
    positionTitle: string;
};

export async function addCoverLetter(params: AddCoverLetterParams) {
    const { data } = await apiClientClient.post(
        'cv/add-cover-letter',
        {
            jobDescription: params.jobDescription,
            cvContent: params.cvContent,
            companyName: params.companyName,
            positionTitle: params.positionTitle,
        },
        {
            params: {
                userId: params.userId ?? undefined,
                lang: params.lang ?? 'en',
            },
        },
    );

    return data;
}





