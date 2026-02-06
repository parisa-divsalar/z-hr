import { apiClientClient } from '@/services/api-client';

export type ListCoverLettersParams = {
    /** Resume requestId (optional). If omitted, API will list current user's cover letters (requires login). */
    cvRequestId?: string | null;
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
    const qp: Record<string, string> = {};
    const cvRequestId = params?.cvRequestId != null ? String(params.cvRequestId).trim() : '';
    if (cvRequestId) qp.cvRequestId = cvRequestId;

    const { data } = await apiClientClient.get('cv/cover-letter/list', { params: qp });

    return data as { cvRequestId?: string | null; scope?: 'resume' | 'user'; items: CoverLetterListItem[] };
}


