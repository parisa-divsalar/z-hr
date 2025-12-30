'use client';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Box, CardContent, CircularProgress, Skeleton, Stack, Typography } from '@mui/material';

import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';
import { apiClientClient } from '@/services/api-client';
import { editCV } from '@/services/cv/edit-cv';
import { getCV } from '@/services/cv/get-cv';
import { getImproved } from '@/services/cv/get-improved';
import { postImproved } from '@/services/cv/post-improved';
import { useAuthStore } from '@/store/auth';
import { buildWizardSerializable, useWizardStore } from '@/store/wizard';
import { exportElementToPdf } from '@/utils/exportToPdf';
import { loadWizardTextOnlySession } from '@/utils/wizardTextOnlySession';

import ProfileHeader from './ResumeEditor/ProfileHeader';
import SectionHeader from './ResumeEditor/SectionHeader';
import {
    MainCardContainer,
    FooterContainer,
    ResumeContainer,
    SectionContainer,
    SummaryContainer,
    SummaryText,
    SkillsContainer,
    ExperienceContainer,
    ExperienceItem,
    ExperienceItemSmall,
    CompanyName,
    JobDetails,
    ExperienceDescription,
    SkillTextField,
    StyledTextareaAutosize,
    ExperienceTextareaAutosize,
} from './ResumeEditor/styled';

type ResumeExperience = {
    id: number;
    company: string;
    position: string;
    description: string;
};

type ResumeLanguage = {
    id: number;
    name: string;
    level: string;
};

type ResumeProfile = {
    fullName: string;
    dateOfBirth: string;
    headline: string;
};

const POLL_INTERVAL = 3000;

const WIZARD_PROFILE_SESSION_KEY = 'wizardProfile:v1';

type WizardProfileSession = {
    fullName?: string;
    dateOfBirth?: string;
    visaStatus?: string;
    mainSkill?: string;
};

const saveWizardProfileSession = (data: WizardProfileSession) => {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(WIZARD_PROFILE_SESSION_KEY, JSON.stringify(data));
    } catch {
        // ignore
    }
};

const loadWizardProfileSession = (): WizardProfileSession | null => {
    try {
        if (typeof window === 'undefined') return null;
        const raw = sessionStorage.getItem(WIZARD_PROFILE_SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as WizardProfileSession;
    } catch {
        return null;
    }
};

const buildHeadline = (mainSkill?: string, visaStatus?: string) => {
    const headlineParts = [
        String(mainSkill ?? '').trim(),
        visaStatus ? `Visa: ${String(visaStatus).trim()}` : '',
    ].filter(Boolean);
    return headlineParts.join(' • ');
};

export const pollCvAnalysisAndCreateCv = async (
    requestId: string,
    bodyOfResume: any,
    accessToken: string,
    onProgress?: (subRequests: any[]) => void,
): Promise<void> => {
    const poll = async (): Promise<void> => {
        const res = await apiClientClient.get(`cv/cv-analysis-detailed?requestId=${requestId}`);

        const status = res.data.main_request_status;
        const subRequests = Array.isArray(res.data?.sub_requests) ? res.data.sub_requests : [];

        onProgress?.(subRequests);

        if (status === 2) {
            await apiClientClient.post('cv/add-cv', {
                userId: accessToken,
                requestId,
                bodyOfResume,
            });

            await apiClientClient.get(`cv/get-cv?requestId=${requestId}`);
            return;
        }

        setTimeout(poll, POLL_INTERVAL);
    };

    await poll();
};

const createEmptyExperience = (id: number): ResumeExperience => ({
    id,
    company: '',
    position: '',
    description: '',
});

const createEmptyProfile = (): ResumeProfile => ({
    fullName: '',
    dateOfBirth: '',
    headline: '',
});

const formatProfileEditText = (profile: ResumeProfile): string => {
    const parts = [profile.fullName ?? '', profile.dateOfBirth ?? '', profile.headline ?? ''];
    return parts.join('\n').trimEnd();
};

const applyProfileEditText = (text: string): ResumeProfile => {
    const lines = String(text ?? '').split(/\r?\n/);
    return {
        fullName: String(lines[0] ?? '').trim(),
        dateOfBirth: String(lines[1] ?? '').trim(),
        headline: lines.slice(2).join('\n').trim(),
    };
};

const normalizeLineList = (value: any): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((v) => (typeof v === 'string' ? v : (v?.value ?? v?.text ?? v?.label ?? '')))
            .map((v) => String(v ?? '').trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/\r?\n|[,;]+/)
            .map((v) => v.trim())
            .filter(Boolean);
    }

    return [];
};

const formatLineListEditText = (items: string[]): string =>
    items
        .map((x) => String(x ?? '').trim())
        .filter(Boolean)
        .join('\n');

const applyLineListEditText = (text: string): string[] =>
    String(text ?? '')
        .split(/\r?\n+/)
        .map((x) => x.trim())
        .filter(Boolean);

const extractContactWays = (payload: any): string[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.contactWay,
        payload.contactWays,
        payload.contactMethods,
        payload.contacts,
        payload.contact,
        payload.contactInfo,
        payload.profile?.contactWay,
        payload.profile?.contactMethods,
    ];

    for (const candidate of candidates) {
        const normalized = normalizeLineList(candidate);
        if (normalized.length) return normalized;
    }

    return [];
};

const normalizeLanguages = (raw: any[]): ResumeLanguage[] => {
    return raw
        .map((entry, index) => {
            const safe = typeof entry === 'object' && entry !== null ? entry : { name: entry };
            const name = String(safe.name ?? safe.language ?? safe.title ?? safe.value ?? '').trim();
            const level = String(safe.level ?? safe.proficiency ?? safe.grade ?? safe.rank ?? '').trim();
            return {
                id: index + 1,
                name,
                level,
            };
        })
        .filter((x) => x.name.length > 0 || x.level.length > 0)
        .map((x, index) => ({ ...x, id: index + 1 }));
};

const extractLanguages = (payload: any): ResumeLanguage[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.languages,
        payload.languageSkills,
        payload.language_skills,
        payload.profile?.languages,
        payload.profile?.languageSkills,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            const normalized = normalizeLanguages(candidate);
            if (normalized.length) return normalized;
        }
        if (typeof candidate === 'string') {
            const lines = applyLineListEditText(candidate);
            const normalized = normalizeLanguages(lines);
            if (normalized.length) return normalized;
        }
    }

    return [];
};

const formatLanguagesEditText = (items: ResumeLanguage[]): string => {
    return items
        .map((l) => {
            const name = String(l.name ?? '').trim();
            const level = String(l.level ?? '').trim();
            return [name, level].filter(Boolean).join(' - ');
        })
        .filter(Boolean)
        .join('\n');
};

const applyLanguagesEditText = (text: string): ResumeLanguage[] => {
    const lines = applyLineListEditText(text);
    const parsed = lines.map((line) => {
        const parts = line.split(/\s*[-–—•|]\s*/).map((p) => p.trim());
        const name = parts[0] ?? '';
        const level = parts.slice(1).join(' ') ?? '';
        return { name, level };
    });
    return normalizeLanguages(parsed);
};

const extractJobDescriptionText = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.jobDescription?.text ??
        payload.jobDescriptionText ??
        payload.job_description ??
        payload.job_description_text ??
        payload.positionDescription ??
        payload.position_description ??
        payload.description ??
        ''
    );
};

const extractAdditionalInfoText = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';

    const additionalInfo = (payload as any).additionalInfo;
    if (typeof additionalInfo === 'string') return additionalInfo;

    return (
        additionalInfo?.text ??
        (payload as any).additionalInfoText ??
        (payload as any).additional_info ??
        (payload as any).additional_info_text ??
        (payload as any).otherInfo ??
        (payload as any).otherInformation ??
        (payload as any).extraInfo ??
        (payload as any).notes ??
        ''
    );
};

