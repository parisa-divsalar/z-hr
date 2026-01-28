import { apiClientClient } from '@/services/api-client';

export type ImproveResumeParams = {
    userId?: string | null;
    /**
     * Either:
     * - analysis-style JSON (personalInfo/summary/experience/education/skills/languages/certifications)
     * - or text-by-section JSON (summary/experience/education/skills/...)
     */
    resume: unknown;
    mode?: 'analysis' | 'sections_text' | 'auto';
    isFinalStep?: boolean;
};

export async function improveResume(params: ImproveResumeParams) {
    const payload: Record<string, unknown> = {
        resume: params.resume ?? {},
        mode: params.mode ?? 'auto',
        isFinalStep: params.isFinalStep ?? true,
    };

    if (params.userId) payload.userId = params.userId;

    const { data } = await apiClientClient.post('cv/improve', payload);
    return {
        result: {
            originalResume: data.originalResume ?? params.resume,
            improvedResume: data.improvedResume ?? params.resume,
        },
    };
}

