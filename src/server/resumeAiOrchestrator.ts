import { SectionKey, SectionSchemas, SectionKeyType } from '@/lib/ai/outputSchemas';
import { db } from '@/lib/db';

import { getAllSectionOutputs, getOrCreateDraft, markDraftStatus, saveSectionOutput } from './resumeAiRepo';

const stableHash = (value: unknown) => {
    try {
        return Buffer.from(JSON.stringify(value ?? {})).toString('base64').slice(0, 24);
    } catch {
        return String(Date.now());
    }
};

const toArrayText = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((v) => String(v ?? '').trim()).filter(Boolean);
    if (typeof value === 'string') return value.split('\n').map((v) => v.trim()).filter(Boolean);
    return [];
};

function buildSectionOutputFromWizardData(sectionKey: SectionKeyType, wizardData: any): any {
    const w = wizardData ?? {};

    if (sectionKey === SectionKey.SUMMARY) {
        const summary =
            String(w?.summary ?? '').trim() ||
            String(w?.background?.text ?? '').trim() ||
            '';
        return SectionSchemas[SectionKey.SUMMARY].parse({ summary });
    }

    if (sectionKey === SectionKey.TECHNICAL_SKILLS) {
        const skills = toArrayText(w?.skills);
        return SectionSchemas[SectionKey.TECHNICAL_SKILLS].parse({
            technical_skills: skills.length ? [{ category: 'Skills', skills }] : [],
        });
    }

    if (sectionKey === SectionKey.PROFESSIONAL_EXPERIENCE) {
        const exps = Array.isArray(w?.experiences) ? w.experiences : [];
        const normalized = exps
            .map((e: any) => String(e?.text ?? e?.description ?? '').trim())
            .filter(Boolean)
            .map((text: string) => ({
                title: '',
                company: '',
                dates: '',
                bullets: text.split('\n').map((l) => l.trim()).filter(Boolean),
            }));
        return SectionSchemas[SectionKey.PROFESSIONAL_EXPERIENCE].parse({ professional_experience: normalized });
    }

    if (sectionKey === SectionKey.EDUCATION) {
        const edus = Array.isArray(w?.education) ? w.education : [];
        const normalized = edus
            .map((e: any) => String(e?.text ?? '').trim())
            .filter(Boolean)
            .map((text: string) => {
                const firstLine = text.split('\n')[0] ?? text;
                const parts = firstLine.split(/[-–—]|at|from/i);
                return {
                    degree: (parts[0] ?? firstLine).trim(),
                    institution: (parts[1] ?? '').trim(),
                    details: text.split('\n').slice(1).map((l) => l.trim()).filter(Boolean),
                };
            });
        return SectionSchemas[SectionKey.EDUCATION].parse({ education: normalized });
    }

    if (sectionKey === SectionKey.CERTIFICATIONS) {
        const certs = Array.isArray(w?.certificates) ? w.certificates : [];
        const normalized = certs
            .map((c: any) => String(c?.text ?? c?.title ?? c ?? '').trim())
            .filter(Boolean)
            .map((title: string) => ({ title, issuer: '' }));
        return SectionSchemas[SectionKey.CERTIFICATIONS].parse({ certifications: normalized });
    }

    if (sectionKey === SectionKey.SELECTED_PROJECTS) {
        const projs = Array.isArray(w?.selectedProjects) ? w.selectedProjects : [];
        const normalized = projs
            .map((p: any) => String(p?.text ?? '').trim())
            .filter(Boolean)
            .map((text: string) => {
                const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
                return {
                    name: lines[0] ?? '',
                    summary: lines[1] ?? '',
                    tech: [],
                    bullets: lines.slice(2),
                };
            });
        return SectionSchemas[SectionKey.SELECTED_PROJECTS].parse({ selected_projects: normalized });
    }

    if (sectionKey === SectionKey.LANGUAGES) {
        const langs = Array.isArray(w?.languages) ? w.languages : [];
        const normalized = langs
            .map((l: any) => ({
                language: String(l?.language ?? l?.name ?? '').trim(),
                level: String(l?.level ?? '').trim(),
            }))
            .filter((l: any) => l.language);
        return SectionSchemas[SectionKey.LANGUAGES].parse({ languages: normalized });
    }

    if (sectionKey === SectionKey.ADDITIONAL_INFO) {
        const contactWays = toArrayText(w?.contactWay);
        const contact = contactWays.map((value) => ({ type: 'contact', value }));
        return SectionSchemas[SectionKey.ADDITIONAL_INFO].parse({
            additional_information: {
                visa_status: String(w?.visaStatus ?? '').trim() || undefined,
                location: String(w?.location ?? '').trim() || undefined,
                work_preference: String(w?.workPreference ?? '').trim() || undefined,
                contact,
                notes: toArrayText(w?.additionalInfo?.text ?? w?.additionalInfo),
            },
        });
    }


    throw new Error('Unsupported sectionKey');
}

