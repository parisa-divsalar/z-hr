'use client';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';

import { Box, CardContent, Typography } from '@mui/material';

import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { getCV } from '@/services/cv/get-cv';
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

    // Remove trailing completely empty items (keeps UX clean in view mode)
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);

    const loadCvData = useCallback(async () => {
        if (!requestId || !accessToken) return;

        setIsCvLoading(true);
        setCvError(null);

        try {
            const raw = await getCV({ requestId, userId: accessToken });
            const record = resolveCvRecord(raw);
            if (!record) {
                setCvError('Resume data is empty.');
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

    const handleSave = () => {
        if (editingSection === 'profile') {
            setProfile(applyProfileEditText(profileEditText));
        }
        if (editingSection === 'contactWays') {
            setContactWays(applyLineListEditText(contactWaysEditText));
        }
        if (editingSection === 'languages') {
            setLanguages(applyLanguagesEditText(languagesEditText));
        }
        if (editingSection === 'certificates') {
            setCertificates(applyCertificateEditText(certificatesEditText));
        }
        if (editingSection === 'additionalInfo') {
            setAdditionalInfo(additionalInfoEditText);
        }
        if (editingSection === 'experience') {
            setExperiences((prev) => applyExperienceEditText(prev, experienceEditText));
        }
        setEditingSection(null);
    };

    const handleCancel = () => {
        setEditingSection(null);
    };

    const handleSkillsChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);
    };

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
                    {downloadError && <MuiAlert severity='error' message={downloadError} />}

                    <SectionContainer>
                        <SectionHeader
                            title='Summary'
                            onEdit={() => handleEdit('summary')}
                            isEditing={editingSection === 'summary'}
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
                            isEditing={editingSection === 'skills'}
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
                            isEditing={editingSection === 'contactWays'}
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
                            isEditing={editingSection === 'languages'}
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
                            isEditing={editingSection === 'certificates'}
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
                                        <Typography
                                            key={idx}
                                            variant='body2'
                                            color='text.primary'
                                            mt={idx === 0 ? 0 : 1.5}
                                        >
                                            {text}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </SectionContainer>

                    <SectionContainer>
                        <SectionHeader
                            title='Job Description'
                            onEdit={() => handleEdit('jobDescription')}
                            isEditing={editingSection === 'jobDescription'}
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
                            isEditing={editingSection === 'experience'}
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
