/*
 * [API KEY] OpenAI: OPENAI_API_KEY (set in .env.local)
 * Keep this header so it isn't removed accidentally.
 */
import { getOpenAIClient } from './client';
import { PROMPTS } from './prompts';

/**
 * Complete CV Analysis Result with all sections
 * Enhanced structure to match ATS-friendly output format
 */
export interface CVAnalysisResult {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
    summary: string;
    technicalSkills?: string[]; // New: structured technical skills
    professionalExperience?: Array<{ // New: structured professional experience
        title: string;
        company: string;
        dates: string;
        bullets: string[];
    }>;
    // Legacy fields for backward compatibility
    experience?: Array<{
        company: string;
        position: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        degree: string;
        institution: string;
        location?: string;
        dates?: string;
        details?: string[];
        // Legacy fields for backward compatibility
        field?: string;
        year?: string;
    }>;
    // Legacy skills field for backward compatibility
    skills?: string[];
    languages: Array<{
        language: string;
        level: string;
    }>;
    certifications: Array<{
        title: string;
        issuer: string;
        issue_date?: string;
    }>;
    selectedProjects?: Array<{
        name: string;
        summary: string;
        tech: string[];
        bullets: string[];
        link?: string;
    }>;
    additionalInfo?: {
        notes: string[];
    };
}

export interface SkillGapAnalysis {
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    matchPercentage: number;
}

export type ResumeImproveMode = 'analysis' | 'sections_text' | 'auto';

export class ChatGPTService {
    private static fallbackAnalyzeCV(cvText: string): CVAnalysisResult {
        const text = (cvText ?? '').toString();

        const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
        const phoneMatch = text.match(
            /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/
        );

        const firstNonEmptyLine =
            text
                .split(/\r?\n/)
                .map((l) => l.trim())
                .find((l) => l.length > 0) ?? '';

        const nameFromLabel =
            text.match(/(?:^|\n)\s*(?:name|full\s*name)\s*[:：]\s*(.+)\s*$/im)?.[1]?.trim() ??
            '';

        const summary = (() => {
            const compact = text.replace(/\s+/g, ' ').trim();
            if (!compact) return '';
            return compact.length > 400 ? `${compact.slice(0, 400)}...` : compact;
        })();

        return {
            personalInfo: {
                name: nameFromLabel || firstNonEmptyLine,
                email: emailMatch?.[0] ?? '',
                phone: phoneMatch?.[0] ?? '',
                location: '',
            },
            summary,
            experience: [],
            education: [],
            skills: [],
            languages: [],
            certifications: [],
        };
    }

    /**
     * Analyze CV/Resume text and extract structured information
     * Enhanced: Now accepts optional jobDescription for context-aware analysis
     */
    static async analyzeCV(cvText: string, jobDescription?: string): Promise<CVAnalysisResult> {
        let openai: ReturnType<typeof getOpenAIClient> | null = null;
        try {
            openai = getOpenAIClient();
        } catch (e) {
            // No API key / client init issue: return a safe fallback so the app keeps working.
            console.warn('OpenAI client unavailable, using fallback CV analysis:', e);
            return ChatGPTService.fallbackAnalyzeCV(cvText);
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert HR and CV analyzer specializing in ATS optimization. Always respond with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.analyzeCV(cvText, jobDescription),
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
            // If OpenAI call fails (quota/network/etc), fall back instead of throwing 500.
            console.warn('OpenAI analyzeCV failed, using fallback CV analysis:', error);
            return ChatGPTService.fallbackAnalyzeCV(cvText);
        }
    }

    /**
     * Improve a section of CV
     * Enhanced: Now accepts optional jobDescription for context-aware improvement
     */
    static async improveCVSection(section: string, context?: string, jobDescription?: string): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert ATS-optimized CV writer. Provide only the improved text without explanations.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.improveCV(section, context, jobDescription),
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

