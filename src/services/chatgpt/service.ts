import { getOpenAIClient } from './client';
import { PROMPTS } from './prompts';

export interface CVAnalysisResult {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
    summary: string;
    experience: Array<{
        company: string;
        position: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field: string;
        year: string;
    }>;
    skills: string[];
    languages: string[];
    certifications: string[];
}

export type ResumeImproveMode = 'analysis' | 'sections_text' | 'auto';

export interface SkillGapAnalysis {
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    matchPercentage: number;
}

export class ChatGPTService {
    static async analyzeCV(cvText: string): Promise<CVAnalysisResult> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert HR and CV analyzer. Always respond with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.analyzeCV(cvText),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from ChatGPT');
            }

            try {
                return JSON.parse(content) as CVAnalysisResult;
            } catch (parseError) {
                const msg =
                    parseError instanceof Error ? parseError.message : String(parseError);
                throw new Error(`ChatGPT returned invalid JSON: ${msg}`);
            }
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    static async improveCVSection(section: string, context?: string): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert CV writer. Provide only the improved text without explanations.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.improveCV(section, context),
                    },
                ],
                temperature: 0.7,
            });

            return response.choices[0]?.message?.content || section;
        } catch (error) {
            console.error('Error improving CV section:', error);
            throw new Error('Failed to improve CV section');
        }
    }

    static async improveStructuredResume(params: {
        resume: unknown;
        mode?: ResumeImproveMode;
    }): Promise<unknown> {
        const openai = getOpenAIClient();
        const { resume, mode = 'auto' } = params;

        // We still use one unified prompt, but we keep this heuristic in case we need
        // to branch prompts/models later.
        const detectedMode: ResumeImproveMode =
            mode !== 'auto'
                ? mode
                : resume && typeof resume === 'object' && !Array.isArray(resume) && 'personalInfo' in (resume as any)
                  ? 'analysis'
                  : 'sections_text';

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert HR and CV editor. Always respond with valid JSON only.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.improveStructuredResume({
                            mode: detectedMode,
                            resume,
                        }),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from ChatGPT');
            }

            try {
                return JSON.parse(content) as unknown;
            } catch (parseError) {
                const msg = parseError instanceof Error ? parseError.message : String(parseError);
                throw new Error(`ChatGPT returned invalid JSON: ${msg}`);
            }
        } catch (error) {
            throw error instanceof Error ? error : new Error(String(error));
        }
    }

    static async generateCoverLetter(cvData: any, jobDescription: string): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert cover letter writer. Write professional and compelling cover letters.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.generateCoverLetter(cvData, jobDescription),
                    },
                ],
                temperature: 0.8,
            });

            return response.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Error generating cover letter:', error);
            throw new Error('Failed to generate cover letter');
        }
    }

    static async generateInterviewQuestions(position: string, cvData: any): Promise<string[]> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert interviewer. Always respond with valid JSON array of questions.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.generateInterviewQuestions(position, cvData),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from ChatGPT');
            }

            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : parsed.questions || [];
        } catch (error) {
            console.error('Error generating interview questions:', error);
            throw new Error('Failed to generate interview questions');
        }
    }

    static async analyzeSkillGap(cvData: any, jobDescription: string): Promise<SkillGapAnalysis> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert career advisor. Always respond with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.analyzeSkillGap(cvData, jobDescription),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.5,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from ChatGPT');
            }

            return JSON.parse(content) as SkillGapAnalysis;
        } catch (error) {
            console.error('Error analyzing skill gap:', error);
            throw new Error('Failed to analyze skill gap');
        }
    }

    static async chat(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: messages as any,
                temperature: 0.7,
            });

            return response.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Error in chat:', error);
            throw new Error('Failed to get chat response');
        }
    }
}

