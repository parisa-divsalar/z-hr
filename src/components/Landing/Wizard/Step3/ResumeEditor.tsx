'use client';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';

import { Box, CardContent, Typography } from '@mui/material';

import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { editCV } from '@/services/cv/edit-cv';
import { getCV } from '@/services/cv/get-cv';
import { getImproved } from '@/services/cv/get-improved';
import { postImproved } from '@/services/cv/post-improved';
import { useAuthStore } from '@/store/auth';
import { useWizardStore } from '@/store/wizard';
import { exportElementToPdf } from '@/utils/exportToPdf';

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
    SkillItem,
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
        payload.birthDate ??
        payload.dob ??
        payload.profile?.dateOfBirth ??
        payload.profile?.birthDate ??
        payload.profile?.dob ??
        payload.personal?.dateOfBirth ??
        payload.personal?.birthDate ??
        payload.personal?.dob ??
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
    const candidate = Array.isArray(raw) ? raw[0] : raw;
    if (!candidate || typeof candidate !== 'object') return null;
    return (candidate as any).result ?? (candidate as any).data ?? candidate;
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
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = (props) => {
    const { setStage, setActiveStep } = props;
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const requestId = useWizardStore((state) => state.requestId);
    const accessToken = useAuthStore((state) => state.accessToken);
    const pdfRef = useRef<HTMLDivElement | null>(null);
    const cvPayloadRef = useRef<any>(null);
    /**
     * Prevent duplicate auto-fetches (especially in React Strict Mode dev where effects run twice).
     * We still allow manual refresh via the "Refresh" handler.
     */
    const lastAutoFetchKeyRef = useRef<string | null>(null);

    const [profile, setProfile] = useState<ResumeProfile>(createEmptyProfile());
    const [profileEditText, setProfileEditText] = useState('');
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
    const [cvError, setCvError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [improvingSection, setImprovingSection] = useState<string | null>(null);
    const [improveError, setImproveError] = useState<string | null>(null);

    const normalizeValue = (value: unknown): string | null => {
        if (value === null || value === undefined) return null;
        const str = String(value).trim();
        if (!str) return null;
        if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
        return str;
    };

    const extractPollingRequestId = (response: any): string | null => {
        const direct =
            response?.RequestId ??
            response?.requestId ??
            response?.requestID ??
            response?.result?.RequestId ??
            response?.result?.requestId ??
            response?.data?.RequestId ??
            response?.data?.requestId;
        return normalizeValue(direct);
    };

    const extractImprovedText = (response: any): string | null => {
        if (typeof response === 'string') return response.trim() || null;
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
                setProfile(createEmptyProfile());
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

            setProfile({
                fullName: extractFullName(payload) || extractFullName(record),
                dateOfBirth: extractDateOfBirth(payload) || extractDateOfBirth(record),
                headline: extractHeadline(payload) || extractHeadline(record),
            });
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
        } finally {
            setIsCvLoading(false);
        }
    }, [requestId, accessToken]);

    useEffect(() => {
        if (!requestId || !accessToken) return;

        const key = `${accessToken}:${requestId}`;
        if (lastAutoFetchKeyRef.current === key) return;
        lastAutoFetchKeyRef.current = key;

        void loadCvData();
    }, [requestId, accessToken, loadCvData]);

    const handleEdit = (section: string) => {
        setSaveError(null);
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
                    improved = extractImprovedText(res);
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
        ],
    );

    const handleDownloadPdf = useCallback(async () => {
        if (!pdfRef.current || isDownloading) return;

        setIsDownloading(true);
        setDownloadError(null);
        setDownloadProgress(0);

        try {
            const baseName = `Resume-${requestId ?? new Date().toISOString().slice(0, 10)}`;
            await exportElementToPdf(pdfRef.current, {
                fileName: baseName,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
            });
        } catch (error) {
            console.error('Failed to export resume PDF', error);
            setDownloadError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading, requestId]);

    return (
        <ResumeContainer>
            <MainCardContainer ref={pdfRef}>
                <CardContent>
                    <ProfileHeader
                        fullName={profile.fullName}
                        dateOfBirth={profile.dateOfBirth}
                        headline={profile.headline}
                        isEditing={editingSection === 'profile'}
                        onEdit={() => handleEdit('profile')}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        editText={profileEditText}
                        onEditTextChange={setProfileEditText}
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
                        <SectionHeader
                            title='Summary'
                            onEdit={() => handleEdit('summary')}
                            onImprove={() => void handleImprove('summary')}
                            isEditing={editingSection === 'summary'}
                            isImproving={improvingSection === 'summary'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'summary'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <SummaryContainer>
                            {editingSection === 'summary' ? (
                                <StyledTextareaAutosize value={summary} onChange={(e) => setSummary(e.target.value)} />
                            ) : (
                                <SummaryText>{summary}</SummaryText>
                            )}
                        </SummaryContainer>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionHeader
                            title='Skills'
                            onEdit={() => handleEdit('skills')}
                            onImprove={() => void handleImprove('skills')}
                            isEditing={editingSection === 'skills'}
                            isImproving={improvingSection === 'skills'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'skills'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <SkillsContainer>
                            {skills.length === 0 ? (
                                <Typography variant='body2' color='text.secondary'>
                                    No skills found.
                                </Typography>
                            ) : editingSection === 'skills' ? (
                                skills.map((skill, index) => (
                                    <SkillTextField
                                        key={index}
                                        value={skill}
                                        onChange={(e) => handleSkillsChange(index, e.target.value)}
                                        size='small'
                                    />
                                ))
                            ) : (
                                skills.map((skill, index) => <SkillItem key={index}>{skill}</SkillItem>)
                            )}
                        </SkillsContainer>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionHeader
                            title='Contact'
                            onEdit={() => handleEdit('contactWays')}
                            onImprove={() => void handleImprove('contactWays')}
                            isEditing={editingSection === 'contactWays'}
                            isImproving={improvingSection === 'contactWays'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'contactWays'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <Box mt={2}>
                            {editingSection === 'contactWays' ? (
                                <ExperienceTextareaAutosize
                                    value={contactWaysEditText}
                                    onChange={(e) => setContactWaysEditText(e.target.value)}
                                />
                            ) : contactWays.length === 0 ? (
                                <Typography variant='body2' color='text.secondary'>
                                    No contact methods found.
                                </Typography>
                            ) : (
                                <SkillsContainer>
                                    {contactWays.map((item, idx) => (
                                        <SkillItem key={idx}>{item}</SkillItem>
                                    ))}
                                </SkillsContainer>
                            )}
                        </Box>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionHeader
                            title='Languages'
                            onEdit={() => handleEdit('languages')}
                            onImprove={() => void handleImprove('languages')}
                            isEditing={editingSection === 'languages'}
                            isImproving={improvingSection === 'languages'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'languages'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <Box mt={2}>
                            {editingSection === 'languages' ? (
                                <ExperienceTextareaAutosize
                                    value={languagesEditText}
                                    onChange={(e) => setLanguagesEditText(e.target.value)}
                                />
                            ) : languages.length === 0 ? (
                                <Typography variant='body2' color='text.secondary'>
                                    No languages found.
                                </Typography>
                            ) : (
                                <SkillsContainer>
                                    {languages.map((lang) => (
                                        <SkillItem key={lang.id}>
                                            {lang.name}
                                            {lang.level ? ` - ${lang.level}` : ''}
                                        </SkillItem>
                                    ))}
                                </SkillsContainer>
                            )}
                        </Box>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionHeader
                            title='Certificates'
                            onEdit={() => handleEdit('certificates')}
                            onImprove={() => void handleImprove('certificates')}
                            isEditing={editingSection === 'certificates'}
                            isImproving={improvingSection === 'certificates'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'certificates'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <Box mt={2}>
                            {editingSection === 'certificates' ? (
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
                            onEdit={() => handleEdit('jobDescription')}
                            onImprove={() => void handleImprove('jobDescription')}
                            isEditing={editingSection === 'jobDescription'}
                            isImproving={improvingSection === 'jobDescription'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'jobDescription'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        <SummaryContainer>
                            {editingSection === 'jobDescription' ? (
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
                            onEdit={() => handleEdit('experience')}
                            onImprove={() => void handleImprove('experience')}
                            isEditing={editingSection === 'experience'}
                            isImproving={improvingSection === 'experience'}
                            improveDisabled={Boolean(improvingSection) && improvingSection !== 'experience'}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                        {editingSection === 'experience' ? (
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
                                                        <CompanyName variant='h6'>{experience.company}</CompanyName>
                                                    )}
                                                    {experience.position && (
                                                        <JobDetails variant='body2'>{experience.position}</JobDetails>
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

                    {(additionalInfo.trim().length > 0 || editingSection === 'additionalInfo') && (
                        <SectionContainer>
                            <SectionHeader
                                title='Additional Info'
                                onEdit={() => handleEdit('additionalInfo')}
                                isEditing={editingSection === 'additionalInfo'}
                                onImprove={() => void handleImprove('additionalInfo')}
                                isImproving={improvingSection === 'additionalInfo'}
                                improveDisabled={Boolean(improvingSection) && improvingSection !== 'additionalInfo'}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />
                            <Box mt={2}>
                                {editingSection === 'additionalInfo' ? (
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
                </CardContent>
            </MainCardContainer>

            <FooterContainer>
                <MuiButton
                    text='Back'
                    variant='outlined'
                    color='secondary'
                    size='large'
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setActiveStep(2)}
                />

                <MuiButton
                    color='secondary'
                    size='large'
                    variant='outlined'
                    text={isDownloading ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%` : 'Download PDF'}
                    loading={isDownloading}
                    disabled={Boolean(cvError)}
                    onClick={handleDownloadPdf}
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
        </ResumeContainer>
    );
};

export default ResumeEditor;