    /**
     * Improve and re-classify the full resume in ONE call (structured JSON).
     * Enhanced: Now accepts jobDescription and structuredInput for better context and data organization
     */
    static async improveStructuredResume(params: { 
        resume: unknown; 
        mode?: ResumeImproveMode;
        jobDescription?: string;
        structuredInput?: {
            personalInfo?: any;
            summary?: any;
            technicalSkills?: any;
            professionalExperience?: any;
            education?: any;
            certifications?: any;
            selectedProjects?: any;
            languages?: any;
            additionalInfo?: any;
        };
    }): Promise<unknown> {
        let openai: ReturnType<typeof getOpenAIClient> | null = null;
        try {
            openai = getOpenAIClient();
        } catch (e) {
            // No API key / client init issue: return input unchanged so the app keeps working.
            console.warn('OpenAI client unavailable, returning resume unchanged:', e);
            return params.resume ?? {};
        }

        const { resume, mode = 'auto', jobDescription, structuredInput } = params;

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
                        content: 'You are an expert ATS-optimized HR and CV editor. Always respond with valid JSON only, including all CV sections.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.improveStructuredResume({ 
                            resume, 
                            mode: detectedMode,
                            jobDescription,
                            structuredInput
                        }),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.3,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('No response from ChatGPT');

            try {
                return JSON.parse(content) as unknown;
            } catch (parseError) {
                const msg = parseError instanceof Error ? parseError.message : String(parseError);
                throw new Error(`ChatGPT returned invalid JSON: ${msg}`);
            }
        } catch (error) {
            console.warn('OpenAI improveStructuredResume failed, returning resume unchanged:', error);
            return resume ?? {};
        }
    }

    /**
     * Generate cover letter
     */
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

    /**
     * Generate interview questions
     * Enhanced: Now accepts optional jobDescription for better context
     */
    static async generateInterviewQuestions(position: string, cvData: any, jobDescription?: string): Promise<string[]> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert interviewer specializing in technical and behavioral assessments. Always respond with valid JSON.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.generateInterviewQuestions(position, cvData, jobDescription),
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
            // Handle both array and object with questions key
            // New format returns { questions: [...] }, old format returns array directly
            if (Array.isArray(parsed)) {
                return parsed;
            } else if (parsed.questions && Array.isArray(parsed.questions)) {
                return parsed.questions;
            } else {
                // Fallback: return empty array if structure is unexpected
                console.warn('Unexpected response format from generateInterviewQuestions:', parsed);
                return [];
            }
        } catch (error) {
            console.error('Error generating interview questions:', error);
            throw new Error('Failed to generate interview questions');
        }
    }

    /**
     * Analyze skill gap
     */
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

    /**
     * Chat completion for general purposes
     */
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

    /**
     * Extract text from file using ChatGPT Vision API for images or reading file content for text files
     */
    static async extractTextFromFile(file: File): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const fileType = file.type.toLowerCase();
            const fileName = file.name.toLowerCase();

            // Handle images using Vision API
            if (fileType.startsWith('image/') || /\.(png|jpe?g|jfif|pjpeg|pjp|webp|avif|gif|bmp|svg|ico|apng|tiff?|heic|heif)$/i.test(fileName)) {
                const arrayBuffer = await file.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const dataUrl = `data:${fileType};base64,${base64}`;

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: 'Extract all text content from this image. Return only the extracted text without any explanations or formatting.',
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: dataUrl,
                                    },
                                },
                            ],
                        },
                    ],
                    max_tokens: 4000,
                });

                return response.choices[0]?.message?.content || '';
            }

            // Handle PDF files - convert to image first or use text extraction
            if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
                // For PDF, we'll need to convert pages to images and use Vision API
                // For now, return a message indicating PDF support needs implementation
                // TODO: Implement PDF text extraction using pdf.js or similar
                throw new Error('PDF text extraction is not yet implemented. Please convert PDF to images first.');
            }

            // Handle text files - read directly
            if (fileType.startsWith('text/') || /\.(txt|md|json|xml|html|css|js|ts|jsx|tsx)$/i.test(fileName)) {
                return await file.text();
            }

            // Handle video files - use Whisper API for transcription
            if (fileType.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv|avi|mkv)$/i.test(fileName)) {
                // Convert video to audio and use Whisper
                // For now, return a message indicating video support needs implementation
                throw new Error('Video transcription is not yet implemented. Please extract audio first.');
            }

            // For other file types, try to read as text
            try {
                return await file.text();
            } catch {
                throw new Error(`Unsupported file type: ${fileType}. Please use images, PDFs, or text files.`);
            }
        } catch (error) {
            console.error('Error extracting text from file:', error);
            throw error instanceof Error ? error : new Error('Failed to extract text from file');
        }
    }
}

