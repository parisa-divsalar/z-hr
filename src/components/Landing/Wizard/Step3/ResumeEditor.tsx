'use client';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import { Box, CardContent, IconButton, Typography } from '@mui/material';

import EditIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';
import MuiButton from '@/components/UI/MuiButton';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';
import { useWizardStore } from '@/store/wizard';

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

const createEmptyExperience = (id: number): ResumeExperience => ({
    id,
    company: '',
    position: '',
    description: '',
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

const ensureTwoExperiences = (items: ResumeExperience[]): ResumeExperience[] => {
    const trimmed = items.slice(0, 2);
    while (trimmed.length < 2) {
        trimmed.push(createEmptyExperience(trimmed.length + 1));
    }
    return trimmed.map((item, index) => ({ ...item, id: index + 1 }));
};

const DEFAULT_SUMMARY =
    "I'm a highly skilled front-end developer with 12 years of experience based in Dubai. Over the years, I've worked on numerous projects, honing my skills in HTML, CSS, and JavaScript. My passion lies in creating responsive and user-friendly interfaces that enhance the overall user experience.";

const DEFAULT_SKILLS = ['React', 'JavaScript', 'HTML', 'CSS', 'UI/UX Design', 'Problem-solving'];

const DEFAULT_EXPERIENCES: ResumeExperience[] = [
    {
        id: 1,
        company: 'Tech Solutions Inc.',
        position: 'Front-end Developer • 09-09-2020 — 12-12-2023 • Dubai',
        description:
            'Led development of responsive web applications using React and modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality user experiences and implemented best practices for code quality and performance optimization.',
    },
    {
        id: 2,
        company: 'Digital Innovations Ltd.',
        position: 'Front-end Developer • 01-01-2018 — 08-08-2020 • Dubai',
        description:
            'Developed and maintained multiple client projects focusing on user interface design and front-end development. Worked closely with designers to implement pixel-perfect interfaces and ensured cross-browser compatibility.',
    },
];

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

interface ResumeEditorProps {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = (props) => {
    const { setStage, setActiveStep } = props;
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const requestId = useWizardStore((state) => state.requestId);
    const accessToken = useAuthStore((state) => state.accessToken);

    const [summary, setSummary] = useState(DEFAULT_SUMMARY);
    const [skills, setSkills] = useState(DEFAULT_SKILLS);
    const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);
    const [isCvLoading, setIsCvLoading] = useState(false);
    const [cvError, setCvError] = useState<string | null>(null);

    const loadCvData = useCallback(async () => {
        if (!requestId || !accessToken) return;

        setIsCvLoading(true);
        setCvError(null);

        try {
            const response = await apiClientClient.get('cv/get-cv', {
                params: {
                    requestId,
                    userId: accessToken,
                },
            });

            const payload = response.data;
            const detectedSummary = extractSummary(payload);
            const detectedSkills = extractSkills(payload);
            const normalizedExperiences = ensureTwoExperiences(normalizeExperiences(extractExperienceEntries(payload)));

            if (detectedSummary) {
                setSummary(detectedSummary);
            }

            setSkills(detectedSkills.length ? detectedSkills : DEFAULT_SKILLS);
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

    return (
        <ResumeContainer>
            <MainCardContainer>
                <CardContent>
                    <ProfileHeader />
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
                            {editingSection === 'skills'
                                ? skills.map((skill, index) => (
                                      <SkillTextField
                                          key={index}
                                          value={skill}
                                          onChange={(e) => handleSkillsChange(index, e.target.value)}
                                          size='small'
                                      />
                                  ))
                                : skills.map((skill, index) => <SkillItem key={index}>{skill}</SkillItem>)}
                        </SkillsContainer>
                    </SectionContainer>

                    <ExperienceContainer>
                        <SectionHeader title='Experience' />

                        <ExperienceItem>
                            <ExperienceHeader>
                                <Box>
                                    {editingSection === 'experience-1' ? (
                                        <>
                                            <CompanyTextField
                                                value={experiences[0].company}
                                                onChange={(e) => handleExperienceChange(1, 'company', e.target.value)}
                                                variant='standard'
                                                fullWidth
                                            />
                                            <PositionTextField
                                                value={experiences[0].position}
                                                onChange={(e) => handleExperienceChange(1, 'position', e.target.value)}
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <CompanyName variant='h6'>{experiences[0].company}</CompanyName>
                                            <JobDetails variant='body2'>{experiences[0].position}</JobDetails>
                                        </>
                                    )}
                                </Box>
                                <ExperienceActions>
                                    {editingSection === 'experience-1' ? (
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
                                            <IconButton size='small' onClick={() => handleEdit('experience-1')}>
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
                            {editingSection === 'experience-1' ? (
                                <ExperienceTextareaAutosize
                                    value={experiences[0].description}
                                    onChange={(e) => handleExperienceChange(1, 'description', e.target.value)}
                                />
                            ) : (
                                <ExperienceDescription variant='body2'>
                                    {experiences[0].description}
                                </ExperienceDescription>
                            )}
                        </ExperienceItem>

                        <ExperienceItemSmall>
                            <ExperienceHeader>
                                <Box>
                                    {editingSection === 'experience-2' ? (
                                        <>
                                            <CompanyTextField
                                                value={experiences[1].company}
                                                onChange={(e) => handleExperienceChange(2, 'company', e.target.value)}
                                                variant='standard'
                                                fullWidth
                                            />
                                            <PositionTextField
                                                value={experiences[1].position}
                                                onChange={(e) => handleExperienceChange(2, 'position', e.target.value)}
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <CompanyName variant='h6'>{experiences[1].company}</CompanyName>
                                            <JobDetails variant='body2'>{experiences[1].position}</JobDetails>
                                        </>
                                    )}
                                </Box>
                                <ExperienceActions>
                                    {editingSection === 'experience-2' ? (
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
                                            <IconButton size='small' onClick={() => handleEdit('experience-2')}>
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
                            {editingSection === 'experience-2' ? (
                                <ExperienceTextareaAutosize
                                    value={experiences[1].description}
                                    onChange={(e) => handleExperienceChange(2, 'description', e.target.value)}
                                />
                            ) : (
                                <ExperienceDescription variant='body2'>
                                    {experiences[1].description}
                                </ExperienceDescription>
                            )}
                        </ExperienceItemSmall>
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
