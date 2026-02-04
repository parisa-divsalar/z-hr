'use client';

import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { editCV } from '@/services/cv/edit-cv';
import { deleteResumeSection } from '@/services/cv/delete-section';
import { getCV } from '@/services/cv/get-cv';
import { getImproved } from '@/services/cv/get-improved';
import { postImproved } from '@/services/cv/post-improved';
import { improveResume } from '@/services/cv/improve-resume';
import { useAuthStore } from '@/store/auth';
import { buildWizardSerializable, useWizardStore } from '@/store/wizard';
import { exportElementToPdf } from '@/utils/exportToPdf';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';
import { loadWizardTextOnlySession, saveWizardTextOnlySession } from '@/utils/wizardTextOnlySession';

import {
    buildHeadline,
    extractFromHeadline,
    loadWizardProfileSession,
    normalizeVisaStatusValue,
    saveWizardProfileSession,
} from '../profileSession';
import { extractImprovedText, extractPollingRequestId, pollCvAnalysisAndCreateCv } from '../services';
import {
    applyEducationEditText,
    applyCertificateEditText,
    applyExperienceEditText,
    applyLanguagesEditText,
    applyLineListEditText,
    applyPhoneEmailToContactWays,
    applyProfileEditText,
    applySelectedProjectsEditText,
    buildUpdatedCvPayload,
    cleanSummaryText,
    createEmptyProfile,
    ensureMinimumExperiences,
    extractAdditionalInfoText,
    extractCertificateEntries,
    extractContactWays,
    extractEducationEntries,
    extractEmailAndPhone,
    extractExperienceEntries,
    extractLanguages,
    extractSelectedProjectEntries,
    extractSkills,
    extractSummary,
    formatEducationEditText,
    formatCertificateEditText,
    formatExperienceEditText,
    formatLanguagesEditText,
    formatLineListEditText,
    formatProfileEditText,
    formatSelectedProjectsEditText,
    normalizeCertificates,
    normalizeEducationEntries,
    normalizeExperiences,
    normalizeLanguages,
    normalizeSelectedProjects,
    resolveCvPayload,
    resolveCvRecord,
} from '../utils';

import type { ImproveOption, ResumeExperience, ResumeLanguage, ResumeProfile, SectionKey } from '../types';

const ALL_SECTION_KEYS: SectionKey[] = [
    'summary',
    'skills',
    'contactWays',
    'education',
    'languages',
    'certificates',
    'selectedProjects',
    'experience',
    'additionalInfo',
];

function parseHiddenSections(value: unknown): SectionKey[] {
    if (!Array.isArray(value)) return [];
    const set = new Set<SectionKey>();
    for (const item of value) {
        if (typeof item !== 'string') continue;
        if ((ALL_SECTION_KEYS as unknown as string[]).includes(item)) {
            set.add(item as SectionKey);
        }
    }
    return Array.from(set);
}

const IMPROVE_OPTION_CONTEXT: Record<ImproveOption, string> = {
    shorter: 'Make the text shorter and more concise while keeping the meaning.',
    longer: 'Make the text longer with more detail, without adding false information.',
    creative: 'Make the text more creative and engaging while keeping it professional.',
    formal: 'Make the text more formal, polished, and professional.',
};

export type ResumeEditorMode = 'editor' | 'preview';

export type ResumeEditorController = {
    isPreview: boolean;
    pdfRef: MutableRefObject<HTMLDivElement | null>;
    isExporting: boolean;

    profile: ResumeProfile;
    setProfile: Dispatch<SetStateAction<ResumeProfile>>;
    resolvedVisaStatus: string;
    resolvedMainSkill: string;
    resolvedPhone: string;
    resolvedEmail: string;

    summary: string;
    setSummary: Dispatch<SetStateAction<string>>;
    skills: string[];
    setSkills: Dispatch<SetStateAction<string[]>>;
    contactWays: string[];
    setContactWays: Dispatch<SetStateAction<string[]>>;
    education: string[];
    setEducation: Dispatch<SetStateAction<string[]>>;
    languages: ResumeLanguage[];
    setLanguages: Dispatch<SetStateAction<ResumeLanguage[]>>;
    certificates: string[];
    setCertificates: Dispatch<SetStateAction<string[]>>;
    selectedProjects: string[];
    setSelectedProjects: Dispatch<SetStateAction<string[]>>;
    additionalInfo: string;
    setAdditionalInfo: Dispatch<SetStateAction<string>>;
    experiences: ResumeExperience[];
    setExperiences: Dispatch<SetStateAction<ResumeExperience[]>>;


    profileEditText: string;
    setProfileEditText: Dispatch<SetStateAction<string>>;
    contactWaysEditText: string;
    setContactWaysEditText: Dispatch<SetStateAction<string>>;
    educationEditText: string;
    setEducationEditText: Dispatch<SetStateAction<string>>;
    languagesEditText: string;
    setLanguagesEditText: Dispatch<SetStateAction<string>>;
    certificatesEditText: string;
    setCertificatesEditText: Dispatch<SetStateAction<string>>;
    selectedProjectsEditText: string;
    setSelectedProjectsEditText: Dispatch<SetStateAction<string>>;
    additionalInfoEditText: string;
    setAdditionalInfoEditText: Dispatch<SetStateAction<string>>;
    experienceEditText: string;
    setExperienceEditText: Dispatch<SetStateAction<string>>;

    editingSection: string | null;
    improvingSection: string | null;
    isTextOnlyMode: boolean;
    isAutoPipelineMode: boolean;
    isPreCvLoading: boolean;
    shouldBlockBelowSummary: boolean;
    shouldSkeletonSection: (section: SectionKey) => boolean;
    shouldSkeletonActions: (section: SectionKey) => boolean;

    isCvLoading: boolean;
    cvError: string | null;
    isSaving: boolean;
    saveError: string | null;
    improveError: string | null;
    downloadError: string | null;
    clearSaveError: () => void;
    clearImproveError: () => void;
    clearDownloadError: () => void;

    isDownloading: boolean;
    downloadProgress: number;

    handleEdit: (section: string) => void;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    handleImprove: (section: string, option?: ImproveOption) => Promise<void>;
    handleDownloadPdf: () => Promise<void>;
    handleSkillsChange: (index: number, value: string) => void;
    requestDeleteSection: (section: SectionKey) => void;
    confirmDeleteSection: () => Promise<void>;
    cancelDeleteSection: () => void;
    pendingDeleteSection: SectionKey | null;
    isDeletingSection: boolean;
    isSectionHidden: (section: SectionKey) => boolean;

    autoImproved: Record<string, boolean>;
};

type Args = {
    mode?: ResumeEditorMode;
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    /**
     * Override the userId used for API calls (get-cv/edit-cv/post-improved/...).
     * Useful for admin tooling where we want to edit a specific user's resume
     * without using the logged-in session token.
     */
    apiUserId?: string | null;
    /**
     * Override the requestId used for loading/saving the CV.
     * Typically you should also set the wizard store requestId, but this makes
     * standalone pages easier.
     */
    requestIdOverride?: string | null;
    /**
     * In normal wizard flow we poll analysis/create and then load CV.
     * For admin/open-existing-resume flows we want to skip that and just load CV.
     */
    disableAutoPoll?: boolean;
};