export async function generateSectionFromWizardData(params: {
    userId: string;
    requestId: string;
    wizardData: any;
    sectionKey: SectionKeyType;
    force?: boolean;
    generationMode?: 'default' | 'shorter' | 'longer' | 'formal' | 'creative';
    userOverrides?: Record<string, any>;
}) {
    const { userId, requestId, wizardData, sectionKey } = params;
    const draftId = await getOrCreateDraft(userId, requestId);
    const output = buildSectionOutputFromWizardData(sectionKey, wizardData);
    const inputHash = stableHash({ sectionKey, wizardData });

    await saveSectionOutput({
        draftId,
        sectionKey,
        outputJson: output,
        model: 'local',
        inputHash,
        generationMode: params.generationMode ?? 'default',
        userOverrideJson: params.userOverrides?.[sectionKey] ?? undefined,
    });

    return output;
}

export async function generateAllSectionsFromWizardData(params: {
    userId: string;
    requestId: string;
    wizardData: any;
    force?: boolean;
    generationMode?: 'default' | 'shorter' | 'longer' | 'formal' | 'creative';
    userOverrides?: Record<string, any>;
}) {
    const { userId, requestId } = params;
    const draftId = await getOrCreateDraft(userId, requestId);
    await markDraftStatus({ draftId, status: 'generating' });

    const results: Record<string, any> = {};
    const order: SectionKeyType[] = [
        SectionKey.SUMMARY,
        SectionKey.TECHNICAL_SKILLS,
        SectionKey.PROFESSIONAL_EXPERIENCE,
        SectionKey.EDUCATION,
        SectionKey.CERTIFICATIONS,
        SectionKey.SELECTED_PROJECTS,
        SectionKey.LANGUAGES,
        SectionKey.ADDITIONAL_INFO,
    ];

    for (const key of order) {
        results[key] = await generateSectionFromWizardData({
            userId,
            requestId,
            wizardData: params.wizardData,
            sectionKey: key,
            generationMode: params.generationMode,
            userOverrides: params.userOverrides,
        });
    }

    await markDraftStatus({ draftId, status: 'ready' });
    return results;
}

export async function regenerateAllSectionsWithOverrides(params: {
    userId: string;
    requestId: string;
    wizardData: any;
    userOverrides: Record<string, any>;
    generationMode?: 'default' | 'shorter' | 'longer' | 'formal' | 'creative';
}) {
    return generateAllSectionsFromWizardData({
        userId: params.userId,
        requestId: params.requestId,
        wizardData: params.wizardData,
        force: true,
        generationMode: params.generationMode,
        userOverrides: params.userOverrides,
    });
}

// Backwards-compatible exports referenced by routes
export async function generateSection(params: {
    userId: string;
    requestId: string;
    sectionKey: SectionKeyType;
    force?: boolean;
}) {
    // Pull wizard data from DB if available (same as root route expectation)
    const wizardRow = db.wizardData.findByUserIdAndRequestId(parseInt(params.userId, 10), params.requestId);
    let wizardData: any = {};
    if (wizardRow?.data) {
        try {
            wizardData = typeof wizardRow.data === 'string' ? JSON.parse(wizardRow.data) : wizardRow.data;
        } catch {
            wizardData = {};
        }
    }
    return generateSectionFromWizardData({
        userId: params.userId,
        requestId: params.requestId,
        wizardData,
        sectionKey: params.sectionKey,
        force: params.force,
    });
}

export async function generateAllSections(params: { userId: string; requestId: string; force?: boolean }) {
    const wizardRow = db.wizardData.findByUserIdAndRequestId(parseInt(params.userId, 10), params.requestId);
    let wizardData: any = {};
    if (wizardRow?.data) {
        try {
            wizardData = typeof wizardRow.data === 'string' ? JSON.parse(wizardRow.data) : wizardRow.data;
        } catch {
            wizardData = {};
        }
    }
    return generateAllSectionsFromWizardData({
        userId: params.userId,
        requestId: params.requestId,
        wizardData,
        force: params.force,
    });
}

export async function getGeneratedSections(userId: string, requestId: string): Promise<Record<string, any> | null> {
    const draft = db.resumeDrafts.findByRequestId(requestId);
    if (!draft) return null;
    if (String(draft.user_id) !== String(userId)) return null;
    return await getAllSectionOutputs(draft.id);
}

