'use client';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import { Box, CardContent, IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';
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
    ExperienceHeader,
    CompanyName,
    JobDetails,
    ExperienceActions,
    ExperienceDescription,
    SkillTextField,
    CompanyTextField,
    PositionTextField,
    StyledTextareaAutosize,
    ExperienceTextareaAutosize,
} from './ResumeEditor/styled';

type ResumeExperience = {
    id: number;
    company: string;
    position: string;
    description: string;
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

const ensureMinimumExperiences = (items: ResumeExperience[], minCount = 2): ResumeExperience[] => {
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
    const title = payload.title ?? payload.position ?? payload.mainSkill ?? payload.profile?.title ?? payload.profile?.position ?? '';
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

    const [profile, setProfile] = useState<ResumeProfile>(createEmptyProfile());
    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [experiences, setExperiences] = useState<ResumeExperience[]>(ensureMinimumExperiences([]));
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
                setExperiences(ensureMinimumExperiences([]));
                return;
            }

            const payload = resolveCvPayload(record);
            const detectedSummary = extractSummary(payload) || extractSummary(record);
            const detectedSkills = extractSkills(payload).length ? extractSkills(payload) : extractSkills(record);
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
            setExperiences(normalizedExperiences);
        } catch (error) {
            console.error('Failed to load CV preview', error);
            setCvError('Unable to load resume data. Please try again.');
        } finally {
            setIsCvLoading(false);
        }
    }, [requestId, accessToken]);

    const handleRefreshPreview = useCallback(() => {
        void loadCvData();
    }, [loadCvData]);

    useEffect(() => {
        loadCvData();
    }, [loadCvData]);

    const handleEdit = (section: string) => {
        if (section === 'skills' && skills.length === 0) {
            setSkills(['']);
        }
        setEditingSection(section);
    };

    const handleSave = () => {
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

    const handleExperienceChange = (id: number, field: string, value: string) => {
        setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
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

                    <ExperienceContainer>
                        <SectionHeader title='Experience' />
                        {experiences.map((experience, index) => {
                            const key = `experience-${experience.id}`;
                            const isEditing = editingSection === key;
                            const Wrapper = index === 0 ? ExperienceItem : ExperienceItemSmall;

                            return (
                                <Wrapper key={experience.id}>
                                    <ExperienceHeader>
                                        <Box>
                                            {isEditing ? (
                                                <>
                                                    <CompanyTextField
                                                        value={experience.company}
                                                        onChange={(e) =>
                                                            handleExperienceChange(experience.id, 'company', e.target.value)
                                                        }
                                                        variant='standard'
                                                        fullWidth
                                                    />
                                                    <PositionTextField
                                                        value={experience.position}
                                                        onChange={(e) =>
                                                            handleExperienceChange(experience.id, 'position', e.target.value)
                                                        }
                                                        variant='standard'
                                                        size='small'
                                                        fullWidth
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <CompanyName variant='h6'>{experience.company || '—'}</CompanyName>
                                                    <JobDetails variant='body2'>{experience.position || '—'}</JobDetails>
                                                </>
                                            )}
                                        </Box>
                                        <ExperienceActions>
                                            {isEditing ? (
                                                <>
                                                    <IconButton size='small' onClick={handleSave} color='success'>
                                                        <Check fontSize='small' />
                                                    </IconButton>
                                                    <IconButton size='small' onClick={handleCancel} color='error'>
                                                        <Close fontSize='small' />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton size='small' onClick={() => handleEdit(key)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size='small' onClick={handleRefreshPreview}>
                                                        <RefreshIcon />
                                                    </IconButton>
                                                    <IconButton size='small'>
                                                        <StarIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </ExperienceActions>
                                    </ExperienceHeader>
                                    {isEditing ? (
                                        <ExperienceTextareaAutosize
                                            value={experience.description}
                                            onChange={(e) =>
                                                handleExperienceChange(experience.id, 'description', e.target.value)
                                            }
                                        />
                                    ) : (
                                        <ExperienceDescription variant='body2'>{experience.description || '—'}</ExperienceDescription>
                                    )}
                                </Wrapper>
                            );
                        })}
                    </ExperienceContainer>
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