export function useResumeEditorController(args: Args): ResumeEditorController {
    const { mode = 'editor', pdfTargetRef } = args;
    const isPreview = mode === 'preview';

    const [editingSection, setEditingSection] = useState<string | null>(null);
    const wizardData = useWizardStore((state) => state.data);
    const updateWizardField = useWizardStore((state) => state.updateField);
    const requestIdFromStore = useWizardStore((state) => state.requestId);
    const setRequestId = useWizardStore((state) => state.setRequestId);
    const accessTokenFromStore = useAuthStore((state) => state.accessToken);

    const requestId = args.requestIdOverride ?? requestIdFromStore;
    const apiUserId = args.apiUserId ?? null;
    /**
     * Identity key used only for client-side de-duping keys/logging.
     *
     * IMPORTANT:
     * - In normal user flows we rely on auth cookie; `accessTokenFromStore` is a JWT, NOT a userId.
     * - In admin flows we pass `apiUserId` to query a specific user's resume in the DB.
     */
    const identityKey = apiUserId ?? accessTokenFromStore ?? 'cookie';

    const canFetchCv = Boolean(requestId);

    const [isTextOnlyMode, setIsTextOnlyMode] = useState(false);
    const [sessionSeededRunKey, setSessionSeededRunKey] = useState<string | null>(null);
    const lastSessionSeedKeyRef = useRef<string | null>(null);

    const [autoImproveIndex, setAutoImproveIndex] = useState<number>(-1);
    const [autoImprovePhase, setAutoImprovePhase] = useState<'idle' | 'request' | 'typing' | 'done'>('idle');
    const [autoImproved, setAutoImproved] = useState<Record<string, boolean>>({});
    const autoImproveRunKeyRef = useRef<string | null>(null);

    /**
     * Once the user manually saves edits to the CV (i.e. we call `edit-cv` from the editor),
     * we should NOT auto-run the improve pipeline again. Improve should be manual from then on.
     *
     * This is intentionally per-requestId: if the request context changes, auto-improve can run again.
     */
    const manualEditSavedRequestIdRef = useRef<string | null>(null);

    const textOnlyBackupRef = useRef<Record<string, any>>({});

    const internalPdfRef = useRef<HTMLDivElement | null>(null);
    const pdfRef = pdfTargetRef ?? internalPdfRef;

    const cvPayloadRef = useRef<any>(null);
    const [cvLoadedApiKey, setCvLoadedApiKey] = useState<string | null>(null);
    const [cvLoadedRunKey, setCvLoadedRunKey] = useState<string | null>(null);
    const lastAutoFetchKeyRef = useRef<string | null>(null);

    const [profile, setProfile] = useState<ResumeProfile>(createEmptyProfile());
    const [profileEditText, setProfileEditText] = useState('');

    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [contactWays, setContactWays] = useState<string[]>([]);
    const [contactWaysEditText, setContactWaysEditText] = useState('');
    const [education, setEducation] = useState<string[]>([]);
    const [educationEditText, setEducationEditText] = useState('');
    const [languages, setLanguages] = useState<ResumeLanguage[]>([]);
    const [languagesEditText, setLanguagesEditText] = useState('');
    const [certificates, setCertificates] = useState<string[]>([]);
    const [certificatesEditText, setCertificatesEditText] = useState('');
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [selectedProjectsEditText, setSelectedProjectsEditText] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [additionalInfoEditText, setAdditionalInfoEditText] = useState('');
    const [experiences, setExperiences] = useState<ResumeExperience[]>([]);
    const [experienceEditText, setExperienceEditText] = useState('');

    const [isCvLoading, setIsCvLoading] = useState(false);
    const [hasCvLoadedOnce, setHasCvLoadedOnce] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [isDownloading, setIsDownloading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    const [improvingSection, setImprovingSection] = useState<string | null>(null);
    const [improveError, setImproveError] = useState<string | null>(null);
    const [pendingDeleteSection, setPendingDeleteSection] = useState<SectionKey | null>(null);
    const [isDeletingSection, setIsDeletingSection] = useState(false);

    const hiddenSectionsStorageKey = useMemo(() => {
        return `resumeEditor:hiddenSections:v1:${identityKey}:${requestId ?? 'text-only'}`;
    }, [identityKey, requestId]);

    const [hiddenSections, setHiddenSections] = useState<SectionKey[]>(() => {
        try {
            if (typeof window === 'undefined') return [];
            const raw = sessionStorage.getItem(hiddenSectionsStorageKey);
            if (!raw) return [];
            return parseHiddenSections(JSON.parse(raw));
        } catch {
            return [];
        }
    });

    // Keep hidden sections in sync when request context changes (e.g. requestId hydrated async).
    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            const raw = sessionStorage.getItem(hiddenSectionsStorageKey);
            if (!raw) {
                setHiddenSections([]);
                return;
            }
            setHiddenSections(parseHiddenSections(JSON.parse(raw)));
        } catch {
            setHiddenSections([]);
        }
    }, [hiddenSectionsStorageKey]);

    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            sessionStorage.setItem(hiddenSectionsStorageKey, JSON.stringify(hiddenSections));
        } catch {
            // ignore
        }
    }, [hiddenSections, hiddenSectionsStorageKey]);

    const isSectionHidden = useCallback(
        (section: SectionKey) => {
            return hiddenSections.includes(section);
        },
        [hiddenSections],
    );

    const hideSection = useCallback((section: SectionKey) => {
        setHiddenSections((prev) => (prev.includes(section) ? prev : [...prev, section]));
    }, []);

    const isFileFlowMode = canFetchCv && !isTextOnlyMode;
    const isAutoPipelineMode = isTextOnlyMode || isFileFlowMode;
    const isSessionSeeded = Boolean(sessionSeededRunKey);
    const isPreCvLoading = isFileFlowMode && !hasCvLoadedOnce && !isSessionSeeded;

    const headlineExtract = useMemo(() => extractFromHeadline(profile?.headline), [profile?.headline]);

    const resolvedVisaStatus = useMemo(() => {
        const textOnly = loadWizardTextOnlySession() as any;
        const textOnlyUpdatedAt = Number(textOnly?.__updatedAt ?? 0) || 0;
        const textOnlyVisa = normalizeVisaStatusValue(textOnly?.visaStatus);

        const profileSession = loadWizardProfileSession() as any;
        const profileUpdatedAt = Number(profileSession?.updatedAt ?? 0) || 0;
        const profileVisa = normalizeVisaStatusValue(profileSession?.visaStatus);

        if (textOnlyVisa || profileVisa) {
            if (profileUpdatedAt > textOnlyUpdatedAt) return profileVisa;
            if (textOnlyUpdatedAt > profileUpdatedAt) return textOnlyVisa;
            return profileVisa || textOnlyVisa;
        }

        const fromWizard = normalizeVisaStatusValue((wizardData as any)?.visaStatus);
        if (fromWizard) return fromWizard;

        return headlineExtract.visaStatus;
    }, [wizardData, sessionSeededRunKey, headlineExtract.visaStatus]);

    const resolvedMainSkill = useMemo(() => {
        const fromWizard = String((wizardData as any)?.mainSkill ?? '').trim();
        if (fromWizard) return fromWizard;

        const session = loadWizardTextOnlySession();
        const fromSession = String((session as any)?.mainSkill ?? '').trim();
        if (fromSession) return fromSession;

        const fromProfileSession = String(loadWizardProfileSession()?.mainSkill ?? '').trim();
        if (fromProfileSession) return fromProfileSession;

        return headlineExtract.mainSkill;
    }, [wizardData, sessionSeededRunKey, headlineExtract.mainSkill]);

    const { phone: resolvedPhone, email: resolvedEmail } = useMemo(
        () => extractEmailAndPhone(contactWays),
        [contactWays],
    );

    const AUTO_IMPROVE_ORDER = useMemo<SectionKey[]>(
        () => ['summary', 'skills', 'experience', 'education', 'certificates', 'selectedProjects', 'languages', 'additionalInfo'],
        [],
    );
    const shouldBlockBelowSummary = isAutoPipelineMode && !Boolean(autoImproved.summary) && !Boolean(improveError);

    /**
     * Persist the current editor state into the CV record (`data/cvs.json` via `/api/cv/edit-cv`).
     * This is critical for admin DB view: the admin panel reads `cvs` from the server DB and
     * expects improved content to be stored, not only shown in UI state.
     */
    const isAutoPersistingRef = useRef(false);
    const lastAutoPersistKeyRef = useRef<string | null>(null);

    const buildPayloadFromValues = useCallback(
        (values: {
            profile: ResumeProfile;
            summary: string;
            skills: string[];
            contactWays: string[];
            education: string[];
            languages: ResumeLanguage[];
            certificates: string[];
            selectedProjects: string[];
            additionalInfo: string;
            experiences: ResumeExperience[];
        }) => {
            return buildUpdatedCvPayload(cvPayloadRef.current, values);
        },
        [],
    );

    const buildPayloadFromState = useCallback(() => {
        const normalizedSkills = skills.map((s) => String(s ?? '').trim()).filter(Boolean);
        const normalizedContactWays = contactWays.map((c) => String(c ?? '').trim()).filter(Boolean);
        return buildPayloadFromValues({
            profile,
            summary,
            skills: normalizedSkills,
            contactWays: normalizedContactWays,
            education,
            languages,
            certificates,
            selectedProjects,
            additionalInfo,
            experiences,
        });
    }, [
        additionalInfo,
        buildPayloadFromValues,
        certificates,
        contactWays,
        education,
        experiences,
        languages,
        profile,
        selectedProjects,
        skills,
        summary,
    ]);

    const autoPersistCv = useCallback(
        async (payload: any, persistKey: string) => {
            if (!requestId) return;
            if (isAutoPersistingRef.current) return;
            if (lastAutoPersistKeyRef.current === persistKey) return;

            isAutoPersistingRef.current = true;
            try {
                await editCV({
                    userId: apiUserId ?? undefined,
                    requestId,
                    bodyOfResume: payload,
                });
                // Keep base ref in sync so future merges are stable.
                cvPayloadRef.current = payload;
                lastAutoPersistKeyRef.current = persistKey;
            } catch {
                // best-effort; do not block editor flow or spam errors
            } finally {
                isAutoPersistingRef.current = false;
            }
        },
        [apiUserId, requestId],
    );

    const persistTextOnlySession = useCallback(
        (mutate: (draft: any) => void) => {
            try {
                if (typeof window === 'undefined') return;
                const base = (loadWizardTextOnlySession() ?? buildWizardSerializable(wizardData)) as any;
                const next = { ...(base ?? {}) } as any;
                mutate(next);
                saveWizardTextOnlySession(next);
            } catch {
                // ignore storage errors
            }
        },
        [wizardData],
    );

    const shouldSkeletonSection = (section: SectionKey) => {
        if (!isAutoPipelineMode) return false;
        if (AUTO_IMPROVE_ORDER.indexOf(section) < 0) return false;

        if (isPreCvLoading) return true;
        if (autoImprovePhase === 'done') return false;

        const idx = AUTO_IMPROVE_ORDER.indexOf(section);
        if (idx < 0) return false;

        if (autoImproveIndex < 0) return true;
        if (idx > autoImproveIndex) return true;

        if (idx === autoImproveIndex) {
            return autoImprovePhase === 'idle' || autoImprovePhase === 'request';
        }

        return false;
    };

    const shouldSkeletonActions = (section: SectionKey) => {
        if (!isAutoPipelineMode) return false;
        if (AUTO_IMPROVE_ORDER.indexOf(section) < 0) return false;
        if (isPreCvLoading) return true;
        if (autoImprovePhase === 'done') return false;
        return !autoImproved[section];
    };

    useEffect(() => {
        if (!isFileFlowMode) return;
        if (hasCvLoadedOnce) return;
        if (isSessionSeeded) return;

        const wizardProfile = {
            fullName: String((wizardData as any)?.fullName ?? '').trim(),
            dateOfBirth: String((wizardData as any)?.dateOfBirth ?? '').trim(),
            visaStatus: String((wizardData as any)?.visaStatus ?? '').trim(),
            mainSkill: String((wizardData as any)?.mainSkill ?? '').trim(),
        };

        const hasWizardProfile = Object.values(wizardProfile).some((v) => String(v ?? '').trim().length > 0);
        const fromSession = loadWizardProfileSession();
        const src = hasWizardProfile ? wizardProfile : (fromSession ?? wizardProfile);

        setProfile({
            fullName: String(src?.fullName ?? '').trim(),
            dateOfBirth: String(src?.dateOfBirth ?? '').trim(),
            headline: buildHeadline(src?.mainSkill, src?.visaStatus),
        });
    }, [isFileFlowMode, hasCvLoadedOnce, wizardData, isSessionSeeded]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const payload = {
            fullName: String((wizardData as any)?.fullName ?? '').trim(),
            dateOfBirth: String((wizardData as any)?.dateOfBirth ?? '').trim(),
            visaStatus: String((wizardData as any)?.visaStatus ?? '').trim(),
            mainSkill: String((wizardData as any)?.mainSkill ?? '').trim(),
        };
        if (!Object.values(payload).some((v) => String(v ?? '').trim().length > 0)) return;
        saveWizardProfileSession(payload);
    }, [wizardData]);

    useEffect(() => {
        const session = loadWizardTextOnlySession();
        if (!session) {
            setSessionSeededRunKey(null);
            lastSessionSeedKeyRef.current = null;
            if (!canFetchCv) setIsTextOnlyMode(false);
            return;
        }

        setIsTextOnlyMode(!canFetchCv);

        const seedKey = canFetchCv ? `api:${identityKey}:${requestId ?? ''}` : 'text-only';
        if (lastSessionSeedKeyRef.current === seedKey) return;
        lastSessionSeedKeyRef.current = seedKey;
        setSessionSeededRunKey(`${seedKey}:${Date.now()}`);

        setProfile({
            fullName: String((session as any).fullName ?? '').trim(),
            dateOfBirth: String((session as any).dateOfBirth ?? '').trim(),
            headline: buildHeadline((session as any).mainSkill, (session as any).visaStatus),
        });

        const sanitizedSessionSummary = cleanSummaryText(String((session as any).background?.text ?? '').trim());
        setSummary(sanitizedSessionSummary);
        setSkills(
            Array.isArray((session as any).skills)
                ? (session as any).skills.map((s: any) => String(s ?? '').trim()).filter(Boolean)
                : [],
        );
        setContactWays(
            Array.isArray((session as any).contactWay)
                ? (session as any).contactWay.map((c: any) => String(c ?? '').trim()).filter(Boolean)
                : [],
        );
        setLanguages(
            Array.isArray((session as any).languages)
                ? normalizeLanguages((session as any).languages as any[])
                : typeof (session as any).languages === 'string'
                  ? normalizeLanguages(applyLineListEditText((session as any).languages))
                  : [],
        );
        setEducation(() => {
            const raw = extractEducationEntries(session);
            const normalized = normalizeEducationEntries(raw);
            if (normalized.length) return normalized;
            if (typeof (session as any).education === 'string') {
                return applyEducationEditText((session as any).education);
            }
            return [];
        });
        setCertificates(
            Array.isArray((session as any).certificates)
                ? (session as any).certificates
                      .map((entry: any) =>
                          typeof entry === 'string' ? entry : (entry?.text ?? entry?.title ?? entry?.name),
                      )
                      .map((v: any) => String(v ?? '').trim())
                      .filter(Boolean)
                : [],
        );
        setSelectedProjects(() => {
            const raw = extractSelectedProjectEntries(session);
            const normalized = normalizeSelectedProjects(raw);
            if (normalized.length) return normalized;
            if (typeof (session as any).selectedProjects === 'string') {
                return applySelectedProjectsEditText((session as any).selectedProjects);
            }
            return [];
        });
        setAdditionalInfo(String((session as any).additionalInfo?.text ?? '').trim());

        const sessionExperiencesRaw = extractExperienceEntries(session);
        setExperiences(ensureMinimumExperiences(normalizeExperiences(sessionExperiencesRaw)));

        setProfileEditText(formatProfileEditText(createEmptyProfile()));
        setContactWaysEditText('');
        setEducationEditText('');
        setLanguagesEditText('');
        setCertificatesEditText('');
        setSelectedProjectsEditText('');
        setAdditionalInfoEditText('');
        setExperienceEditText('');
        setCvError(null);

        if (!canFetchCv) setHasCvLoadedOnce(true);
    }, [canFetchCv, identityKey, requestId]);


    // When request context changes, require a fresh get-cv load before auto-improve can run.
    useEffect(() => {
        setCvLoadedApiKey(null);
        setCvLoadedRunKey(null);
    }, [identityKey, requestId]);

    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const typewriterWords = async (finalText: string, onUpdate: (partial: string) => void) => {
        const normalized = String(finalText ?? '');
        const tokens = normalized.split(/(\s+)/); // keep whitespace tokens
        let acc = '';
        for (const token of tokens) {
            acc += token;
            onUpdate(acc);
            await sleep(/\s+/.test(token) ? 10 : 28);
        }
    };

    const formatBulletBlock = (header: string, bullets: string[]) => {
        const cleanHeader = String(header ?? '').trim();
        const cleanBullets = Array.isArray(bullets)
            ? bullets.map((b) => String(b ?? '').trim()).filter(Boolean)
            : [];
        const lines = [
            ...(cleanHeader ? [cleanHeader] : []),
            ...cleanBullets.map((b) => `- ${b}`),
        ];
        return lines.join('\n').trim();
    };

    const formatExperienceText = (items: any[]): string => {
        if (!Array.isArray(items)) return '';
        return items
            .map((entry) => {
                const title = String(entry?.title ?? entry?.position ?? '').trim();
                const company = String(entry?.company ?? entry?.organization ?? '').trim();
                const dates = String(entry?.dates ?? entry?.duration ?? '').trim();
                const header = [title, company, dates].filter(Boolean).join(' | ');
                return formatBulletBlock(header, Array.isArray(entry?.bullets) ? entry.bullets : []);
            })
            .filter(Boolean)
            .join('\n\n');
    };

    const formatEducationText = (items: any[]): string => {
        if (!Array.isArray(items)) return '';
        return items
            .map((entry) => {
                const degree = String(entry?.degree ?? '').trim();
                const institution = String(entry?.institution ?? entry?.school ?? '').trim();
                const location = String(entry?.location ?? '').trim();
                const dates = String(entry?.dates ?? '').trim();
                const header = [degree, institution].filter(Boolean).join(' - ');
                const meta = [location, dates].filter(Boolean).join(' | ');
                const details = Array.isArray(entry?.details)
                    ? entry.details.map((d: any) => String(d ?? '').trim()).filter(Boolean)
                    : [];
                return [header, meta, ...details].filter(Boolean).join('\n').trim();
            })
            .filter(Boolean)
            .join('\n\n');
    };

    const formatCertificatesText = (items: any[]): string => {
        if (!Array.isArray(items)) return '';
        return items
            .map((entry) => {
                const title = String(entry?.title ?? '').trim();
                const issuer = String(entry?.issuer ?? '').trim();
                const date = String(entry?.issue_date ?? entry?.issueDate ?? '').trim();
                const header = [title, issuer].filter(Boolean).join(' - ');
                return [header, date].filter(Boolean).join('\n').trim();
            })
            .filter(Boolean)
            .join('\n\n');
    };

    const formatSelectedProjectsText = (items: any[]): string => {
        if (!Array.isArray(items)) return '';
        return items
            .map((entry) => {
                const name = String(entry?.name ?? '').trim();
                const summary = String(entry?.summary ?? '').trim();
                const tech = Array.isArray(entry?.tech)
                    ? entry.tech.map((t: any) => String(t ?? '').trim()).filter(Boolean)
                    : [];
                const bullets = Array.isArray(entry?.bullets)
                    ? entry.bullets.map((b: any) => String(b ?? '').trim()).filter(Boolean)
                    : [];
                const link = String(entry?.link ?? '').trim();
                const lines = [name, summary].filter(Boolean);
                if (tech.length) lines.push(`Tech: ${tech.join(', ')}`);
                if (bullets.length) lines.push(...bullets.map((b: string) => `- ${b}`));
                if (link) lines.push(`Link: ${link}`);
                return lines.join('\n').trim();
            })
            .filter(Boolean)
            .join('\n\n');
    };

    const formatLanguagesText = (items: any[]): string => {
        if (!Array.isArray(items)) return '';
        return items
            .map((entry) => {
                const name = String(entry?.language ?? entry?.name ?? '').trim();
                const level = String(entry?.level ?? '').trim();
                return [name, level].filter(Boolean).join(' - ').trim();
            })
            .filter(Boolean)
            .join('\n');
    };

    const formatAdditionalInfoText = (value: any): string => {
        if (typeof value === 'string') return value;
        const notes = value?.notes;
        if (Array.isArray(notes) && notes.length) {
            return notes.map((n: any) => String(n ?? '').trim()).filter(Boolean).join('\n');
        }
        return '';
    };

    const formatSkillsText = (value: any): string => {
        if (Array.isArray(value) && value.length) {
            if (typeof value[0] === 'string') return value.map((v) => String(v ?? '').trim()).filter(Boolean).join('\n');
            const flattened = value
                .flatMap((entry: any) =>
                    Array.isArray(entry?.skills) ? entry.skills : (entry?.skills ?? entry?.skill ?? entry?.name),
                )
                .map((v: any) => String(v ?? '').trim())
                .filter(Boolean);
            if (flattened.length) return flattened.join('\n');
        }
        return '';
    };

    const resolveImprovedSectionText = (section: SectionKey, improvedResume: any, fallback: string): string => {
        if (!improvedResume || typeof improvedResume !== 'object') return fallback;
        const safe = improvedResume as any;
        const direct = safe[section];
        if (typeof direct === 'string' && direct.trim()) return direct;

        switch (section) {
            case 'summary':
                return typeof safe.summary === 'string' && safe.summary.trim() ? safe.summary : fallback;
            case 'skills':
                return (
                    formatSkillsText(safe.technicalSkills ?? safe.technical_skills ?? safe.skills) || fallback
                );
            case 'experience':
                return (
                    formatExperienceText(safe.professionalExperience ?? safe.experience ?? []) || fallback
                );
            case 'education':
                return formatEducationText(safe.education ?? []) || fallback;
            case 'certificates':
                return formatCertificatesText(safe.certifications ?? safe.certificates ?? []) || fallback;
            case 'selectedProjects':
                return formatSelectedProjectsText(safe.selectedProjects ?? []) || fallback;
            case 'languages':
                return formatLanguagesText(safe.languages ?? []) || fallback;
            case 'additionalInfo':
                return formatAdditionalInfoText(safe.additionalInfo ?? {}) || fallback;
            default:
                return fallback;
        }
    };

    const applyTypedSectionText = (section: string, partialText: string) => {
        switch (section) {
            case 'summary':
                setSummary(partialText);
                return;
            case 'education':
                setEducation(applyEducationEditText(partialText));
                return;
            case 'additionalInfo':
                setAdditionalInfo(partialText);
                return;
            case 'experience':
                setExperiences((prev) => applyExperienceEditText(prev, partialText));
                return;
            case 'skills':
                setSkills(applyLineListEditText(partialText));
                return;
            case 'contactWays':
                setContactWays(applyLineListEditText(partialText));
                return;
            case 'languages':
                setLanguages(applyLanguagesEditText(partialText));
                return;
            case 'certificates':
                setCertificates(applyCertificateEditText(partialText));
                return;
            case 'selectedProjects':
                setSelectedProjects(applySelectedProjectsEditText(partialText));
                return;
        }
    };

    const getSectionTextForImprove = (section: string): string => {
        switch (section) {
            case 'summary':
                return summary;
            case 'skills':
                return formatLineListEditText(skills);
            case 'contactWays':
                return formatLineListEditText(contactWays);
            case 'education':
                return formatEducationEditText(education);
            case 'languages':
                return formatLanguagesEditText(languages);
            case 'certificates':
                return formatCertificateEditText(certificates);
            case 'selectedProjects':
                return formatSelectedProjectsEditText(selectedProjects);
            case 'experience':
                return formatExperienceEditText(experiences);
            case 'additionalInfo':
                return additionalInfo;
            default:
                return '';
        }
    };

    const requestImprovedText = useCallback(
        async (cvSection: string, rawText: string): Promise<string> => {
            const text = String(rawText ?? '').trim();
            if (!text) return '';

            const postResponse = await postImproved({
                userId: apiUserId ?? undefined,
                lang: 'en',
                cvSection,
                paragraph: text,
            });
            const improved = (postResponse as any)?.result?.improved;
            return typeof improved === 'string' && improved.trim() ? improved : text;
        },
        [apiUserId],
    );

    // Auto-improve pipeline (file-flow + text-only).
    useEffect(() => {
        if (
            !isTextOnlyMode &&
            manualEditSavedRequestIdRef.current &&
            manualEditSavedRequestIdRef.current === requestId
        ) {
            return;
        }

        const apiKey = canFetchCv ? `${identityKey}:${requestId ?? ''}` : null;
        const runKey = sessionSeededRunKey
            ? `session:${sessionSeededRunKey}`
            : cvLoadedRunKey
              ? `api:${cvLoadedRunKey}`
              : null;
        const shouldRun =
            Boolean(sessionSeededRunKey) || (apiKey && cvLoadedApiKey === apiKey && Boolean(cvLoadedRunKey));
        if (!runKey || !shouldRun) return;

        if (autoImproveRunKeyRef.current === runKey) return;
        autoImproveRunKeyRef.current = runKey;

        setAutoImproveIndex(-1);
        setAutoImproved({});
        setAutoImprovePhase('idle');

        const run = async () => {
            try {
                setImproveError(null);
                setAutoImprovePhase('request');
                /**
                 * Single-call improve:
                 * Send all sections once, then apply improved outputs section-by-section (typing effect preserved).
                 */
                const rawPayload = {
                    summary: getSectionTextForImprove('summary'),
                    skills: getSectionTextForImprove('skills'),
                    experience: getSectionTextForImprove('experience'),
                    education: getSectionTextForImprove('education'),
                    certifications: getSectionTextForImprove('certificates'),
                    selectedProjects: getSectionTextForImprove('selectedProjects'),
                    languages: getSectionTextForImprove('languages'),
                    additionalInfo: getSectionTextForImprove('additionalInfo'),
                };

                const improveRes = await improveResume({
                    userId: apiUserId ?? undefined,
                    mode: 'sections_text',
                    resume: rawPayload,
                    isFinalStep: true,
                });

                const improvedResume = (improveRes as any)?.result?.improvedResume ?? {};
                const hasImprovedContent =
                    improvedResume && typeof improvedResume === 'object' && Object.keys(improvedResume).length > 0;
                const fallback = (value: string) => (hasImprovedContent ? '' : value);

                const improvedBySection: Record<string, string> = {
                    summary: resolveImprovedSectionText('summary', improvedResume, fallback(rawPayload.summary)),
                    skills: resolveImprovedSectionText('skills', improvedResume, fallback(rawPayload.skills)),
                    experience: resolveImprovedSectionText('experience', improvedResume, fallback(rawPayload.experience)),
                    education: resolveImprovedSectionText('education', improvedResume, fallback(rawPayload.education)),
                    certificates: resolveImprovedSectionText(
                        'certificates',
                        improvedResume,
                        fallback(rawPayload.certifications ?? ''),
                    ),
                    selectedProjects: resolveImprovedSectionText(
                        'selectedProjects',
                        improvedResume,
                        fallback(rawPayload.selectedProjects),
                    ),
                    languages: resolveImprovedSectionText('languages', improvedResume, fallback(rawPayload.languages)),
                    additionalInfo: resolveImprovedSectionText(
                        'additionalInfo',
                        improvedResume,
                        fallback(rawPayload.additionalInfo),
                    ),
                };

                for (let i = 0; i < AUTO_IMPROVE_ORDER.length; i++) {
                    const section = AUTO_IMPROVE_ORDER[i];
                    setAutoImproveIndex(i);
                    setAutoImprovePhase('request');

                    const improved = String(improvedBySection[section] ?? '').trim();
                    if (!improved) {
                        applyTypedSectionText(section, '');
                        setAutoImproved((prev) => ({ ...prev, [section]: true }));
                        continue;
                    }

                    if (section !== 'summary') {
                        applyTypedSectionText(section, '');
                    }

                    setAutoImprovePhase('typing');
                    if (section === 'summary') {
                        applyTypedSectionText(section, '');
                    }
                    await typewriterWords(improved, (partial) => applyTypedSectionText(section, partial));
                    setAutoImproved((prev) => ({ ...prev, [section]: true }));
                }

                setAutoImprovePhase('done');

                // Persist improved final state into the CV row so admin "Users → Resumes" table reflects it.
                if (requestId) {
                    const payloadToSave = buildPayloadFromValues({
                        profile,
                        summary: improvedBySection.summary ?? summary,
                        skills: applyLineListEditText(improvedBySection.skills ?? formatLineListEditText(skills)),
                        contactWays,
                        education: applyEducationEditText(improvedBySection.education ?? formatEducationEditText(education)),
                        languages: applyLanguagesEditText(improvedBySection.languages ?? formatLanguagesEditText(languages)),
                        certificates: applyCertificateEditText(
                            improvedBySection.certificates ?? formatCertificateEditText(certificates),
                        ),
                        selectedProjects: applySelectedProjectsEditText(
                            improvedBySection.selectedProjects ?? formatSelectedProjectsEditText(selectedProjects),
                        ),
                        additionalInfo: improvedBySection.additionalInfo ?? additionalInfo,
                        experiences: applyExperienceEditText(
                            experiences,
                            improvedBySection.experience ?? formatExperienceEditText(experiences),
                        ),
                    });
                    const userKey = identityKey;
                    const persistKey = `auto-improve:${userKey}:${requestId}:${runKey}`;
                    await autoPersistCv(payloadToSave, persistKey);
                }
            } catch (err) {
                const e = err as any;
                setImproveError(e instanceof Error ? e.message : 'Failed to improve text. Please try again.');
                setAutoImprovePhase('done');
            }
        };

        void run();
    }, [
        isTextOnlyMode,
        canFetchCv,
        apiUserId,
        identityKey,
        requestId,
        cvLoadedApiKey,
        cvLoadedRunKey,
        sessionSeededRunKey,
        AUTO_IMPROVE_ORDER,
        requestImprovedText,
        autoPersistCv,
        buildPayloadFromValues,
        additionalInfo,
        certificates,
        contactWays,
        education,
        experiences,
        languages,
        profile,
        selectedProjects,
        skills,
        summary,
    ]);

    const loadCvData = useCallback(
        async (opts: { requestId?: string | null; userId?: string | null } = {}) => {
            const requestIdToLoad = opts.requestId ?? requestId;
            const userIdToLoad = opts.userId ?? apiUserId;
            if (!requestIdToLoad) return;

            setIsCvLoading(true);
            setCvError(null);

            try {
                const raw = await getCV({ requestId: requestIdToLoad, userId: userIdToLoad ?? undefined });
                const record = resolveCvRecord(raw);
                if (!record) {
                    setCvError('Resume data is empty.');
                    cvPayloadRef.current = null;
                    setCvLoadedApiKey(null);
                    setCvLoadedRunKey(null);
                    if (!isSessionSeeded) {
                        setSummary('');
                        setSkills([]);
                        setContactWays([]);
                        setLanguages([]);
                        setEducation([]);
                        setCertificates([]);
                        setSelectedProjects([]);
                        setAdditionalInfo('');
                        setExperiences([]);
                    }
                    return;
                }

                const payload = resolveCvPayload(record);
                cvPayloadRef.current = payload;
                const apiKey = `${userIdToLoad ?? 'cookie'}:${requestIdToLoad}`;
                setCvLoadedApiKey(apiKey);
                setCvLoadedRunKey(`${apiKey}:${Date.now()}`);

                const rawSummary = extractSummary(payload) || extractSummary(record);
                const detectedSummary = cleanSummaryText(rawSummary);
                const detectedSkills = extractSkills(payload).length ? extractSkills(payload) : extractSkills(record);
                const detectedContactWays =
                    extractContactWays(payload).length > 0 ? extractContactWays(payload) : extractContactWays(record);
                const detectedLanguages =
                    extractLanguages(payload).length > 0 ? extractLanguages(payload) : extractLanguages(record);
                const detectedEducation =
                    normalizeEducationEntries(extractEducationEntries(payload)).length > 0
                        ? normalizeEducationEntries(extractEducationEntries(payload))
                        : normalizeEducationEntries(extractEducationEntries(record));
                const detectedCertificates =
                    normalizeCertificates(extractCertificateEntries(payload)).length > 0
                        ? normalizeCertificates(extractCertificateEntries(payload))
                        : normalizeCertificates(extractCertificateEntries(record));
                const detectedSelectedProjects =
                    normalizeSelectedProjects(extractSelectedProjectEntries(payload)).length > 0
                        ? normalizeSelectedProjects(extractSelectedProjectEntries(payload))
                        : normalizeSelectedProjects(extractSelectedProjectEntries(record));
                const detectedAdditionalInfo = extractAdditionalInfoText(payload) || extractAdditionalInfoText(record);
                const extracted = extractExperienceEntries(payload).length
                    ? extractExperienceEntries(payload)
                    : extractExperienceEntries(record);
                const normalizedExperiences = ensureMinimumExperiences(normalizeExperiences(extracted));

                if (isSessionSeeded) {
                    setSummary((prev) => (prev?.trim?.() ? prev : detectedSummary));
                    setSkills((prev) => (Array.isArray(prev) && prev.length ? prev : detectedSkills));
                    setContactWays((prev) => (Array.isArray(prev) && prev.length ? prev : detectedContactWays));
                    setLanguages((prev) => (Array.isArray(prev) && prev.length ? prev : detectedLanguages));
                    setEducation((prev) => (Array.isArray(prev) && prev.length ? prev : detectedEducation));
                    setCertificates((prev) => (Array.isArray(prev) && prev.length ? prev : detectedCertificates));
                    setSelectedProjects((prev) => (Array.isArray(prev) && prev.length ? prev : detectedSelectedProjects));
                    setAdditionalInfo((prev) => (prev?.trim?.() ? prev : detectedAdditionalInfo));
                    setExperiences((prev) => (Array.isArray(prev) && prev.length ? prev : normalizedExperiences));
                } else {
                    setSummary(detectedSummary);
                    setSkills(detectedSkills);
                    setContactWays(detectedContactWays);
                    setLanguages(detectedLanguages);
                    setEducation(detectedEducation);
                    setCertificates(detectedCertificates);
                    setSelectedProjects(detectedSelectedProjects);
                    setAdditionalInfo(detectedAdditionalInfo);
                    setExperiences(normalizedExperiences);
                }
            } catch (error) {
                console.error('Failed to load CV preview', error);
                setCvError('Unable to load resume data. Please try again.');
                cvPayloadRef.current = null;
                setCvLoadedApiKey(null);
                setCvLoadedRunKey(null);
            } finally {
                setIsCvLoading(false);
                setHasCvLoadedOnce(true);
            }
        },
        [requestId, apiUserId, isSessionSeeded],
    );

    // Poll analysis/create then load CV once.
    useEffect(() => {
        if (!requestId) return;

        // For admin/open-existing-resume flows: skip polling and just load.
        if (args.disableAutoPoll) {
            void loadCvData();
            return;
        }

        const key = `${identityKey}:${requestId}`;
        if (lastAutoFetchKeyRef.current === key) return;
        lastAutoFetchKeyRef.current = key;

        let cancelled = false;
        const run = async () => {
            try {
                const bodyOfResume = loadWizardTextOnlySession() ?? buildWizardSerializable(wizardData);
                await pollCvAnalysisAndCreateCv(requestId, bodyOfResume, apiUserId ?? undefined, () => undefined);
            } catch {
                // best-effort
            }

            if (cancelled) return;
            await loadCvData();
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [requestId, apiUserId, identityKey, wizardData, loadCvData, args.disableAutoPoll]);

    const handleEdit = (section: string) => {
        setSaveError(null);
        /**
         * Important: `requestId` can be hydrated asynchronously (e.g. from URL search params).
         * Avoid treating the editor as text-only once we already have a requestId, even if the
         * `isTextOnlyMode` state hasn't flipped yet.
         */
        if (isTextOnlyMode && !requestId) {
            if (shouldBlockBelowSummary && section !== 'profile') {
                setSaveError('Please wait for auto-improve to finish.');
                return;
            }

            if (section === 'profile') {
                textOnlyBackupRef.current.profile = { profile: { ...profile }, contactWays: [...contactWays] };
            }
            if (section === 'summary') textOnlyBackupRef.current.summary = summary;
            if (section === 'skills') textOnlyBackupRef.current.skills = [...skills];
            if (section === 'education') textOnlyBackupRef.current.education = [...education];
            if (section === 'languages') textOnlyBackupRef.current.languages = [...languages];
            if (section === 'certificates') textOnlyBackupRef.current.certificates = [...certificates];
            if (section === 'selectedProjects') textOnlyBackupRef.current.selectedProjects = [...selectedProjects];
            if (section === 'additionalInfo') textOnlyBackupRef.current.additionalInfo = additionalInfo;
            if (section === 'experience') textOnlyBackupRef.current.experience = [...experiences];

            if (section === 'profile') {
                setProfileEditText(
                    formatProfileEditText(profile, {
                        visaStatus: resolvedVisaStatus,
                        mainSkill: resolvedMainSkill,
                        phone: resolvedPhone,
                        email: resolvedEmail,
                    }),
                );
            }
            if (section === 'skills' && skills.length === 0) setSkills(['']);
            if (section === 'education') setEducationEditText(formatEducationEditText(education));
            if (section === 'languages') setLanguagesEditText(formatLanguagesEditText(languages));
            if (section === 'certificates') setCertificatesEditText(formatCertificateEditText(certificates));
            if (section === 'selectedProjects') setSelectedProjectsEditText(formatSelectedProjectsEditText(selectedProjects));
            if (section === 'additionalInfo') setAdditionalInfoEditText(additionalInfo);
            if (section === 'experience') setExperienceEditText(formatExperienceEditText(experiences));

            setEditingSection(section);
            return;
        }

        /**
         * File-flow: while CV is still being generated/created on the backend, avoid entering edit mode.
         * Otherwise the user can start editing while `add-cv` is still in flight, leading to confusing
         * add/edit ordering and/or dropped changes.
         */
        if (!isTextOnlyMode && requestId && (isCvLoading || (!cvPayloadRef.current && !isSessionSeeded))) {
            setSaveError('Please wait for your resume to finish generating.');
            return;
        }

        if (section === 'profile') {
            setProfileEditText(
                formatProfileEditText(profile, {
                    visaStatus: resolvedVisaStatus,
                    mainSkill: resolvedMainSkill,
                    phone: resolvedPhone,
                    email: resolvedEmail,
                }),
            );
        }
        if (section === 'skills' && skills.length === 0) setSkills(['']);
        if (section === 'contactWays') setContactWaysEditText(formatLineListEditText(contactWays));
        if (section === 'education') setEducationEditText(formatEducationEditText(education));
        if (section === 'languages') setLanguagesEditText(formatLanguagesEditText(languages));
        if (section === 'certificates') setCertificatesEditText(formatCertificateEditText(certificates));
        if (section === 'selectedProjects') setSelectedProjectsEditText(formatSelectedProjectsEditText(selectedProjects));
        if (section === 'additionalInfo') setAdditionalInfoEditText(additionalInfo);
        if (section === 'experience') setExperienceEditText(formatExperienceEditText(experiences));
        setEditingSection(section);
    };

    const handleSave = async () => {
        if (!editingSection) return;

        /**
         * Same guard as `handleEdit`: if we already have a requestId, we should update via `edit-cv`
         * and never create a new CV via `add-cv` (deprecated).
         */
        const shouldSaveLocally =
            (isTextOnlyMode && !requestId) || (!isTextOnlyMode && !!requestId && !cvPayloadRef.current);

        if (shouldSaveLocally) {
            if (isSaving) return;
            setIsSaving(true);
            setSaveError(null);

            if (editingSection === 'profile') {
                const parsed = applyProfileEditText(profileEditText);
                const nextProfile = parsed.profile;
                const nextContactWays = applyPhoneEmailToContactWays(contactWays, parsed.phone, parsed.email);

                setProfile(nextProfile);
                setContactWays(nextContactWays);

                updateWizardField('fullName', String(nextProfile.fullName ?? '').trim());
                updateWizardField('dateOfBirth', String(nextProfile.dateOfBirth ?? '').trim());
                updateWizardField('visaStatus', String(parsed.visaStatus ?? '').trim());
                updateWizardField('mainSkill', String(parsed.mainSkill ?? '').trim());
                updateWizardField('contactWay', nextContactWays);

                persistTextOnlySession((draft) => {
                    draft.fullName = String(nextProfile.fullName ?? '').trim();
                    draft.dateOfBirth = String(nextProfile.dateOfBirth ?? '').trim();
                    draft.visaStatus = String(parsed.visaStatus ?? '').trim();
                    draft.mainSkill = String(parsed.mainSkill ?? '').trim();
                    draft.contactWay = nextContactWays;
                });

                const profileSessionPayload = {
                    fullName: String(nextProfile.fullName ?? '').trim(),
                    dateOfBirth: String(nextProfile.dateOfBirth ?? '').trim(),
                    mainSkill: String(parsed.mainSkill ?? '').trim(),
                    visaStatus: String(parsed.visaStatus ?? '').trim(),
                };
                if (Object.values(profileSessionPayload).some((v) => String(v ?? '').trim().length > 0)) {
                    saveWizardProfileSession(profileSessionPayload);
                }
            }

            if (editingSection === 'summary') {
                persistTextOnlySession((draft) => {
                    draft.background = { ...(draft.background ?? {}), text: summary };
                });
            }

            if (editingSection === 'skills') {
                const normalized = skills.map((s) => String(s ?? '').trim()).filter(Boolean);
                setSkills(normalized.length ? normalized : []);
                persistTextOnlySession((draft) => {
                    draft.skills = normalized;
                });
            }

            if (editingSection === 'languages') {
                const nextLanguages = applyLanguagesEditText(languagesEditText);
                setLanguages(nextLanguages);
                persistTextOnlySession((draft) => {
                    draft.languages = nextLanguages.map((l) => ({
                        name: String(l.name ?? '').trim(),
                        level: String(l.level ?? '').trim(),
                    }));
                });
            }

            if (editingSection === 'education') {
                const nextEducation = applyEducationEditText(educationEditText);
                setEducation(nextEducation);
                persistTextOnlySession((draft) => {
                    draft.education = nextEducation.map((text) => ({ text }));
                });
            }

            if (editingSection === 'certificates') {
                const nextCertificates = applyCertificateEditText(certificatesEditText);
                setCertificates(nextCertificates);
                persistTextOnlySession((draft) => {
                    draft.certificates = nextCertificates;
                });
            }

            if (editingSection === 'selectedProjects') {
                const nextSelectedProjects = applySelectedProjectsEditText(selectedProjectsEditText);
                setSelectedProjects(nextSelectedProjects);
                persistTextOnlySession((draft) => {
                    draft.selectedProjects = nextSelectedProjects.map((text) => ({ text }));
                });
            }

            if (editingSection === 'additionalInfo') {
                const next = String(additionalInfoEditText ?? '');
                setAdditionalInfo(next);
                persistTextOnlySession((draft) => {
                    draft.additionalInfo = { ...(draft.additionalInfo ?? {}), text: next };
                });
            }

            if (editingSection === 'experience') {
                const nextExperiences = applyExperienceEditText(experiences, experienceEditText);
                setExperiences(nextExperiences);
                persistTextOnlySession((draft) => {
                    const normalized = (nextExperiences ?? [])
                        .map((e) => String(e?.description ?? '').trim())
                        .filter(Boolean)
                        .map((text) => ({ text }));
                    draft.experiences = normalized;
                });
            }

            const parsedProfile = editingSection === 'profile' ? applyProfileEditText(profileEditText) : null;
            const nextProfile = parsedProfile ? parsedProfile.profile : profile;
            const nextContactWays = parsedProfile
                ? applyPhoneEmailToContactWays(contactWays, parsedProfile.phone, parsedProfile.email)
                : contactWays;
            const nextEducation =
                editingSection === 'education' ? applyEducationEditText(educationEditText) : education;
            const nextLanguages =
                editingSection === 'languages' ? applyLanguagesEditText(languagesEditText) : languages;
            const nextCertificates =
                editingSection === 'certificates' ? applyCertificateEditText(certificatesEditText) : certificates;
            const nextSelectedProjects =
                editingSection === 'selectedProjects'
                    ? applySelectedProjectsEditText(selectedProjectsEditText)
                    : selectedProjects;
            const nextAdditionalInfo =
                editingSection === 'additionalInfo' ? String(additionalInfoEditText ?? '') : additionalInfo;
            const nextExperiences =
                editingSection === 'experience'
                    ? applyExperienceEditText(experiences, experienceEditText)
                    : experiences;
            const normalizedSkills = skills.map((s) => String(s ?? '').trim()).filter(Boolean);
            const normalizedContactWays = nextContactWays.map((c) => String(c ?? '').trim()).filter(Boolean);

            const updatedPayload = buildUpdatedCvPayload(cvPayloadRef.current, {
                profile: nextProfile,
                summary,
                skills: normalizedSkills,
                contactWays: normalizedContactWays,
                education: nextEducation,
                languages: nextLanguages,
                certificates: nextCertificates,
                selectedProjects: nextSelectedProjects,
                additionalInfo: nextAdditionalInfo,
                experiences: nextExperiences,
            });

            const sectionForApi = editingSection === 'profile' ? undefined : editingSection;
            const sectionText =
                sectionForApi === 'summary'
                    ? summary
                    : sectionForApi === 'skills'
                      ? formatLineListEditText(normalizedSkills)
                      : sectionForApi === 'contactWays'
                        ? formatLineListEditText(normalizedContactWays)
                        : sectionForApi === 'education'
                          ? formatEducationEditText(nextEducation)
                        : sectionForApi === 'languages'
                          ? formatLanguagesEditText(nextLanguages)
                          : sectionForApi === 'certificates'
                            ? formatCertificateEditText(nextCertificates)
                            : sectionForApi === 'selectedProjects'
                              ? formatSelectedProjectsEditText(nextSelectedProjects)
                    : sectionForApi === 'additionalInfo'
                      ? nextAdditionalInfo
                      : sectionForApi === 'experience'
                        ? formatExperienceEditText(nextExperiences)
                        : null;

            delete textOnlyBackupRef.current[editingSection];
            setEditingSection(null);

            const makeRequestId = () => {
                try {
                    const anyCrypto = (globalThis as any)?.crypto;
                    if (typeof anyCrypto?.randomUUID === 'function') return anyCrypto.randomUUID();
                } catch {
                    // ignore
                }
                return generateFakeUUIDv4();
            };

            const newRequestId = makeRequestId();

            try {
                if (!isTextOnlyMode) manualEditSavedRequestIdRef.current = newRequestId;
                await editCV({
                    userId: apiUserId ?? undefined,
                    requestId: newRequestId,
                    bodyOfResume: updatedPayload,
                    section: sectionForApi,
                    sectionText,
                });

                setRequestId(newRequestId);
                await loadCvData({ requestId: newRequestId, userId: apiUserId ?? undefined });
            } catch (error) {
                console.error('Failed to save CV from text-only draft', error);
                setSaveError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to save changes to the server. Please log in and try again.',
                );
            } finally {
                setIsSaving(false);
            }
            return;
        }

        const makeRequestId = () => {
            try {
                const anyCrypto = (globalThis as any)?.crypto;
                if (typeof anyCrypto?.randomUUID === 'function') return anyCrypto.randomUUID();
            } catch {
                // ignore
            }
            return generateFakeUUIDv4();
        };
        const effectiveRequestId = requestId ?? makeRequestId();

        if (isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        const parsedProfile = editingSection === 'profile' ? applyProfileEditText(profileEditText) : null;
        const nextProfile = parsedProfile ? parsedProfile.profile : profile;
        const nextContactWaysBase =
            editingSection === 'contactWays' ? applyLineListEditText(contactWaysEditText) : contactWays;
        const nextContactWays = parsedProfile
            ? applyPhoneEmailToContactWays(nextContactWaysBase, parsedProfile.phone, parsedProfile.email)
            : nextContactWaysBase;
        const nextEducation = editingSection === 'education' ? applyEducationEditText(educationEditText) : education;
        const nextLanguages = editingSection === 'languages' ? applyLanguagesEditText(languagesEditText) : languages;
        const nextCertificates =
            editingSection === 'certificates' ? applyCertificateEditText(certificatesEditText) : certificates;
        const nextSelectedProjects =
            editingSection === 'selectedProjects'
                ? applySelectedProjectsEditText(selectedProjectsEditText)
                : selectedProjects;
        const nextAdditionalInfo = editingSection === 'additionalInfo' ? additionalInfoEditText : additionalInfo;
        const nextExperiences =
            editingSection === 'experience' ? applyExperienceEditText(experiences, experienceEditText) : experiences;
        const normalizedSkills = skills.map((s) => String(s ?? '').trim()).filter(Boolean);
        const normalizedContactWays = nextContactWays.map((c) => String(c ?? '').trim()).filter(Boolean);

        if (editingSection === 'profile') setProfile(nextProfile);
        if (editingSection === 'contactWays') setContactWays(normalizedContactWays);
        if (editingSection === 'profile') setContactWays(normalizedContactWays);
        if (editingSection === 'education') setEducation(nextEducation);
        if (editingSection === 'languages') setLanguages(nextLanguages);
        if (editingSection === 'certificates') setCertificates(nextCertificates);
        if (editingSection === 'selectedProjects') setSelectedProjects(nextSelectedProjects);
        if (editingSection === 'additionalInfo') setAdditionalInfo(nextAdditionalInfo);
        if (editingSection === 'experience') setExperiences(nextExperiences);

        if (parsedProfile) {
            updateWizardField('fullName', String(nextProfile.fullName ?? '').trim());
            updateWizardField('dateOfBirth', String(nextProfile.dateOfBirth ?? '').trim());
            updateWizardField('visaStatus', String(parsedProfile.visaStatus ?? '').trim());
            updateWizardField('mainSkill', String(parsedProfile.mainSkill ?? '').trim());
            updateWizardField('contactWay', normalizedContactWays);

            const profileSessionPayload = {
                fullName: String(nextProfile.fullName ?? '').trim(),
                dateOfBirth: String(nextProfile.dateOfBirth ?? '').trim(),
                mainSkill: String(parsedProfile.mainSkill ?? '').trim(),
                visaStatus: String(parsedProfile.visaStatus ?? '').trim(),
            };
            if (Object.values(profileSessionPayload).some((v) => String(v ?? '').trim().length > 0)) {
                saveWizardProfileSession(profileSessionPayload);
            }
        }

        const updatedPayload = buildUpdatedCvPayload(cvPayloadRef.current, {
            profile: nextProfile,
            summary,
            skills: normalizedSkills,
            contactWays: normalizedContactWays,
            education: nextEducation,
            languages: nextLanguages,
            certificates: nextCertificates,
            selectedProjects: nextSelectedProjects,
            additionalInfo: nextAdditionalInfo,
            experiences: nextExperiences,
        });

        const sectionForApi = editingSection === 'profile' ? undefined : editingSection;
        const sectionText =
            sectionForApi === 'summary'
                ? summary
                : sectionForApi === 'skills'
                  ? formatLineListEditText(normalizedSkills)
                  : sectionForApi === 'contactWays'
                    ? formatLineListEditText(normalizedContactWays)
                    : sectionForApi === 'education'
                      ? formatEducationEditText(nextEducation)
                    : sectionForApi === 'languages'
                      ? formatLanguagesEditText(nextLanguages)
                      : sectionForApi === 'certificates'
                        ? formatCertificateEditText(nextCertificates)
                        : sectionForApi === 'selectedProjects'
                          ? formatSelectedProjectsEditText(nextSelectedProjects)
                    : sectionForApi === 'additionalInfo'
                      ? nextAdditionalInfo
                      : sectionForApi === 'experience'
                        ? formatExperienceEditText(nextExperiences)
                        : null;

        try {
            if (!isTextOnlyMode) manualEditSavedRequestIdRef.current = effectiveRequestId;
            await editCV({
                userId: apiUserId ?? undefined,
                requestId: effectiveRequestId,
                bodyOfResume: updatedPayload,
                section: sectionForApi,
                sectionText,
            });

            if (!requestId) setRequestId(effectiveRequestId);
            await loadCvData({ requestId: effectiveRequestId, userId: apiUserId ?? undefined });
            setEditingSection(null);
        } catch (error) {
            console.error('Failed to edit CV', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setSaveError(null);
        if (isTextOnlyMode && editingSection) {
            const backup = textOnlyBackupRef.current[editingSection];
            if (editingSection === 'profile' && backup && typeof backup === 'object') {
                const anyBackup = backup as any;
                if (anyBackup.profile) setProfile(anyBackup.profile as ResumeProfile);
                if (Array.isArray(anyBackup.contactWays)) setContactWays(anyBackup.contactWays as string[]);
            }
            if (editingSection === 'summary' && typeof backup === 'string') setSummary(backup);
            if (editingSection === 'skills' && Array.isArray(backup)) setSkills(backup);
            if (editingSection === 'education' && Array.isArray(backup)) setEducation(backup);
            if (editingSection === 'languages' && Array.isArray(backup)) setLanguages(backup);
            if (editingSection === 'certificates' && Array.isArray(backup)) setCertificates(backup);
            if (editingSection === 'selectedProjects' && Array.isArray(backup)) setSelectedProjects(backup);
            if (editingSection === 'additionalInfo' && typeof backup === 'string') setAdditionalInfo(backup);
            if (editingSection === 'experience' && Array.isArray(backup)) setExperiences(backup);
            delete textOnlyBackupRef.current[editingSection];
        }
        setEditingSection(null);
    };

    const handleSkillsChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const requestDeleteSection = (section: SectionKey) => {
        if (isPreview || isExporting) return;
        if (isDeletingSection) return;
        setSaveError(null);
        setPendingDeleteSection(section);
    };

    const cancelDeleteSection = () => {
        if (isDeletingSection) return;
        setPendingDeleteSection(null);
    };

    const confirmDeleteSection = async () => {
        if (!pendingDeleteSection || isDeletingSection) return;
        const sectionToDelete = pendingDeleteSection;
        setPendingDeleteSection(null);

        setIsDeletingSection(true);
        setSaveError(null);
        setImproveError(null);
        setEditingSection(null);

        const nextValues = {
            profile,
            summary: sectionToDelete === 'summary' ? '' : summary,
            skills: sectionToDelete === 'skills' ? [] : skills,
            contactWays: sectionToDelete === 'contactWays' ? [] : contactWays,
            languages: sectionToDelete === 'languages' ? [] : languages,
            education: sectionToDelete === 'education' ? [] : education,
            certificates: sectionToDelete === 'certificates' ? [] : certificates,
            selectedProjects: sectionToDelete === 'selectedProjects' ? [] : selectedProjects,
            additionalInfo: sectionToDelete === 'additionalInfo' ? '' : additionalInfo,
            experiences: sectionToDelete === 'experience' ? [] : experiences,
        };

        // Remove the section from the editor UI (not just clearing its values).
        hideSection(sectionToDelete);

        setSummary(nextValues.summary);
        setSkills(nextValues.skills);
        setContactWays(nextValues.contactWays);
        setLanguages(nextValues.languages);
        setEducation(nextValues.education);
        setCertificates(nextValues.certificates);
        setSelectedProjects(nextValues.selectedProjects);
        setAdditionalInfo(nextValues.additionalInfo);
        setExperiences(nextValues.experiences);

        persistTextOnlySession((draft) => {
            if (sectionToDelete === 'summary') {
                draft.background = { ...(draft.background ?? {}), text: '' };
            }
            if (sectionToDelete === 'skills') {
                draft.skills = [];
            }
            if (sectionToDelete === 'contactWays') {
                draft.contactWay = [];
                draft.contactWays = [];
            }
            if (sectionToDelete === 'languages') {
                draft.languages = [];
            }
            if (sectionToDelete === 'education') {
                draft.education = [];
            }
            if (sectionToDelete === 'certificates') {
                draft.certificates = [];
            }
            if (sectionToDelete === 'selectedProjects') {
                draft.selectedProjects = [];
            }
            if (sectionToDelete === 'additionalInfo') {
                draft.additionalInfo = { ...(draft.additionalInfo ?? {}), text: '' };
            }
            if (sectionToDelete === 'experience') {
                draft.experiences = [];
            }
        });

        const updatedPayload = buildUpdatedCvPayload(cvPayloadRef.current, nextValues);
        const resumeForDelete = (cvPayloadRef.current ?? updatedPayload) as unknown;

        const makeRequestId = () => {
            try {
                const anyCrypto = (globalThis as any)?.crypto;
                if (typeof anyCrypto?.randomUUID === 'function') return anyCrypto.randomUUID();
            } catch {
                // ignore
            }
            return generateFakeUUIDv4();
        };
        const effectiveRequestId = requestId ?? makeRequestId();

        try {
            const deleteResponse = await deleteResumeSection({
                section: sectionToDelete,
                resume: resumeForDelete,
            });
            const resumeToSave = deleteResponse?.updatedResume ?? updatedPayload;

            if (!isTextOnlyMode) manualEditSavedRequestIdRef.current = effectiveRequestId;
            await editCV({
                userId: apiUserId ?? undefined,
                requestId: effectiveRequestId,
                bodyOfResume: resumeToSave,
            });
            if (!requestId) setRequestId(effectiveRequestId);
            await loadCvData({ requestId: effectiveRequestId, userId: apiUserId ?? undefined });
        } catch (error) {
            console.error('Failed to delete section', error);
            setSaveError(error instanceof Error ? error.message : 'Failed to delete section. Please try again.');
        } finally {
            setIsDeletingSection(false);
            setPendingDeleteSection(null);
        }
    };

    const handleImprove = useCallback(
        async (section: string, option?: ImproveOption) => {
            if (improvingSection) return;
            if (!requestId) {
                setImproveError('requestId is missing. Please refresh and try again.');
                return;
            }
            if (isTextOnlyMode) {
                setImproveError('Improve is automatic in text-only mode.');
                return;
            }

            setImproveError(null);
            setImprovingSection(section);

            try {
                const currentText = getSectionTextForImprove(section);
                if (!String(currentText ?? '').trim()) {
                    throw new Error('Nothing to improve for this section.');
                }

                const context = option ? IMPROVE_OPTION_CONTEXT[option] : undefined;
                const postResponse = await postImproved({
                    userId: apiUserId ?? undefined,
                    lang: 'en',
                    cvSection: section,
                    paragraph: String(currentText),
                    context,
                });
                const improved = (postResponse as any)?.result?.improved;
                if (!improved || !String(improved).trim()) {
                    throw new Error('Failed to improve text. Please try again.');
                }

                applyTypedSectionText(section, improved);
                if (section === 'experience') {
                    // Keep edit buffer in sync if user switches to edit mode afterwards.
                    setExperienceEditText(formatExperienceEditText(applyExperienceEditText(experiences, improved)));
                }

                // Persist improved changes so admin DB view sees the latest CV content.
                const payloadToSave = buildPayloadFromState();
                const persistKey = `manual-improve:${identityKey}:${requestId}:${section}:${Date.now()}`;
                await autoPersistCv(payloadToSave, persistKey);
            } catch (error) {
                console.error('Failed to improve section', error);
                setImproveError(error instanceof Error ? error.message : 'Failed to improve text. Please try again.');
            } finally {
                setImprovingSection(null);
            }
        },
        [
            apiUserId,
            identityKey,
            autoPersistCv,
            buildPayloadFromState,
            experiences,
            improvingSection,
            isTextOnlyMode,
            requestId,
            summary,
            skills,
            contactWays,
            education,
            languages,
            certificates,
            selectedProjects,
            additionalInfo,
        ],
    );

    const handleDownloadPdf = useCallback(async () => {
        if (!pdfRef.current || isDownloading) return;

        setIsDownloading(true);
        setIsExporting(true);
        setDownloadError(null);
        setDownloadProgress(0);

        try {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

            const baseName = `Resume-${requestId ?? new Date().toISOString().slice(0, 10)}`;
            await exportElementToPdf(pdfRef.current, {
                fileName: baseName,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
                preOpenWindow: false,
            });
        } catch (error) {
            console.error('Failed to export resume PDF', error);
            setDownloadError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
            setIsDownloading(false);
        }
    }, [isDownloading, requestId, pdfRef]);

    return {
        isPreview,
        pdfRef,
        isExporting,

        profile,
        setProfile,
        resolvedVisaStatus,
        resolvedMainSkill,
        resolvedPhone,
        resolvedEmail,

        summary,
        setSummary,
        skills,
        setSkills,
        contactWays,
        setContactWays,
        education,
        setEducation,
        languages,
        setLanguages,
        certificates,
        setCertificates,
        selectedProjects,
        setSelectedProjects,
        additionalInfo,
        setAdditionalInfo,
        experiences,
        setExperiences,

        profileEditText,
        setProfileEditText,
        contactWaysEditText,
        setContactWaysEditText,
        educationEditText,
        setEducationEditText,
        languagesEditText,
        setLanguagesEditText,
        certificatesEditText,
        setCertificatesEditText,
        selectedProjectsEditText,
        setSelectedProjectsEditText,
        additionalInfoEditText,
        setAdditionalInfoEditText,
        experienceEditText,
        setExperienceEditText,

        editingSection,
        improvingSection,
        isTextOnlyMode,
        isAutoPipelineMode,
        isPreCvLoading,
        shouldBlockBelowSummary,
        shouldSkeletonSection,
        shouldSkeletonActions,

        isCvLoading,
        cvError,
        isSaving,
        saveError,
        improveError,
        downloadError,

        isDownloading,
        downloadProgress,

        handleEdit,
        handleSave,
        handleCancel,
        handleImprove,
        handleDownloadPdf,
        handleSkillsChange,
        requestDeleteSection,
        confirmDeleteSection,
        cancelDeleteSection,
        pendingDeleteSection,
        isDeletingSection,
        isSectionHidden,

        autoImproved,

        clearSaveError: () => setSaveError(null),
        clearImproveError: () => setImproveError(null),
        clearDownloadError: () => setDownloadError(null),
    };
}
