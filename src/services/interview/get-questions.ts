import { apiClientClient } from '@/services/api-client';

export type InterviewMode = 'chat' | 'voice';

export interface InterviewQuestionApiItem {
    id: number;
    question: string;
    category: 'technical' | 'behavioral' | 'situational' | 'career';
    skillsTested: string[];
    suggestedAnswer: string;
    answerTips: string;
}

export interface InterviewQuestionsResponse {
    sessionId: number | null;
    inferredPosition?: string | null;
    positionRationale?: string | null;
    questions: InterviewQuestionApiItem[];
    audioClips?: Array<{ id: number; audioBase64: string }> | null;
    mode?: InterviewMode;
}

export interface InterviewQuestionsPayload {
    position?: string | null;
    cvData?: unknown;
    userId?: number | string | null;
    isFinalStep?: boolean;
    jobDescription?: string;
    mode?: InterviewMode;
    requestId?: string | null;
    planId?: string | null;
}

export const fetchInterviewQuestions = async (
    payload: InterviewQuestionsPayload,
): Promise<InterviewQuestionsResponse> => {
    const { data } = await apiClientClient.post('interview/questions', payload);
    return data as InterviewQuestionsResponse;
};
