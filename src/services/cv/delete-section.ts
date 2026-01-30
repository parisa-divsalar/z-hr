import { apiClientClient } from '@/services/api-client';

export type DeleteSectionParams = {
    section: string;
    resume: unknown;
};

export async function deleteResumeSection(params: DeleteSectionParams) {
    const { data } = await apiClientClient.post('cv/delete', {
        section: params.section,
        resume: params.resume,
    });

    return data as { updatedResume?: unknown };
}







