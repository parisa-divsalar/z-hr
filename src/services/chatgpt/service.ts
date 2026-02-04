/*
 * [API KEY] OpenAI: OPENAI_API_KEY (set in .env.local)
 * Keep this header so it isn't removed accidentally.
 */
import { db } from '@/lib/db';
import { getOpenAIClient } from './client';
import { PROMPTS } from './prompts';

/** برای ذخیرهٔ ورودی/خروجی هر تعامل با ChatGPT در دیتابیس */
export type AiLogContext = { userId?: string | null; endpoint: string; action: string };

const AI_LOG_MAX_LEN = 25000;
const AI_LOG_PREVIEW_LEN = 500;

function logAiInteraction(
    ctx: AiLogContext | null | undefined,
    action: string,
    input: unknown,
    output: unknown
): void {
    if (!ctx?.endpoint) return;
    try {
        const inputStr = typeof input === 'string' ? input : JSON.stringify(input ?? '');
        const outputStr = typeof output === 'string' ? output : JSON.stringify(output ?? '');
        db.aiInteractions.append({
            user_id: ctx.userId ? parseInt(String(ctx.userId), 10) : null,
            endpoint: ctx.endpoint,
            action: ctx.action || action,
            input_preview: inputStr.slice(0, AI_LOG_PREVIEW_LEN),
            output_preview: outputStr.slice(0, AI_LOG_PREVIEW_LEN),
            input_full: inputStr.length > AI_LOG_MAX_LEN ? inputStr.slice(0, AI_LOG_MAX_LEN) + '...[truncated]' : inputStr,
            output_full: outputStr.length > AI_LOG_MAX_LEN ? outputStr.slice(0, AI_LOG_MAX_LEN) + '...[truncated]' : outputStr,
        });
    } catch (e) {
        console.warn('AiInteraction log failed:', e);
    }
}

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
    private static parseLineList(value: unknown): string[] {
        if (Array.isArray(value)) {
            return value.map((v) => String(v ?? '').trim()).filter(Boolean);
        }
        if (value === null || value === undefined) return [];
        const text = typeof value === 'string' ? value : String(value);
        return text
            .split(/[\r\n]+|[,;•]+/)
            .map((v) => v.trim())
            .filter(Boolean);
    }

    private static parseLanguages(value: unknown): Array<{ name: string; level: string }> {
        if (Array.isArray(value)) {
            return value
                .map((entry) => {
                    if (!entry || typeof entry !== 'object') {
                        const name = String(entry ?? '').trim();
                        return name ? { name, level: '' } : null;
                    }
                    const anyEntry = entry as any;
                    const name = String(anyEntry.name ?? anyEntry.language ?? '').trim();
                    const level = String(anyEntry.level ?? anyEntry.proficiency ?? '').trim();
                    if (!name && !level) return null;
                    return { name, level };
                })
                .filter(Boolean) as Array<{ name: string; level: string }>;
        }
        if (typeof value !== 'string') return [];
        return value
            .split(/\r?\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const match = line.split(/\s*[-:|]\s*/);
                const name = String(match[0] ?? '').trim();
                const level = String(match.slice(1).join(' - ') ?? '').trim();
                return { name, level };
            })
            .filter((entry) => entry.name.length > 0);
    }

    private static applyResumeSectionEdit(resume: unknown, section: string, sectionText: unknown): unknown {
        if (!resume || typeof resume !== 'object' || Array.isArray(resume)) {
            return resume ?? {};
        }

        const next: any = { ...(resume as any) };
        const asObject = (value: any) => (value && typeof value === 'object' && !Array.isArray(value) ? value : null);

        switch (section) {
            case 'summary': {
                const text = String(sectionText ?? '');
                next.summary = text;
                const profile = asObject(next.profile);
                if (profile) next.profile = { ...profile, summary: text };
                break;
            }
            case 'skills': {
                const list = ChatGPTService.parseLineList(sectionText);
                next.skills = list;
                next.skillList = list;
                break;
            }
            case 'contactWays': {
                const list = ChatGPTService.parseLineList(sectionText);
                next.contactWays = list;
                next.contactWay = list;
                break;
            }
            case 'languages': {
                const list = ChatGPTService.parseLanguages(sectionText);
                next.languages = list;
                break;
            }
            case 'education': {
                if (Array.isArray(sectionText)) {
                    next.education = sectionText;
                    break;
                }
                const blocks = String(sectionText ?? '')
                    .split(/\n\s*\n+/)
                    .map((b) => b.trim())
                    .filter(Boolean);
                next.education = blocks.map((text) => ({ text }));
                break;
            }
            case 'certificates': {
                const list = ChatGPTService.parseLineList(sectionText);
                next.certificates = list;
                next.certifications = list;
                break;
            }
            case 'selectedProjects': {
                if (Array.isArray(sectionText)) {
                    next.selectedProjects = sectionText;
                    break;
                }
                const blocks = String(sectionText ?? '')
                    .split(/\n\s*\n+/)
                    .map((b) => b.trim())
                    .filter(Boolean);
                next.selectedProjects = blocks.map((text) => ({ text }));
                break;
            }
            case 'jobDescription': {
                const text = String(sectionText ?? '');
                const jobDescription = asObject(next.jobDescription);
                next.jobDescription = jobDescription ? { ...jobDescription, text } : { text };
                next.jobDescriptionText = text;
                break;
            }
            case 'experience': {
                if (Array.isArray(sectionText)) {
                    next.experiences = sectionText;
                    next.experience = sectionText;
                    break;
                }
                const blocks = String(sectionText ?? '')
                    .split(/\n\s*\n+/)
                    .map((b) => b.trim())
                    .filter(Boolean);
                const base = Array.isArray(next.experiences) ? next.experiences.map((e: any) => ({ ...e })) : [];
                const maxLen = Math.max(base.length, blocks.length);
                const nextExperiences = [];
                for (let i = 0; i < maxLen; i += 1) {
                    const existing = base[i] ?? {};
                    const description = blocks[i] ?? '';
                    if (!description && !existing.description) continue;
                    nextExperiences.push({
                        ...existing,
                        description,
                    });
                }
                next.experiences = nextExperiences;
                next.experience = nextExperiences;
                break;
            }
            case 'additionalInfo': {
                const text = String(sectionText ?? '');
                const additionalInfo = asObject(next.additionalInfo);
                next.additionalInfo = additionalInfo ? { ...additionalInfo, text } : text;
                next.additionalInfoText = text;
                break;
            }
            default:
                break;
        }

        return next;
    }

    private static applyResumeSectionDeletion(resume: unknown, section: string): unknown {
        if (!resume || typeof resume !== 'object' || Array.isArray(resume)) {
            return resume ?? {};
        }

        const next: any = { ...(resume as any) };
        const asObject = (value: any) => (value && typeof value === 'object' && !Array.isArray(value) ? value : null);

        switch (section) {
            case 'summary': {
                next.summary = '';
                const profile = asObject(next.profile);
                if (profile) next.profile = { ...profile, summary: '' };
                break;
            }
            case 'skills': {
                next.skills = [];
                next.skillList = [];
                break;
            }
            case 'contactWays': {
                next.contactWays = [];
                next.contactWay = [];
                break;
            }
            case 'languages': {
                next.languages = [];
                break;
            }
            case 'certificates': {
                next.certificates = [];
                next.certifications = [];
                break;
            }
            case 'education': {
                next.education = [];
                break;
            }
            case 'selectedProjects': {
                next.selectedProjects = [];
                break;
            }
            case 'jobDescription': {
                const jobDescription = asObject(next.jobDescription);
                next.jobDescription = jobDescription ? { ...jobDescription, text: '' } : '';
                next.jobDescriptionText = '';
                break;
            }
            case 'experience': {
                next.experiences = [];
                next.experience = [];
                break;
            }
            case 'additionalInfo': {
                const additionalInfo = asObject(next.additionalInfo);
                next.additionalInfo = additionalInfo ? { ...additionalInfo, text: '' } : '';
                next.additionalInfoText = '';
                break;
            }
            default:
                break;
        }

        return next;
    }

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
    static async analyzeCV(
        cvText: string,
        jobDescription?: string,
        logContext?: AiLogContext
    ): Promise<CVAnalysisResult> {
        let openai: ReturnType<typeof getOpenAIClient> | null = null;
        try {
            openai = getOpenAIClient();
        } catch (e) {
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

            const result = JSON.parse(content) as CVAnalysisResult;
            logAiInteraction(logContext, 'analyzeCV', { cvText: cvText?.slice(0, 2000), jobDescription }, result);
            return result;
        } catch (error) {
            console.warn('OpenAI analyzeCV failed, using fallback CV analysis:', error);
            return ChatGPTService.fallbackAnalyzeCV(cvText);
        }
    }

    /**
     * Delete a resume section from a structured resume JSON.
     */
    static async deleteResumeSection(resume: unknown, section: string): Promise<unknown> {
        let openai: ReturnType<typeof getOpenAIClient> | null = null;
        try {
            openai = getOpenAIClient();
        } catch (e) {
            console.warn('OpenAI client unavailable, deleting section locally:', e);
            return ChatGPTService.applyResumeSectionDeletion(resume, section);
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert ATS resume editor. Always respond with valid JSON only.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.deleteResumeSection({ resume, section }),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1,
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
            console.warn('OpenAI deleteResumeSection failed, deleting section locally:', error);
            return ChatGPTService.applyResumeSectionDeletion(resume, section);
        }
    }

    /**
     * Edit a resume section in a structured resume JSON.
     */
    static async editResumeSection(
        resume: unknown,
        section: string,
        sectionText: unknown,
        logContext?: AiLogContext
    ): Promise<unknown> {
        let openai: ReturnType<typeof getOpenAIClient> | null = null;
        try {
            openai = getOpenAIClient();
        } catch (e) {
            console.warn('OpenAI client unavailable, editing section locally:', e);
            return ChatGPTService.applyResumeSectionEdit(resume, section, sectionText);
        }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert ATS resume editor. Always respond with valid JSON only.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.editResumeSection({ resume, section, sectionText }),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.1,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('No response from ChatGPT');

            try {
                const result = JSON.parse(content) as unknown;
                logAiInteraction(logContext, 'editResumeSection', { section, sectionText }, result);
                return result;
            } catch (parseError) {
                const msg = parseError instanceof Error ? parseError.message : String(parseError);
                throw new Error(`ChatGPT returned invalid JSON: ${msg}`);
            }
        } catch (error) {
            console.warn('OpenAI editResumeSection failed, editing section locally:', error);
            return ChatGPTService.applyResumeSectionEdit(resume, section, sectionText);
        }
    }

    /**
     * Improve a section of CV
     * Enhanced: Now accepts optional jobDescription for context-aware improvement
     */
    static async improveCVSection(
        section: string,
        context?: string,
        jobDescription?: string,
        logContext?: AiLogContext
    ): Promise<string> {
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

            const out = response.choices[0]?.message?.content || section;
            logAiInteraction(logContext, 'improveCVSection', { section, context, jobDescription }, out);
            return out;
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
        logContext?: AiLogContext;
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
                const result = JSON.parse(content) as unknown;
                logAiInteraction(params.logContext, 'improveStructuredResume', { resume: params.resume, mode: detectedMode, jobDescription }, result);
                return result;
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
     * Generate cover letter (STRICT JSON output)
     * Output format:
     * {
     *   companyName: string;
     *   positionTitle: string;
     *   subject: string;
     *   content: string;
     * }
     */
    static async generateCoverLetterJson(
        params: { cvData: any; jobDescription: string; companyName?: string; positionTitle?: string },
        logContext?: AiLogContext
    ): Promise<{ companyName: string; positionTitle: string; subject: string; content: string }> {
        const openai = getOpenAIClient();

        const companyNameIn = String(params.companyName ?? '').trim();
        const positionTitleIn = String(params.positionTitle ?? '').trim();
        const jobDescription = String(params.jobDescription ?? '').trim();

        const parseJsonLenient = (raw: string): any => {
            const text = String(raw ?? '').trim();
            if (!text) throw new Error('Empty response from ChatGPT');

            // 1) direct
            try {
                return JSON.parse(text);
            } catch {
                // continue
            }

            // 2) remove markdown fences if present
            const unfenced = text
                .replace(/^```(?:json)?/i, '')
                .replace(/```$/i, '')
                .trim();
            try {
                return JSON.parse(unfenced);
            } catch {
                // continue
            }

            // 3) extract the largest {...} block
            const start = unfenced.indexOf('{');
            const end = unfenced.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                const sliced = unfenced.slice(start, end + 1);
                return JSON.parse(sliced);
            }

            // rethrow a consistent error
            throw new Error('ChatGPT returned invalid JSON');
        };

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert ATS-optimized cover letter writer. Return ONLY valid JSON.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.generateCoverLetterJson({
                            cvData: params.cvData,
                            jobDescription,
                            companyName: companyNameIn,
                            positionTitle: positionTitleIn,
                        }),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.2,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('No response from ChatGPT');

            const parsed = parseJsonLenient(content) as any;
            const out = {
                companyName: String(parsed?.companyName ?? companyNameIn ?? '').trim(),
                positionTitle: String(parsed?.positionTitle ?? positionTitleIn ?? '').trim(),
                subject: String(parsed?.subject ?? '').trim(),
                content: String(parsed?.content ?? '').trim(),
            };

            if (!out.subject) {
                const parts = [
                    out.positionTitle ? `Application for ${out.positionTitle}` : 'Application',
                    out.companyName ? `- ${out.companyName}` : '',
                ].filter(Boolean);
                out.subject = parts.join(' ').trim();
            }

            if (!out.content) throw new Error('Cover letter content is empty');

            logAiInteraction(logContext, 'generateCoverLetterJson', { cvData: params.cvData, jobDescription }, out);
            return out;
        } catch (error) {
            // If JSON mode fails (rare), try a plain-text fallback.
            try {
                const text = await ChatGPTService.generateCoverLetter(params.cvData, jobDescription, logContext);
                const fallback = {
                    companyName: companyNameIn,
                    positionTitle: positionTitleIn,
                    subject: [
                        positionTitleIn ? `Application for ${positionTitleIn}` : 'Application',
                        companyNameIn ? `- ${companyNameIn}` : '',
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .trim(),
                    content: String(text ?? '').trim(),
                };
                if (fallback.content) return fallback;
            } catch {
                // ignore, rethrow below
            }

            console.error('Error generating cover letter JSON:', error);
            throw error instanceof Error ? error : new Error('Failed to generate cover letter JSON');
        }
    }

    /**
     * Generate cover letter
     */
    static async generateCoverLetter(cvData: any, jobDescription: string, logContext?: AiLogContext): Promise<string> {
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

            const out = response.choices[0]?.message?.content || '';
            logAiInteraction(logContext, 'generateCoverLetter', { cvData, jobDescription }, out);
            return out;
        } catch (error) {
            console.error('Error generating cover letter:', error);
            throw new Error('Failed to generate cover letter');
        }
    }

    /**
     * Audit user state edits (admin changes)
     */
    static async auditUserStateEdit(before: any, after: any, logContext?: AiLogContext): Promise<any> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a precise JSON-only assistant for change auditing.',
                    },
                    {
                        role: 'user',
                        content: PROMPTS.auditUserStateEdit(before, after),
                    },
                ],
                response_format: { type: 'json_object' },
                temperature: 0.2,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error('No response from ChatGPT');
            const parsed = JSON.parse(content);
            logAiInteraction(logContext, 'auditUserStateEdit', { before, after }, parsed);
            return parsed;
        } catch (error) {
            console.error('Error auditing user state edit:', error);
            throw new Error('Failed to audit user state edit');
        }
    }

    /**
     * Generate interview questions
     * Enhanced: Now accepts optional jobDescription for better context
     */
    static async generateInterviewQuestions(position: string, cvData: any, jobDescription?: string, logContext?: AiLogContext): Promise<string[]> {
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
            const questions =
                Array.isArray(parsed) ? parsed : (parsed?.questions && Array.isArray(parsed.questions) ? parsed.questions : []);
            if (!Array.isArray(parsed) && !parsed?.questions && parsed && Object.keys(parsed).length > 0) {
                console.warn('Unexpected response format from generateInterviewQuestions:', parsed);
            }
            logAiInteraction(logContext, 'generateInterviewQuestions', { position, cvData, jobDescription }, questions);
            return questions;
        } catch (error) {
            console.error('Error generating interview questions:', error);
            throw new Error('Failed to generate interview questions');
        }
    }

    /**
     * Analyze skill gap
     */
    static async analyzeSkillGap(cvData: any, jobDescription: string, logContext?: AiLogContext): Promise<SkillGapAnalysis> {
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

            const result = JSON.parse(content) as SkillGapAnalysis;
            logAiInteraction(logContext, 'analyzeSkillGap', { cvData, jobDescription }, result);
            return result;
        } catch (error) {
            console.error('Error analyzing skill gap:', error);
            throw new Error('Failed to analyze skill gap');
        }
    }

    /**
     * Chat completion for general purposes
     */
    static async chat(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, logContext?: AiLogContext): Promise<string> {
        const openai = getOpenAIClient();
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: messages as any,
                temperature: 0.7,
            });

            const out = response.choices[0]?.message?.content || '';
            logAiInteraction(logContext, 'chat', messages, out);
            return out;
        } catch (error) {
            console.error('Error in chat:', error);
            throw new Error('Failed to get chat response');
        }
    }

    /**
     * Extract text from file using ChatGPT Vision API for images or reading file content for text files
     */
    static async extractTextFromFile(file: File, logContext?: AiLogContext): Promise<string> {
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

                const out = response.choices[0]?.message?.content || '';
                logAiInteraction(logContext, 'extractTextFromFile', { fileName: file.name, fileType: file.type }, out);
                return out;
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