const extractCertificateEntries = (payload: any): any[] => {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.certificates)) return payload.certificates;
    if (Array.isArray(payload.certificate)) return payload.certificate;
    if (Array.isArray(payload.certifications)) return payload.certifications;
    if (Array.isArray(payload.profile?.certificates)) return payload.profile.certificates;
    if (Array.isArray(payload.profile?.certifications)) return payload.profile.certifications;
    return [];
};

const normalizeCertificates = (raw: any[]): string[] => {
    return raw
        .map((entry) => {
            if (typeof entry === 'string') return entry.trim();
            if (!entry || typeof entry !== 'object') return '';
            return String(entry.text ?? entry.title ?? entry.name ?? entry.description ?? entry.summary ?? '').trim();
        })
        .filter(Boolean);
};

const formatCertificateEditText = (items: string[]): string =>
    items
        .map((x) => String(x ?? '').trim())
        .filter(Boolean)
        .join('\n\n');

const applyCertificateEditText = (text: string): string[] =>
    String(text ?? '')
        .split(/\n\s*\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

const formatExperiencePosition = (entry: Record<string, any>) => {
    const title = entry?.position ?? entry?.title ?? entry?.role ?? '';
    const startDate = entry?.startDate ?? entry?.from ?? entry?.dateFrom ?? '';
    const endDate = entry?.endDate ?? entry?.to ?? entry?.dateTo ?? '';
    const period = startDate && endDate ? `${startDate} — ${endDate}` : startDate || endDate || '';
    const location = entry?.location ?? entry?.city ?? entry?.country ?? '';

    return [title, period, location].filter(Boolean).join(' • ');
};

const formatExperienceDescription = (entry: Record<string, any>) =>
    entry?.description ?? entry?.text ?? entry?.summary ?? entry?.details ?? '';

const normalizeExperiences = (raw: any[]): ResumeExperience[] =>
    raw.map((entry, index) => {
        const safeEntry = typeof entry === 'object' && entry !== null ? entry : { position: entry };
        return {
            id: index + 1,
            company: safeEntry.company ?? safeEntry.companyName ?? safeEntry.organization ?? safeEntry.employer ?? '',
            position: formatExperiencePosition(safeEntry),
            description: formatExperienceDescription(safeEntry),
        };
    });

const extractExperienceEntries = (payload: any): any[] => {
    if (!payload || typeof payload !== 'object') return [];
    if (Array.isArray(payload.experiences)) return payload.experiences;
    if (Array.isArray(payload.experience)) return payload.experience;
    if (Array.isArray(payload.careerHistory)) return payload.careerHistory;
    if (Array.isArray(payload.positions)) return payload.positions;
    return [];
};

const ensureMinimumExperiences = (items: ResumeExperience[], minCount = 0): ResumeExperience[] => {
    const normalized = items.map((item, index) => ({ ...item, id: index + 1 }));
    while (normalized.length < minCount) {
        normalized.push(createEmptyExperience(normalized.length + 1));
    }
    return normalized;
};

const normalizeSkillArray = (value: any): string[] => {
    if (Array.isArray(value)) {
        return value
            .map((skill) => (typeof skill === 'string' ? skill : (skill?.name ?? '')))
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    if (typeof value === 'string') {
        return value
            .split(/[,;]/)
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
};

const extractSkills = (payload: any): string[] => {
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.skills,
        payload.skillList,
        payload.skillsList,
        payload.skill_set,
        payload.skills_summary,
    ];

    for (const candidate of candidates) {
        const normalized = normalizeSkillArray(candidate);
        if (normalized.length) {
            return normalized;
        }
    }

    return [];
};

const extractSummary = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.summary ??
        payload.profile?.summary ??
        payload.background?.text ??
        payload.backgroundText ??
        payload.about ??
        payload.careerSummary ??
        payload.summaryText ??
        ''
    );
};

const extractFullName = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.fullName ??
        payload.name ??
        payload.profile?.fullName ??
        payload.profile?.name ??
        payload.personal?.fullName ??
        payload.personal?.name ??
        ''
    );
};

const extractDateOfBirth = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    return (
        payload.dateOfBirth ??
        payload.DateOfBirth ??
        payload.birthDate ??
        payload.BirthDate ??
        payload.dob ??
        payload.DOB ??
        payload.profile?.dateOfBirth ??
        payload.profile?.DateOfBirth ??
        payload.profile?.birthDate ??
        payload.profile?.BirthDate ??
        payload.profile?.dob ??
        payload.profile?.DOB ??
        payload.personal?.dateOfBirth ??
        payload.personal?.DateOfBirth ??
        payload.personal?.birthDate ??
        payload.personal?.BirthDate ??
        payload.personal?.dob ??
        payload.personal?.DOB ??
        payload.personalInfo?.dateOfBirth ??
        payload.personalInfo?.DateOfBirth ??
        payload.personalInformation?.dateOfBirth ??
        payload.personalInformation?.DateOfBirth ??
        ''
    );
};

const extractHeadline = (payload: any): string => {
    if (!payload || typeof payload !== 'object') return '';
    const title =
        payload.title ??
        payload.position ??
        payload.mainSkill ??
        payload.profile?.title ??
        payload.profile?.position ??
        '';
    const visa = payload.visaStatus ?? payload.profile?.visaStatus ?? '';
    const years =
        payload.yearsOfExperience ??
        payload.experienceYears ??
        payload.profile?.yearsOfExperience ??
        payload.profile?.experienceYears ??
        '';

    const parts = [title, visa && `Visa: ${visa}`, years && `${years} Years of experience`].filter(Boolean);
    return parts.join(' • ');
};

const resolveCvRecord = (raw: any): any | null => {
    const unwrap = (candidate: any) => {
        if (!candidate || typeof candidate !== 'object') return null;
        return (candidate as any).result ?? (candidate as any).data ?? candidate;
    };

    const getTimeKey = (candidate: any): number => {
        if (!candidate || typeof candidate !== 'object') return -1;
        const c: any = candidate;
        const value =
            c.updatedAt ??
            c.updatedDate ??
            c.modifiedAt ??
            c.modifiedDate ??
            c.lastUpdatedAt ??
            c.lastUpdate ??
            c.createdAt ??
            c.createdDate ??
            c.insertDate ??
            c.timestamp ??
            c.time ??
            null;

        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string') {
            const ms = Date.parse(value);
            if (!Number.isNaN(ms)) return ms;
        }
        return -1;
    };

    const hasBody = (candidate: any): boolean => {
        if (!candidate || typeof candidate !== 'object') return false;
        const body = (candidate as any).bodyOfResume ?? (candidate as any).BodyOfResume;
        if (!body) return false;
        if (typeof body === 'string') return body.trim().length > 0;
        if (typeof body === 'object') return Object.keys(body).length > 0;
        return true;
    };

    const pickFromArray = (arr: any[]): any | null => {
        const unwrapped = arr.map(unwrap).filter(Boolean) as any[];
        if (unwrapped.length === 0) return null;

        // Prefer records that actually contain a body, then pick the newest by timestamp-like keys.
        const bodyCandidates = unwrapped.filter(hasBody);
        const pool = bodyCandidates.length ? bodyCandidates : unwrapped;

        let best = pool[pool.length - 1];
        let bestKey = getTimeKey(best);

        for (const item of pool) {
            const key = getTimeKey(item);
            if (key > bestKey) {
                best = item;
                bestKey = key;
            }
        }

        return best;
    };

    if (Array.isArray(raw)) {
        return pickFromArray(raw);
    }

    const unwrapped = unwrap(raw);
    if (Array.isArray(unwrapped)) {
        return pickFromArray(unwrapped);
    }

    return unwrapped;
};

