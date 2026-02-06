import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { ChatGPTService } from '@/services/chatgpt/service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserId(request: NextRequest): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.userId?.toString() ?? null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { section, context, isFinalStep, resume, mode } = await request.json();
        const userId = await getUserId(request);
        const logContext = userId ? { userId, endpoint: '/api/cv/improve', action: 'improve' } : undefined;

        const normalizeStructuredResume = (value: any) => {
            const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
            const toStringArray = (input: any): string[] => {
                if (Array.isArray(input)) {
                    return input.map((v) => String(v ?? '').trim()).filter(Boolean);
                }
                if (typeof input === 'string') {
                    return input
                        .split(/\r?\n|[,;]+/)
                        .map((v) => v.trim())
                        .filter(Boolean);
                }
                return [];
            };
            const toBlocks = (input: any): string[] => {
                if (Array.isArray(input)) {
                    return input.map((v) => String(v ?? '').trim()).filter(Boolean);
                }
                if (typeof input === 'string') {
                    return input
                        .split(/\n\s*\n+/)
                        .map((b) => b.trim())
                        .filter(Boolean);
                }
                return [];
            };
            const toCertificationArray = (input: any) => {
                if (Array.isArray(input)) return input;
                const blocks = toBlocks(input);
                if (!blocks.length) return [];
                return blocks.map((text) => ({ title: text, issuer: '', issue_date: '' }));
            };
            const toLanguageArray = (input: any) => {
                if (Array.isArray(input)) return input;
                const lines = toStringArray(input);
                if (!lines.length) return [];
                return lines.map((line) => {
                    const parts = line.split(/\s*[-–—|]\s*/);
                    return { language: parts[0] ?? '', level: parts.slice(1).join(' ') ?? '' };
                });
            };
            return {
                personalInfo: {
                    name: String(safe.personalInfo?.name ?? safe.personalInfo?.fullName ?? ''),
                    email: String(safe.personalInfo?.email ?? ''),
                    phone: String(safe.personalInfo?.phone ?? ''),
                    location: String(safe.personalInfo?.location ?? ''),
                },
                summary: String(safe.summary ?? ''),
                technicalSkills: Array.isArray(safe.technicalSkills)
                    ? safe.technicalSkills
                    : toStringArray(safe.technicalSkills),
                professionalExperience: Array.isArray(safe.professionalExperience) ? safe.professionalExperience : [],
                education: Array.isArray(safe.education) ? safe.education : [],
                certifications: toCertificationArray(safe.certifications ?? safe.certificates),
                selectedProjects: Array.isArray(safe.selectedProjects) ? safe.selectedProjects : [],
                languages: toLanguageArray(safe.languages),
                additionalInfo:
                    safe.additionalInfo && typeof safe.additionalInfo === 'object' && !Array.isArray(safe.additionalInfo)
                        ? { notes: Array.isArray(safe.additionalInfo.notes) ? safe.additionalInfo.notes : [] }
                        : { notes: [] },
            };
        };

        if (resume && typeof resume === 'object') {
            if (!isFinalStep) {
                return NextResponse.json({
                    originalResume: resume,
                    improvedResume: resume,
                    message: 'Improvement will be available in final step',
                });
            }

            const resumeObject = resume as Record<string, unknown>;
            const isAnalysisMode = mode === 'analysis' || (mode !== 'sections_text' && 'personalInfo' in resumeObject);

            const resumeAny = resumeObject as any;
            const jobDescriptionText = String(
                resumeAny.jobDescription?.text ?? resumeAny.jobDescriptionText ?? resumeAny.jobDescription ?? ''
            ).trim();

            const structuredInput = !isAnalysisMode
                ? {
                      personalInfo: resumeAny.personalInfo ?? resumeAny.profile ?? {},
                      summary: resumeAny.summary ?? '',
                      technicalSkills: resumeAny.technicalSkills ?? resumeAny.skills ?? [],
                      professionalExperience: resumeAny.professionalExperience ?? resumeAny.experience ?? [],
                      education: resumeAny.education ?? [],
                      certifications: resumeAny.certifications ?? resumeAny.certificates ?? [],
                      selectedProjects: resumeAny.selectedProjects ?? [],
                      languages: resumeAny.languages ?? [],
                      additionalInfo: resumeAny.additionalInfo ?? {},
                  }
                : undefined;

            const improvedResume = await ChatGPTService.improveStructuredResume({
                resume,
                mode: isAnalysisMode ? mode : 'sections_text',
                jobDescription: jobDescriptionText || undefined,
                structuredInput,
                logContext,
            });

            const normalizedImproved = normalizeStructuredResume(improvedResume);

            return NextResponse.json({
                originalResume: resume,
                improvedResume: normalizedImproved,
            });
        }

        if (!section) {
            return NextResponse.json({ error: 'Section text is required' }, { status: 400 });
        }

        if (!isFinalStep) {
            return NextResponse.json({
                original: section,
                improved: section,
                message: 'Improvement will be available in final step',
            });
        }

        const improved = await ChatGPTService.improveCVSection(section, context, undefined, logContext);

        return NextResponse.json({
            original: section,
            improved,
        });
    } catch (error: any) {
        console.error('Error improving CV section:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to improve CV section' },
            { status: 500 }
        );
    }
}