const resolveCvPayload = (record: any): any => {
    if (!record || typeof record !== 'object') return {};
    const body = (record as any).bodyOfResume;
    if (body && typeof body === 'object') return body;
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch {
            return record;
        }
    }
    return record;
};

const buildUpdatedCvPayload = (
    basePayload: any,
    values: {
        profile: ResumeProfile;
        summary: string;
        skills: string[];
        contactWays: string[];
        languages: ResumeLanguage[];
        certificates: string[];
        jobDescription: string;
        additionalInfo: string;
        experiences: ResumeExperience[];
    },
) => {
    const base = basePayload && typeof basePayload === 'object' ? basePayload : {};
    const baseProfile = base.profile && typeof base.profile === 'object' ? base.profile : {};

    const nextProfile = {
        ...baseProfile,
        fullName: values.profile.fullName,
        name: values.profile.fullName,
        dateOfBirth: values.profile.dateOfBirth,
        birthDate: values.profile.dateOfBirth,
        title: values.profile.headline,
        headline: values.profile.headline,
        summary: values.summary,
    };

    const normalizeAdditionalInfo = () => {
        const existing = base.additionalInfo;
        if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
            return { ...existing, text: values.additionalInfo };
        }
        return values.additionalInfo;
    };

    const normalizeJobDescription = () => {
        const existing = base.jobDescription;
        if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
            return { ...existing, text: values.jobDescription };
        }
        return { text: values.jobDescription };
    };

    const nextExperiences = values.experiences.map((exp) => ({
        company: exp.company,
        companyName: exp.company,
        position: exp.position,
        title: exp.position,
        description: exp.description,
    }));

    const next = {
        ...base,
        fullName: values.profile.fullName,
        name: values.profile.fullName,
        dateOfBirth: values.profile.dateOfBirth,
        birthDate: values.profile.dateOfBirth,
        title: values.profile.headline,
        mainSkill: values.profile.headline,
        summary: values.summary,
        skills: values.skills,
        skillList: values.skills,
        contactWays: values.contactWays,
        contactWay: values.contactWays,
        languages: values.languages,
        certificates: values.certificates,
        certifications: values.certificates,
        jobDescription: normalizeJobDescription(),
        jobDescriptionText: values.jobDescription,
        additionalInfo: normalizeAdditionalInfo(),
        additionalInfoText: values.additionalInfo,
        experiences: nextExperiences,
        experience: nextExperiences,
        profile: nextProfile,
    };

    return next;
};

const formatExperienceEditText = (items: ResumeExperience[]): string => {
    return items
        .map((exp) => (exp.description ?? '').trim())
        .filter(Boolean)
        .join('\n\n');
};

const applyExperienceEditText = (current: ResumeExperience[], text: string): ResumeExperience[] => {
    const blocks = String(text ?? '')
        .split(/\n\s*\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

    const base = current.length ? current.map((e) => ({ ...e })) : [];
    const maxLen = Math.max(base.length, blocks.length);
    const next: ResumeExperience[] = [];

    for (let i = 0; i < maxLen; i++) {
        const existing = base[i] ?? createEmptyExperience(i + 1);
        next.push({
            ...existing,
            id: i + 1,
            description: blocks[i] ?? '',
        });
    }

    return next.filter((exp) =>
        [exp.company, exp.position, exp.description].some((v) => String(v ?? '').trim().length > 0),
    );
};

interface ResumeEditorProps {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    /**
     * When set to 'preview', edit/improve actions and footer buttons are hidden.
     * Useful for pages that only need the rendered resume + PDF export.
     */
    mode?: 'editor' | 'preview';
    /**
     * Optional ref override for the element that should be exported as PDF.
     * If not provided, ResumeEditor manages its own ref internally.
     */
    pdfTargetRef?: React.MutableRefObject<HTMLDivElement | null>;
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = (props) => {
    const { setStage, mode = 'editor', pdfTargetRef } = props;
    const isPreview = mode === 'preview';
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const wizardData = useWizardStore((state) => state.data);
    const requestId = useWizardStore((state) => state.requestId);
    const accessToken = useAuthStore((state) => state.accessToken);
    const canFetchCv = Boolean(requestId && accessToken);
    const [isTextOnlyMode, setIsTextOnlyMode] = useState(false);
    const [autoImproveIndex, setAutoImproveIndex] = useState<number>(-1);
    const [autoImprovePhase, setAutoImprovePhase] = useState<'idle' | 'request' | 'typing' | 'done'>('idle');
    const [autoImproved, setAutoImproved] = useState<Record<string, boolean>>({});
    const autoImproveRunKeyRef = useRef<string | null>(null);
    const textOnlySummaryBackupRef = useRef<string | null>(null);
    const internalPdfRef = useRef<HTMLDivElement | null>(null);
    const pdfRef = pdfTargetRef ?? internalPdfRef;
    const cvPayloadRef = useRef<any>(null);
    /**
     * File-flow only: becomes `${accessToken}:${requestId}` after we have successfully loaded a CV record
     * from get-cv. This prevents the auto-improve pipeline from running too early (e.g. when coming from
     * text-only session first, then switching to file flow).
     */
    const [cvLoadedKey, setCvLoadedKey] = useState<string | null>(null);
    const [cvLoadedNonce, setCvLoadedNonce] = useState(0);
    /**
     * Prevent duplicate auto-fetches (especially in React Strict Mode dev where effects run twice).
     * We still allow manual refresh via the "Refresh" handler.
     */
    const lastAutoFetchKeyRef = useRef<string | null>(null);

    const [profile, setProfile] = useState<ResumeProfile>(createEmptyProfile());
    const [profileEditText, setProfileEditText] = useState('');
    // Raw "background" text (shown immediately). Summary section will be auto-improved on top of this.
    const [backgroundText, setBackgroundText] = useState('');
    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [contactWays, setContactWays] = useState<string[]>([]);
    const [contactWaysEditText, setContactWaysEditText] = useState('');
    const [languages, setLanguages] = useState<ResumeLanguage[]>([]);
    const [languagesEditText, setLanguagesEditText] = useState('');
    const [certificates, setCertificates] = useState<string[]>([]);
    const [certificatesEditText, setCertificatesEditText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
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

    type SectionKey =
        | 'summary'
        | 'skills'
        | 'contactWays'
        | 'languages'
        | 'certificates'
        | 'jobDescription'
        | 'experience'
        | 'additionalInfo';

    const isFileFlowMode = canFetchCv && !isTextOnlyMode;
    const isAutoPipelineMode = isTextOnlyMode || isFileFlowMode;
    const isPreCvLoading = isFileFlowMode && !hasCvLoadedOnce;

    const AUTO_IMPROVE_ORDER = useMemo<SectionKey[]>(
        () => [
            'summary',
            'skills',
            'contactWays',
            'languages',
            'certificates',
            'jobDescription',
            'experience',
            'additionalInfo',
        ],
        [],
    );

    const shouldBlockBelowSummary = isAutoPipelineMode && !Boolean(autoImproved.summary) && !Boolean(improveError);

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

    // File flow: show initial profile from wizard/session while getCV is still loading.
    useEffect(() => {
        if (!isFileFlowMode) return;
        if (hasCvLoadedOnce) return;

        const wizardProfile: WizardProfileSession = {
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
    }, [isFileFlowMode, hasCvLoadedOnce, wizardData]);

    // Persist profile fields into sessionStorage so refresh/get-cv won't wipe them.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const payload: WizardProfileSession = {
            fullName: String((wizardData as any)?.fullName ?? '').trim(),
            dateOfBirth: String((wizardData as any)?.dateOfBirth ?? '').trim(),
            visaStatus: String((wizardData as any)?.visaStatus ?? '').trim(),
            mainSkill: String((wizardData as any)?.mainSkill ?? '').trim(),
        };
        if (!Object.values(payload).some((v) => String(v ?? '').trim().length > 0)) return;
        saveWizardProfileSession(payload);
    }, [wizardData]);

    useEffect(() => {
        if (canFetchCv) {
            setIsTextOnlyMode(false);
            return;
        }

        const session = loadWizardTextOnlySession();
        if (!session) {
            setIsTextOnlyMode(false);
            return;
        }

        setIsTextOnlyMode(true);

        const headlineParts = [
            String(session.mainSkill ?? '').trim(),
            session.visaStatus ? `Visa: ${String(session.visaStatus).trim()}` : '',
        ].filter(Boolean);

        setProfile({
            fullName: String(session.fullName ?? '').trim(),
            dateOfBirth: String(session.dateOfBirth ?? '').trim(),
            headline: headlineParts.join(' • '),
        });

        setSummary(String(session.background?.text ?? '').trim());
        setBackgroundText(String(session.background?.text ?? '').trim());
        setSkills(
            Array.isArray(session.skills) ? session.skills.map((s) => String(s ?? '').trim()).filter(Boolean) : [],
        );
        setContactWays(
            Array.isArray(session.contactWay)
                ? session.contactWay.map((c) => String(c ?? '').trim()).filter(Boolean)
                : [],
        );
        setLanguages(
            Array.isArray(session.languages)
                ? normalizeLanguages(session.languages as any[])
                : typeof (session as any).languages === 'string'
                  ? normalizeLanguages(applyLineListEditText((session as any).languages))
                  : [],
        );
        setCertificates(
            Array.isArray(session.certificates)
                ? session.certificates
                      .map((entry: any) =>
                          typeof entry === 'string' ? entry : (entry?.text ?? entry?.title ?? entry?.name),
                      )
                      .map((v: any) => String(v ?? '').trim())
                      .filter(Boolean)
                : [],
        );
        setJobDescription(String(session.jobDescription?.text ?? '').trim());
        setAdditionalInfo(String(session.additionalInfo?.text ?? '').trim());

        setExperiences(
            Array.isArray(session.experiences)
                ? session.experiences
                      .map((entry: any, idx: number) => ({
                          id: idx + 1,
                          company: '',
                          position: '',
                          description: String(entry?.text ?? '').trim(),
                      }))
                      .filter((exp) => exp.description.length > 0)
                : [],
        );

        // Keep edit buffers in sync (if user toggles edit mode).
        setProfileEditText(formatProfileEditText(createEmptyProfile()));
        setContactWaysEditText('');
        setLanguagesEditText('');
        setCertificatesEditText('');
        setAdditionalInfoEditText('');
        setExperienceEditText('');
        setCvError(null);
        setHasCvLoadedOnce(true);
    }, [canFetchCv]);

    // When request context changes, require a fresh get-cv load before auto-improve can run.
    useEffect(() => {
        if (!accessToken || !requestId) {
            setCvLoadedKey(null);
            return;
        }
        setCvLoadedKey(null);
    }, [accessToken, requestId]);

    const normalizeValue = (value: unknown): string | null => {
        if (value === null || value === undefined) return null;
        const str = String(value).trim();
        if (!str) return null;
        if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
        return str;
    };

    const extractPollingRequestId = (response: any): string | null => {
        const tryParseJsonString = (value: unknown): any | null => {
            if (typeof value !== 'string') return null;
            const trimmed = value.trim();
            if (!trimmed) return null;
            try {
                return JSON.parse(trimmed);
            } catch {
                return null;
            }
        };

        const direct =
            response?.RequestId ??
            response?.requestId ??
            response?.requestID ??
            response?.result?.RequestId ??
            response?.result?.requestId ??
            response?.data?.RequestId ??
            response?.data?.requestId;

        const normalizedDirect = normalizeValue(direct);
        if (normalizedDirect) return normalizedDirect;

        // Swagger-ish POST response often wraps the job id in `result.value` or `result` as a JSON string.
        const resultContainer = response?.result ?? response?.data?.result ?? null;
        const resultValueDirect = resultContainer?.value ?? resultContainer?.Value ?? null;
        const normalizedResultValue = normalizeValue(resultValueDirect);
        if (normalizedResultValue) return normalizedResultValue;

        const parsedResult = tryParseJsonString(resultContainer);
        if (parsedResult && typeof parsedResult === 'object') {
            const parsedValue =
                (parsedResult as any).value ??
                (parsedResult as any).Value ??
                (parsedResult as any).RequestId ??
                (parsedResult as any).requestId ??
                (parsedResult as any).requestID ??
                null;
            const normalizedParsedValue = normalizeValue(parsedValue);
            if (normalizedParsedValue) return normalizedParsedValue;
        }

        const parameters: any[] =
            (Array.isArray(response?.parameters) ? response.parameters : null) ??
            (Array.isArray(response?.result?.parameters) ? response.result.parameters : null) ??
            (Array.isArray(response?.data?.parameters) ? response.data.parameters : null) ??
            [];

        for (const entry of parameters) {
            if (!entry || typeof entry !== 'object') continue;
            const name = String((entry as any).name ?? (entry as any).key ?? '')
                .trim()
                .toLowerCase();
            if (!name) continue;
            if (name === 'requestid' || name === 'request_id' || name === 'request-id') {
                const value = (entry as any).value ?? (entry as any).Value ?? (entry as any).val;
                const normalized = normalizeValue(value);
                if (normalized) return normalized;
            }
        }

        return null;
    };

    const extractImprovedText = (response: any): string | null => {
        if (typeof response === 'string') return response.trim() || null;
        // Prefer the Swagger GET payload field.
        const processed =
            response?.processedContent ??
            response?.ProcessedContent ??
            response?.result?.processedContent ??
            response?.result?.ProcessedContent ??
            response?.data?.processedContent ??
            response?.data?.ProcessedContent;
        if (typeof processed === 'string') {
            const trimmed = processed.trim();
            if (trimmed) return trimmed;
        }
        const candidates = [
            response?.bodyOfResume,
            response?.BodyOfResume,
            response?.improvedText,
            response?.text,
            response?.result,
            response?.result?.bodyOfResume,
            response?.result?.BodyOfResume,
            response?.result?.improvedText,
            response?.result?.text,
            response?.data,
            response?.data?.bodyOfResume,
            response?.data?.BodyOfResume,
            response?.data?.text,
        ];
        for (const candidate of candidates) {
            if (typeof candidate === 'string') {
                const trimmed = candidate.trim();
                if (trimmed) return trimmed;
            }
        }
        return null;
    };

    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    const typewriterWords = async (finalText: string, onUpdate: (partial: string) => void) => {
        const normalized = String(finalText ?? '');
        const tokens = normalized.split(/(\s+)/); // keep whitespace tokens
        let acc = '';
        for (const token of tokens) {
            acc += token;
            onUpdate(acc);
            // Faster than real typing but still "chat-like".
            await sleep(/\s+/.test(token) ? 10 : 28);
        }
    };

    const applyTypedSectionText = (section: string, partialText: string) => {
        switch (section) {
            case 'summary':
                setSummary(partialText);
                return;
            case 'jobDescription':
                setJobDescription(partialText);
                return;
            case 'additionalInfo':
                setAdditionalInfo(partialText);
                return;
            case 'experience': {
                setExperiences((prev) => applyExperienceEditText(prev, partialText));
                return;
            }
            case 'skills':
                // Show as a growing list while typing, then the UI will render chips.
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
            case 'languages':
                return formatLanguagesEditText(languages);
            case 'certificates':
                return formatCertificateEditText(certificates);
            case 'jobDescription':
                return jobDescription;
            case 'experience':
                return formatExperienceEditText(experiences);
            case 'additionalInfo':
                return additionalInfo;
            default:
                return '';
        }
    };

    const requestImprovedText = useCallback(
        async (rawText: string): Promise<string> => {
            const text = String(rawText ?? '').trim();
            if (!text) return '';

            const postResponse = await postImproved({
                userId: accessToken ?? undefined,
                lang: 'en',
                paragraph: text,
            });

            const pollingRequestId = extractPollingRequestId(postResponse);
            if (!pollingRequestId) {
                throw new Error('Missing requestId from improve response. Please try again.');
            }

            const start = Date.now();
            const timeoutMs = 45_000;
            const pollIntervalMs = 1_000;

            while (Date.now() - start < timeoutMs) {
                const res = await getImproved({ requestId: pollingRequestId });
                const processedContent =
                    res?.processedContent ??
                    res?.ProcessedContent ??
                    res?.result?.processedContent ??
                    res?.result?.ProcessedContent ??
                    res?.data?.processedContent ??
                    res?.data?.ProcessedContent;
                const improved =
                    (typeof processedContent === 'string' ? processedContent.trim() : null) ?? extractImprovedText(res);
                if (improved) return improved;
                await sleep(pollIntervalMs);
            }

            throw new Error('Improvement is taking too long. Please try again.');
        },
        [accessToken],
    );

    useEffect(() => {
        const apiKey = canFetchCv ? `${accessToken ?? ''}:${requestId ?? ''}` : null;
        const runKey = isTextOnlyMode ? 'text-only' : apiKey ? `api:${apiKey}:${cvLoadedNonce}` : null;
        const shouldRun =
            (isTextOnlyMode && Boolean(loadWizardTextOnlySession())) || (apiKey && cvLoadedKey === apiKey);
        if (!runKey || !shouldRun) return;

        if (autoImproveRunKeyRef.current === runKey) return;
        autoImproveRunKeyRef.current = runKey;

        // Reset pipeline state when we start a new run.
        setAutoImproveIndex(-1);
        setAutoImproved({});
        setAutoImprovePhase('idle');

        const run = async () => {
            try {
                setImproveError(null);
                setAutoImprovePhase('request');

                for (let i = 0; i < AUTO_IMPROVE_ORDER.length; i++) {
                    const section = AUTO_IMPROVE_ORDER[i];
                    setAutoImproveIndex(i);
                    setAutoImprovePhase('request');

                    const raw = getSectionTextForImprove(section);
                    if (!String(raw ?? '').trim()) {
                        setAutoImproved((prev) => ({ ...prev, [section]: true }));
                        continue;
                    }

                    // For Summary we want to show the raw session text first, then replace it once improved arrives.
                    // For other sections we can clear immediately to show skeleton/pending state.
                    if (section !== 'summary') {
                        applyTypedSectionText(section, '');
                    }

                    const improved = await requestImprovedText(raw);

                    setAutoImprovePhase('typing');
                    if (section === 'summary') {
                        // Replace the raw session text with a typed-out improved version.
                        applyTypedSectionText(section, '');
                    }
                    await typewriterWords(improved, (partial) => applyTypedSectionText(section, partial));

                    setAutoImproved((prev) => ({ ...prev, [section]: true }));
                }

                setAutoImprovePhase('done');
            } catch (err) {
                const e = err as any;
                setImproveError(e instanceof Error ? e.message : 'Failed to improve text. Please try again.');
                setAutoImprovePhase('done');
            }
        };

        void run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isTextOnlyMode,
        canFetchCv,
        accessToken,
        requestId,
        cvLoadedKey,
        cvLoadedNonce,
        AUTO_IMPROVE_ORDER,
        requestImprovedText,
    ]);

    const loadCvData = useCallback(async () => {
        if (!requestId || !accessToken) return;

        setIsCvLoading(true);
        setCvError(null);

        try {
            const raw = await getCV({ requestId, userId: accessToken });
            const record = resolveCvRecord(raw);
            if (!record) {
                setCvError('Resume data is empty.');
                cvPayloadRef.current = null;
                setCvLoadedKey(null);
                // Keep profile from session/wizard so refresh doesn't wipe it.
                setBackgroundText('');
                setSummary('');
                setSkills([]);
                setContactWays([]);
                setLanguages([]);
                setCertificates([]);
                setJobDescription('');
                setAdditionalInfo('');
                setExperiences([]);
                return;
            }

            const payload = resolveCvPayload(record);
            cvPayloadRef.current = payload;
            setCvLoadedKey(`${accessToken}:${requestId}`);
            setCvLoadedNonce((prev) => prev + 1);
            const detectedSummary = extractSummary(payload) || extractSummary(record);
            const detectedSkills = extractSkills(payload).length ? extractSkills(payload) : extractSkills(record);
            const detectedContactWays =
                extractContactWays(payload).length > 0 ? extractContactWays(payload) : extractContactWays(record);
            const detectedLanguages =
                extractLanguages(payload).length > 0 ? extractLanguages(payload) : extractLanguages(record);
            const detectedCertificates =
                normalizeCertificates(extractCertificateEntries(payload)).length > 0
                    ? normalizeCertificates(extractCertificateEntries(payload))
                    : normalizeCertificates(extractCertificateEntries(record));
            const detectedJobDescription = extractJobDescriptionText(payload) || extractJobDescriptionText(record);
            const detectedAdditionalInfo = extractAdditionalInfoText(payload) || extractAdditionalInfoText(record);
            const extracted = extractExperienceEntries(payload).length
                ? extractExperienceEntries(payload)
                : extractExperienceEntries(record);
            const normalizedExperiences = ensureMinimumExperiences(normalizeExperiences(extracted));

            // Profile fields should come from session/wizard (NOT get-cv) so they don't change on refresh.
            setBackgroundText(detectedSummary);
            setSummary(detectedSummary);
            setSkills(detectedSkills);
            setContactWays(detectedContactWays);
            setLanguages(detectedLanguages);
            setCertificates(detectedCertificates);
            setJobDescription(detectedJobDescription);
            setAdditionalInfo(detectedAdditionalInfo);
            setExperiences(normalizedExperiences);
        } catch (error) {
            console.error('Failed to load CV preview', error);
            setCvError('Unable to load resume data. Please try again.');
            cvPayloadRef.current = null;
            setCvLoadedKey(null);
        } finally {
            setIsCvLoading(false);
            setHasCvLoadedOnce(true);
        }
    }, [requestId, accessToken]);

    useEffect(() => {
        if (!requestId || !accessToken) return;

        const key = `${accessToken}:${requestId}`;
        if (lastAutoFetchKeyRef.current === key) return;
        lastAutoFetchKeyRef.current = key;

        let cancelled = false;

        const run = async () => {
            try {
                const bodyOfResume = buildWizardSerializable(wizardData);
                await pollCvAnalysisAndCreateCv(requestId, bodyOfResume, accessToken, () => {
                    // Intentionally no-op: ResumeEditor currently doesn't render analysis progress,
                    // but we keep the hook for parity with the backend response.
                });
            } catch {
                // Polling/create is best-effort; we still try to load whatever exists.
            }

            if (cancelled) return;
            await loadCvData();
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [requestId, accessToken, wizardData, loadCvData]);

    // We render immediately (profile from session/wizard), then progressively replace with getCV + auto-improve.
    const shouldBlockResumeRender = false;

    const renderSkeletonParagraph = (lines = 4) => (
        <Stack gap={1} mt={1.5}>
            {Array.from({ length: lines }).map((_, idx) => (
                <Skeleton
                    key={idx}
                    variant='text'
                    height={18}
                    width={idx === lines - 1 ? '72%' : '100%'}
                    sx={{ maxWidth: 720 }}
                />
            ))}
        </Stack>
    );

    const handleEdit = (section: string) => {
        setSaveError(null);
        if (isTextOnlyMode) {
            // Allow editing Summary after it has been improved & revealed (local-only, no API).
            if (section === 'summary' && Boolean(autoImproved.summary)) {
                textOnlySummaryBackupRef.current = summary;
                setEditingSection(section);
                return;
            }
            setSaveError('Editing is disabled in text-only mode.');
            return;
        }
        if (section === 'profile') {
            setProfileEditText(formatProfileEditText(profile));
        }
        if (section === 'skills' && skills.length === 0) {
            setSkills(['']);
        }
        if (section === 'contactWays') {
            setContactWaysEditText(formatLineListEditText(contactWays));
        }
        if (section === 'languages') {
            setLanguagesEditText(formatLanguagesEditText(languages));
        }
        if (section === 'certificates') {
            setCertificatesEditText(formatCertificateEditText(certificates));
        }
        if (section === 'additionalInfo') {
            setAdditionalInfoEditText(additionalInfo);
        }
        if (section === 'experience') {
            setExperienceEditText(formatExperienceEditText(experiences));
        }
        setEditingSection(section);
    };

    const handleSave = async () => {
        if (!editingSection) return;
        if (!requestId) {
            setSaveError('requestId is missing. Please refresh and try again.');
            return;
        }
        if (isTextOnlyMode) {
            // Local-only save for Summary in text-only mode.
            if (editingSection === 'summary' && Boolean(autoImproved.summary)) {
                textOnlySummaryBackupRef.current = null;
                setEditingSection(null);
                return;
            }
            setSaveError('Saving is disabled in text-only mode.');
            return;
        }
        if (isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        const nextProfile = editingSection === 'profile' ? applyProfileEditText(profileEditText) : profile;
        const nextContactWays =
            editingSection === 'contactWays' ? applyLineListEditText(contactWaysEditText) : contactWays;
        const nextLanguages = editingSection === 'languages' ? applyLanguagesEditText(languagesEditText) : languages;
        const nextCertificates =
            editingSection === 'certificates' ? applyCertificateEditText(certificatesEditText) : certificates;
        const nextAdditionalInfo = editingSection === 'additionalInfo' ? additionalInfoEditText : additionalInfo;
        const nextExperiences =
            editingSection === 'experience' ? applyExperienceEditText(experiences, experienceEditText) : experiences;
        const normalizedSkills = skills.map((s) => String(s ?? '').trim()).filter(Boolean);
        const normalizedContactWays = nextContactWays.map((c) => String(c ?? '').trim()).filter(Boolean);

        // Apply local state updates (optimistic)
        if (editingSection === 'profile') setProfile(nextProfile);
        if (editingSection === 'contactWays') setContactWays(normalizedContactWays);
        if (editingSection === 'languages') setLanguages(nextLanguages);
        if (editingSection === 'certificates') setCertificates(nextCertificates);
        if (editingSection === 'additionalInfo') setAdditionalInfo(nextAdditionalInfo);
        if (editingSection === 'experience') setExperiences(nextExperiences);

        const updatedPayload = buildUpdatedCvPayload(cvPayloadRef.current, {
            profile: nextProfile,
            summary,
            skills: normalizedSkills,
            contactWays: normalizedContactWays,
            languages: nextLanguages,
            certificates: nextCertificates,
            jobDescription,
            additionalInfo: nextAdditionalInfo,
            experiences: nextExperiences,
        });

        try {
            await editCV({
                userId: accessToken,
                requestId,
                bodyOfResume: updatedPayload,
            });

            await loadCvData();
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
        if (isTextOnlyMode && editingSection === 'summary' && textOnlySummaryBackupRef.current !== null) {
            setSummary(textOnlySummaryBackupRef.current);
            textOnlySummaryBackupRef.current = null;
        }
        setEditingSection(null);
    };

    const handleSkillsChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

    const handleImprove = useCallback(
        async (section: string) => {
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

            const getSectionText = () => {
                switch (section) {
                    case 'summary':
                        return summary;
                    case 'skills':
                        return formatLineListEditText(skills);
                    case 'contactWays':
                        return formatLineListEditText(contactWays);
                    case 'languages':
                        return formatLanguagesEditText(languages);
                    case 'certificates':
                        return formatCertificateEditText(certificates);
                    case 'jobDescription':
                        return jobDescription;
                    case 'experience':
                        return formatExperienceEditText(experiences);
                    case 'additionalInfo':
                        return additionalInfo;
                    default:
                        return '';
                }
            };

            const applyToSection = (text: string) => {
                switch (section) {
                    case 'summary':
                        setSummary(text);
                        return;
                    case 'skills':
                        setSkills(applyLineListEditText(text));
                        return;
                    case 'contactWays':
                        setContactWays(applyLineListEditText(text));
                        return;
                    case 'languages': {
                        const next = applyLanguagesEditText(text);
                        setLanguages(next);
                        return;
                    }
                    case 'certificates':
                        setCertificates(applyCertificateEditText(text));
                        return;
                    case 'jobDescription':
                        setJobDescription(text);
                        return;
                    case 'experience': {
                        const nextExperiences = applyExperienceEditText(experiences, text);
                        setExperiences(nextExperiences);
                        setExperienceEditText(formatExperienceEditText(nextExperiences));
                        return;
                    }
                    case 'additionalInfo':
                        setAdditionalInfo(text);
                        return;
                }
            };

            try {
                const currentText = getSectionText();
                if (!String(currentText ?? '').trim()) {
                    throw new Error('Nothing to improve for this section.');
                }

                const postResponse = await postImproved({
                    userId: accessToken ?? undefined,
                    lang: 'en',
                    paragraph: String(currentText),
                });

                const pollingRequestId = extractPollingRequestId(postResponse) ?? requestId;
                if (!pollingRequestId) {
                    throw new Error('Missing requestId from improve response. Please try again.');
                }

                const start = Date.now();
                const timeoutMs = 30_000;
                const pollIntervalMs = 1_000;

                let improved: string | null = null;
                while (Date.now() - start < timeoutMs) {
                    const res = await getImproved({ requestId: pollingRequestId });
                    // The GET endpoint returns the improved text as `processedContent` (Swagger).
                    const processedContent =
                        res?.processedContent ??
                        res?.ProcessedContent ??
                        res?.result?.processedContent ??
                        res?.result?.ProcessedContent ??
                        res?.data?.processedContent ??
                        res?.data?.ProcessedContent;
                    improved =
                        (typeof processedContent === 'string' ? processedContent.trim() : null) ??
                        extractImprovedText(res);
                    if (improved) break;
                    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
                }

                if (!improved) {
                    throw new Error('Improvement is taking too long. Please try again.');
                }

                applyToSection(improved);
            } catch (error) {
                console.error('Failed to improve section', error);
                setImproveError(error instanceof Error ? error.message : 'Failed to improve text. Please try again.');
            } finally {
                setImprovingSection(null);
            }
        },
        [
            accessToken,
            additionalInfo,
            certificates,
            contactWays,
            experiences,
            extractPollingRequestId,
            improvingSection,
            jobDescription,
            languages,
            requestId,
            skills,
            summary,
            isTextOnlyMode,
        ],
    );

    const handleDownloadPdf = useCallback(async () => {
        if (!pdfRef.current || isDownloading) return;

        setIsDownloading(true);
        setIsExporting(true);
        setDownloadError(null);
        setDownloadProgress(0);

        try {
            // Allow React to re-render (hide edit actions) before html2canvas captures the DOM.
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

            const baseName = `Resume-${requestId ?? new Date().toISOString().slice(0, 10)}`;
            await exportElementToPdf(pdfRef.current, {
                fileName: baseName,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
                // UX: don't yank the user into a new tab while downloading.
                preOpenWindow: false,
            });
        } catch (error) {
            console.error('Failed to export resume PDF', error);
            setDownloadError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
            setIsDownloading(false);
        }
    }, [isDownloading, requestId]);

    return (
        <ResumeContainer>
            <MainCardContainer ref={pdfRef}>
                <CardContent>
                    {shouldBlockResumeRender ? (
                        <Box
                            sx={{
                                minHeight: 520,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1.5,
                                px: 2,
                            }}
                        >
                            <CircularProgress size={28} />
                            <Typography variant='body2' color='text.secondary' textAlign='center'>
                                Loading your resume…
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <ProfileHeader
                                fullName={profile.fullName}
                                dateOfBirth={profile.dateOfBirth}
                                headline={profile.headline}
                                isEditing={!isPreview && editingSection === 'profile'}
                                onEdit={isPreview ? undefined : () => handleEdit('profile')}
                                onSave={isPreview ? undefined : handleSave}
                                onCancel={isPreview ? undefined : handleCancel}
                                editText={profileEditText}
                                onEditTextChange={isPreview ? undefined : setProfileEditText}
                                hideActions={isExporting || isPreview || isTextOnlyMode}
                            />
                            {isCvLoading && (
                                <Typography variant='caption' color='text.secondary' mt={1}>
                                    Still fetching the latest CV preview…
                                </Typography>
                            )}
                            {cvError && (
                                <Typography variant='caption' color='error' mt={1}>
                                    {cvError}
                                </Typography>
                            )}
                            {saveError && <MuiAlert severity='error' message={saveError} />}
                            {improveError && <MuiAlert severity='error' message={improveError} />}
                            {downloadError && <MuiAlert severity='error' message={downloadError} />}

                            <SectionContainer>
                                <SectionHeader title='Background' hideActions />
                                <SummaryContainer>
                                    {isPreCvLoading && !backgroundText.trim() ? (
                                        renderSkeletonParagraph(5)
                                    ) : backgroundText ? (
                                        <SummaryText sx={{ whiteSpace: 'pre-line' }}>{backgroundText}</SummaryText>
                                    ) : (
                                        <Typography variant='body2' color='text.secondary'>
                                            No background found.
                                        </Typography>
                                    )}
                                </SummaryContainer>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Summary'
                                    onEdit={isPreview ? undefined : () => handleEdit('summary')}
                                    onImprove={
                                        isPreview || isTextOnlyMode ? undefined : () => void handleImprove('summary')
                                    }
                                    isEditing={!isPreview && editingSection === 'summary'}
                                    isImproving={!isPreview && improvingSection === 'summary'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'summary'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    // Text-only: show actions only AFTER summary has been improved (before that show skeleton).
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.summary))
                                    }
                                    actionsSkeleton={shouldSkeletonActions('summary')}
                                />
                                <SummaryContainer>
                                    {/* Text-only: show raw session text immediately; no skeleton for Summary. */}
                                    {!isPreview && editingSection === 'summary' ? (
                                        <StyledTextareaAutosize
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                        />
                                    ) : isPreCvLoading && !summary.trim() ? (
                                        renderSkeletonParagraph(5)
                                    ) : shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(5)
                                    ) : (
                                        <SummaryText>{summary}</SummaryText>
                                    )}
                                </SummaryContainer>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Skills'
                                    onEdit={isPreview || isTextOnlyMode ? undefined : () => handleEdit('skills')}
                                    onImprove={
                                        isPreview || isTextOnlyMode ? undefined : () => void handleImprove('skills')
                                    }
                                    isEditing={!isPreview && editingSection === 'skills'}
                                    isImproving={!isPreview && improvingSection === 'skills'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'skills'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.skills))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('skills')}
                                />
                                <SkillsContainer>
                                    {shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(3)
                                    ) : isAutoPipelineMode && shouldSkeletonSection('skills') ? (
                                        renderSkeletonParagraph(3)
                                    ) : skills.length === 0 ? (
                                        <Typography variant='body2' color='text.secondary'>
                                            No skills found.
                                        </Typography>
                                    ) : !isPreview && editingSection === 'skills' ? (
                                        skills.map((skill, index) => (
                                            <SkillTextField
                                                key={index}
                                                value={skill}
                                                onChange={(e) => handleSkillsChange(index, e.target.value)}
                                                size='small'
                                            />
                                        ))
                                    ) : (
                                        skills.map((skill, index) => (
                                            <MuiChips key={`${skill}-${index}`} label={skill} sx={{ mt: 0 }} />
                                        ))
                                    )}
                                </SkillsContainer>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Contact'
                                    onEdit={isPreview || isTextOnlyMode ? undefined : () => handleEdit('contactWays')}
                                    onImprove={
                                        isPreview || isTextOnlyMode
                                            ? undefined
                                            : () => void handleImprove('contactWays')
                                    }
                                    isEditing={!isPreview && editingSection === 'contactWays'}
                                    isImproving={!isPreview && improvingSection === 'contactWays'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'contactWays'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.contactWays))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('contactWays')}
                                />
                                <Box mt={2}>
                                    {shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(3)
                                    ) : isAutoPipelineMode && shouldSkeletonSection('contactWays') ? (
                                        renderSkeletonParagraph(3)
                                    ) : !isPreview && editingSection === 'contactWays' ? (
                                        <ExperienceTextareaAutosize
                                            value={contactWaysEditText}
                                            onChange={(e) => setContactWaysEditText(e.target.value)}
                                        />
                                    ) : contactWays.length === 0 ? (
                                        <Typography variant='body2' color='text.secondary'>
                                            No contact methods found.
                                        </Typography>
                                    ) : (
                                        <Box>
                                            {contactWays.map((text, idx) => (
                                                <SummaryText key={idx} sx={{ mt: idx === 0 ? 0 : 1.5 }}>
                                                    {text}
                                                </SummaryText>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Languages'
                                    onEdit={isPreview || isTextOnlyMode ? undefined : () => handleEdit('languages')}
                                    onImprove={
                                        isPreview || isTextOnlyMode ? undefined : () => void handleImprove('languages')
                                    }
                                    isEditing={!isPreview && editingSection === 'languages'}
                                    isImproving={!isPreview && improvingSection === 'languages'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'languages'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.languages))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('languages')}
                                />
                                <Box mt={2}>
                                    {shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(3)
                                    ) : isAutoPipelineMode && shouldSkeletonSection('languages') ? (
                                        renderSkeletonParagraph(3)
                                    ) : !isPreview && editingSection === 'languages' ? (
                                        <ExperienceTextareaAutosize
                                            value={languagesEditText}
                                            onChange={(e) => setLanguagesEditText(e.target.value)}
                                        />
                                    ) : languages.length === 0 ? (
                                        <Typography variant='body2' color='text.secondary'>
                                            No languages found.
                                        </Typography>
                                    ) : (
                                        <Box>
                                            {languages.map((lang, idx) => (
                                                <SummaryText key={lang.id} sx={{ mt: idx === 0 ? 0 : 1.5 }}>
                                                    {lang.name}
                                                    {lang.level ? ` - ${lang.level}` : ''}
                                                </SummaryText>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Certificates'
                                    onEdit={isPreview || isTextOnlyMode ? undefined : () => handleEdit('certificates')}
                                    onImprove={
                                        isPreview || isTextOnlyMode
                                            ? undefined
                                            : () => void handleImprove('certificates')
                                    }
                                    isEditing={!isPreview && editingSection === 'certificates'}
                                    isImproving={!isPreview && improvingSection === 'certificates'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'certificates'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.certificates))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('certificates')}
                                />
                                <Box mt={2}>
                                    {shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(3)
                                    ) : isAutoPipelineMode && shouldSkeletonSection('certificates') ? (
                                        renderSkeletonParagraph(3)
                                    ) : !isPreview && editingSection === 'certificates' ? (
                                        <ExperienceTextareaAutosize
                                            value={certificatesEditText}
                                            onChange={(e) => setCertificatesEditText(e.target.value)}
                                        />
                                    ) : certificates.length === 0 ? (
                                        <Typography variant='body2' color='text.secondary'>
                                            No certificates found.
                                        </Typography>
                                    ) : (
                                        <Box>
                                            {certificates.map((text, idx) => (
                                                <SummaryText key={idx} sx={{ mt: idx === 0 ? 0 : 1.5 }}>
                                                    {text}
                                                </SummaryText>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </SectionContainer>

                            <SectionContainer>
                                <SectionHeader
                                    title='Job Description'
                                    onEdit={
                                        isPreview || isTextOnlyMode ? undefined : () => handleEdit('jobDescription')
                                    }
                                    onImprove={
                                        isPreview || isTextOnlyMode
                                            ? undefined
                                            : () => void handleImprove('jobDescription')
                                    }
                                    isEditing={!isPreview && editingSection === 'jobDescription'}
                                    isImproving={!isPreview && improvingSection === 'jobDescription'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'jobDescription'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.jobDescription))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('jobDescription')}
                                />
                                <SummaryContainer>
                                    {shouldBlockBelowSummary ? (
                                        renderSkeletonParagraph(4)
                                    ) : isAutoPipelineMode && shouldSkeletonSection('jobDescription') ? (
                                        renderSkeletonParagraph(4)
                                    ) : !isPreview && editingSection === 'jobDescription' ? (
                                        <StyledTextareaAutosize
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                        />
                                    ) : jobDescription ? (
                                        <SummaryText>{jobDescription}</SummaryText>
                                    ) : (
                                        <Typography variant='body2' color='text.secondary'>
                                            No job description found.
                                        </Typography>
                                    )}
                                </SummaryContainer>
                            </SectionContainer>

                            <ExperienceContainer>
                                <SectionHeader
                                    title='Experience'
                                    onEdit={isPreview || isTextOnlyMode ? undefined : () => handleEdit('experience')}
                                    onImprove={
                                        isPreview || isTextOnlyMode ? undefined : () => void handleImprove('experience')
                                    }
                                    isEditing={!isPreview && editingSection === 'experience'}
                                    isImproving={!isPreview && improvingSection === 'experience'}
                                    improveDisabled={Boolean(improvingSection) && improvingSection !== 'experience'}
                                    onSave={isPreview ? undefined : handleSave}
                                    onCancel={isPreview ? undefined : handleCancel}
                                    hideActions={
                                        isExporting ||
                                        isPreview ||
                                        isTextOnlyMode ||
                                        shouldBlockBelowSummary ||
                                        (isAutoPipelineMode && !Boolean(autoImproved.experience))
                                    }
                                    actionsSkeleton={shouldBlockBelowSummary || shouldSkeletonActions('experience')}
                                />
                                {shouldBlockBelowSummary ? (
                                    renderSkeletonParagraph(5)
                                ) : isAutoPipelineMode && shouldSkeletonSection('experience') ? (
                                    renderSkeletonParagraph(5)
                                ) : !isPreview && editingSection === 'experience' ? (
                                    <ExperienceTextareaAutosize
                                        value={experienceEditText}
                                        onChange={(e) => setExperienceEditText(e.target.value)}
                                    />
                                ) : (
                                    experiences
                                        .filter((exp) =>
                                            [exp.company, exp.position, exp.description].some(
                                                (v) => String(v ?? '').trim().length > 0,
                                            ),
                                        )
                                        .map((experience, index) => {
                                            const Wrapper = index === 0 ? ExperienceItem : ExperienceItemSmall;

                                            return (
                                                <Wrapper key={experience.id}>
                                                    {(experience.company || experience.position) && (
                                                        <Box mb={1}>
                                                            {experience.company && (
                                                                <CompanyName variant='h6'>
                                                                    {experience.company}
                                                                </CompanyName>
                                                            )}
                                                            {experience.position && (
                                                                <JobDetails variant='body2'>
                                                                    {experience.position}
                                                                </JobDetails>
                                                            )}
                                                        </Box>
                                                    )}
                                                    {experience.description && (
                                                        <ExperienceDescription variant='body2'>
                                                            {experience.description}
                                                        </ExperienceDescription>
                                                    )}
                                                </Wrapper>
                                            );
                                        })
                                )}
                            </ExperienceContainer>

                            {(shouldBlockBelowSummary ||
                                isTextOnlyMode ||
                                additionalInfo.trim().length > 0 ||
                                editingSection === 'additionalInfo') && (
                                <SectionContainer>
                                    <SectionHeader
                                        title='Additional Info'
                                        onEdit={
                                            isPreview || isTextOnlyMode ? undefined : () => handleEdit('additionalInfo')
                                        }
                                        isEditing={!isPreview && editingSection === 'additionalInfo'}
                                        onImprove={
                                            isPreview || isTextOnlyMode
                                                ? undefined
                                                : () => void handleImprove('additionalInfo')
                                        }
                                        isImproving={!isPreview && improvingSection === 'additionalInfo'}
                                        improveDisabled={
                                            Boolean(improvingSection) && improvingSection !== 'additionalInfo'
                                        }
                                        onSave={isPreview ? undefined : handleSave}
                                        onCancel={isPreview ? undefined : handleCancel}
                                        hideActions={
                                            isExporting ||
                                            isPreview ||
                                            isTextOnlyMode ||
                                            shouldBlockBelowSummary ||
                                            (isAutoPipelineMode && !Boolean(autoImproved.additionalInfo))
                                        }
                                        actionsSkeleton={
                                            shouldBlockBelowSummary || shouldSkeletonActions('additionalInfo')
                                        }
                                    />
                                    <Box mt={2}>
                                        {shouldBlockBelowSummary ? (
                                            renderSkeletonParagraph(4)
                                        ) : isAutoPipelineMode && shouldSkeletonSection('additionalInfo') ? (
                                            renderSkeletonParagraph(4)
                                        ) : !isPreview && editingSection === 'additionalInfo' ? (
                                            <ExperienceTextareaAutosize
                                                value={additionalInfoEditText}
                                                onChange={(e) => setAdditionalInfoEditText(e.target.value)}
                                            />
                                        ) : (
                                            <SummaryText sx={{ whiteSpace: 'pre-line' }}>{additionalInfo}</SummaryText>
                                        )}
                                    </Box>
                                </SectionContainer>
                            )}
                        </>
                    )}
                </CardContent>
            </MainCardContainer>

            {!isPreview ? (
                <FooterContainer>
                    {/*<MuiButton*/}
                    {/*    text='Back'*/}
                    {/*    variant='outlined'*/}
                    {/*    color='secondary'*/}
                    {/*    size='large'*/}
                    {/*    startIcon={<ArrowBackIcon />}*/}
                    {/*    onClick={() => setActiveStep(2)}*/}
                    {/*/>*/}

                    <MuiButton
                        color='secondary'
                        size='large'
                        variant='outlined'
                        text={isDownloading ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%` : 'Download PDF'}
                        loading={isDownloading}
                        disabled={Boolean(cvError)}
                        startIcon={<DownloadRoundedIcon />}
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void handleDownloadPdf();
                        }}
                        sx={{ width: '188px' }}
                    />

                    <MuiButton
                        color='secondary'
                        size='large'
                        variant='contained'
                        text='Submit'
                        onClick={() => setStage('MORE_FEATURES')}
                        sx={{ width: '188px' }}
                    />
                </FooterContainer>
            ) : null}
        </ResumeContainer>
    );
};

export default ResumeEditor;
