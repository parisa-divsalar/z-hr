'use client';

import { type FunctionComponent, type MutableRefObject, useEffect, useMemo, useState } from 'react';

import { Box, CardContent, Grid, Typography } from '@mui/material';

import MuiChips from '@/components/UI/MuiChips';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';
import { useWizardStore } from '@/store/wizard';

import DeleteSectionDialog from './ResumeEditor/components/DeleteSectionDialog';
import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import { useResumeEditorController, type ResumeEditorMode, type ResumeEditorController } from './ResumeEditor/hooks/useResumeEditorController';
import ProfileHeader from './ResumeEditor/ProfileHeader';
import SectionHeader from './ResumeEditor/SectionHeader';
import SkeletonParagraph from './ResumeEditor/components/SkeletonParagraph';
import {
    CompanyName,
    ExperienceDescription,
    ExperienceItem,
    ExperienceItemSmall,
    ExperienceTextareaAutosize,
    JobDetails,
    MainCardContainer,
    ResumeContainer,
    SkillTextField,
    SkillsContainer,
    StyledTextareaAutosize,
    SummaryText,
} from './ResumeEditor/styled';

import type { ImproveOption, SectionKey } from './ResumeEditor/types';

type Props = {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    mode?: ResumeEditorMode;
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    apiUserId?: string | null;
    requestIdOverride?: string | null;
    disableAutoPoll?: boolean;
};

function SectionCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1.75, sm: 2.25 },
            }}
        >
            {children}
        </Box>
    );
}

function shouldShowSection({
    c,
    section,
    hasContent,
}: {
    c: ResumeEditorController;
    section: SectionKey;
    hasContent: boolean;
}) {
    const isEditing = !c.isPreview && c.editingSection === section;
    return (
        !c.isPreview ||
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection(section))
    );
}

function SummaryCardT2({ c }: { c: ResumeEditorController }) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const hasContent = c.summary.trim().length > 0;
    const isEditing = !c.isPreview && c.editingSection === 'summary';
    const shouldRender = !c.isPreview || hasContent || isEditing || c.isPreCvLoading || c.shouldBlockBelowSummary;
    if (!shouldRender) return null;

    return (
        <SectionCard>
            <SectionHeader
                title='Summary'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('summary')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('summary')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('summary')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode ? undefined : (option) => void c.handleImprove('summary', option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'summary'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'summary'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.summary) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldSkeletonActions('summary')}
            />

            <Box mt={1.5}>
                {!c.isPreview && c.editingSection === 'summary' ? (
                    <StyledTextareaAutosize value={c.summary} onChange={(e) => c.setSummary(e.target.value)} />
                ) : c.isPreCvLoading && !c.summary.trim() ? (
                    <SkeletonParagraph lines={5} />
                ) : !c.summary.trim() ? (
                    <SummaryText sx={{ color: 'text.secondary' }}>No summary found.</SummaryText>
                ) : (
                    <SummaryText>{c.summary}</SummaryText>
                )}
            </Box>
        </SectionCard>
    );
}

function SkillsCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'skills';
    const hasContent = c.skills.some((skill) => String(skill ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section: 'skills', hasContent })) return null;

    return (
        <SectionCard>
            <SectionHeader
                title='Technical Skills'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('skills')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('skills')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('skills')}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'skills'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'skills'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <SkillsContainer sx={{ mt: 1.5 }}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('skills') ? (
                    <SkeletonParagraph lines={3} />
                ) : c.skills.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No skills found.
                    </Typography>
                ) : !c.isPreview && c.editingSection === 'skills' ? (
                    c.skills.map((skill, index) => (
                        <SkillTextField
                            key={index}
                            value={skill}
                            onChange={(e) => c.handleSkillsChange(index, e.target.value)}
                            size='small'
                        />
                    ))
                ) : (
                    c.skills.map((skill, index) => <MuiChips key={`${skill}-${index}`} label={skill} sx={{ mt: 0 }} />)
                )}
            </SkillsContainer>
        </SectionCard>
    );
}

function TextListCardT2({
    c,
    title,
    section,
    value,
    editValue,
    onEditValueChange,
    improveEnabled,
}: {
    c: ResumeEditorController;
    title: string;
    section: SectionKey;
    value: string[];
    editValue: string;
    onEditValueChange: (v: string) => void;
    improveEnabled: boolean;
}) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === section;
    const hasContent = value.some((entry) => String(entry ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section, hasContent })) return null;

    return (
        <SectionCard>
            <SectionHeader
                title={title}
                onEdit={c.isPreview ? undefined : () => c.handleEdit(section)}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection(section)}
                onImprove={!improveEnabled ? undefined : () => void c.handleImprove(section)}
                onImproveOption={
                    !improveEnabled ? undefined : (option) => void c.handleImprove(section, option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === section}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== section}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean((c.autoImproved as any)[section]) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions(section)}
                showImproveIcon={improveEnabled}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection(section) ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === section ? (
                    <ExperienceTextareaAutosize value={editValue} onChange={(e) => onEditValueChange(e.target.value)} />
                ) : value.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        {`No ${title.toLowerCase()} found.`}
                    </Typography>
                ) : (
                    <Box>
                        {value.map((text, idx) => (
                            <SummaryText key={idx} sx={{ mt: idx === 0 ? 0 : 1.25 }}>
                                {text}
                            </SummaryText>
                        ))}
                    </Box>
                )}
            </Box>
        </SectionCard>
    );
}

function LanguagesCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'languages';
    const hasContent = c.languages.some((lang) => String(lang?.name ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section: 'languages', hasContent })) return null;

    return (
        <SectionCard>
            <SectionHeader
                title='Languages'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('languages')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('languages')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('languages')}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'languages'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'languages'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary && c.languages.length === 0 ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('languages') ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === 'languages' ? (
                    <ExperienceTextareaAutosize
                        value={c.languagesEditText}
                        onChange={(e) => c.setLanguagesEditText(e.target.value)}
                    />
                ) : c.languages.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No languages found.
                    </Typography>
                ) : (
                    <Box>
                        {c.languages.map((lang, idx) => (
                            <SummaryText key={lang.id} sx={{ mt: idx === 0 ? 0 : 1.25 }}>
                                {lang.name}
                                {lang.level ? ` - ${lang.level}` : ''}
                            </SummaryText>
                        ))}
                    </Box>
                )}
            </Box>
        </SectionCard>
    );
}

function ExperienceCardT2({ c }: { c: ResumeEditorController }) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === 'experience';
    const visibleExperiences = c.experiences.filter((exp) =>
        [exp.company, exp.position, exp.description].some((v) => String(v ?? '').trim().length > 0),
    );
    const hasContent = visibleExperiences.length > 0;
    if (!shouldShowSection({ c, section: 'experience', hasContent })) return null;

    return (
        <SectionCard>
            <SectionHeader
                title='Professional Experience'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('experience')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('experience')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('experience')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode ? undefined : (option) => void c.handleImprove('experience', option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'experience'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'experience'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.experience) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('experience')}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={5} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('experience') ? (
                    <SkeletonParagraph lines={5} />
                ) : !c.isPreview && c.editingSection === 'experience' ? (
                    <ExperienceTextareaAutosize
                        value={c.experienceEditText}
                        onChange={(e) => c.setExperienceEditText(e.target.value)}
                    />
                ) : (
                    (() => {
                        if (visibleExperiences.length === 0) {
                            return (
                                <Typography variant='body2' color='text.secondary'>
                                    No professional experience found.
                                </Typography>
                            );
                        }

                        return visibleExperiences.map((experience, index) => {
                            const Wrapper = index === 0 ? ExperienceItem : ExperienceItemSmall;
                            return (
                                <Wrapper key={experience.id}>
                                    {(experience.company || experience.position) && (
                                        <Box mb={1}>
                                            {experience.company && <CompanyName variant='h6'>{experience.company}</CompanyName>}
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
                        });
                    })()
                )}
            </Box>
        </SectionCard>
    );
}

function AdditionalInfoCardT2({ c }: { c: ResumeEditorController }) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const shouldRender =
        !c.isPreview ||
        c.shouldBlockBelowSummary ||
        c.isTextOnlyMode ||
        c.additionalInfo.trim().length > 0 ||
        c.editingSection === 'additionalInfo';
    if (!shouldRender) return null;

    return (
        <SectionCard>
            <SectionHeader
                title='Additional Information'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('additionalInfo')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('additionalInfo')}
                isEditing={!c.isPreview && c.editingSection === 'additionalInfo'}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('additionalInfo')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode
                        ? undefined
                        : (option) => void c.handleImprove('additionalInfo', option)
                }
                improveOptions={improveOptions}
                isImproving={!c.isPreview && c.improvingSection === 'additionalInfo'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'additionalInfo'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.additionalInfo) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('additionalInfo')}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={4} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('additionalInfo') ? (
                    <SkeletonParagraph lines={4} />
                ) : !c.isPreview && c.editingSection === 'additionalInfo' ? (
                    <ExperienceTextareaAutosize
                        value={c.additionalInfoEditText}
                        onChange={(e) => c.setAdditionalInfoEditText(e.target.value)}
                    />
                ) : !c.additionalInfo.trim() ? (
                    <Typography variant='body2' color='text.secondary'>
                        No additional information found.
                    </Typography>
                ) : (
                    <SummaryText sx={{ whiteSpace: 'pre-line' }}>{c.additionalInfo}</SummaryText>
                )}
            </Box>
        </SectionCard>
    );
}

const ResumeEditorTemplate2: FunctionComponent<Props> = ({
    setStage,
    mode = 'editor',
    pdfTargetRef,
    apiUserId,
    requestIdOverride,
    disableAutoPoll,
}) => {
    const c = useResumeEditorController({ mode, pdfTargetRef, apiUserId, requestIdOverride, disableAutoPoll });
    const { profile } = useUserProfile();
    const requestId = useWizardStore((state) => state.requestId);
    const [isRefreshWarningOpen, setIsRefreshWarningOpen] = useState<boolean>(mode !== 'preview');

    const sectionLabels: Record<SectionKey, string> = useMemo(
        () => ({
            summary: 'Summary',
            skills: 'Technical Skills',
            contactWays: 'Contact Ways',
            education: 'Education',
            languages: 'Languages',
            certificates: 'Certificates',
            selectedProjects: 'Selected Projects',
            experience: 'Professional Experience',
            additionalInfo: 'Additional Information',
        }),
        [],
    );

    const pendingDeleteLabel = c.pendingDeleteSection ? sectionLabels[c.pendingDeleteSection] : 'this section';

    useEffect(() => {
        if (mode === 'preview') return;
        setIsRefreshWarningOpen(true);
    }, [mode]);

    const handleSubmit = () => {
        if (!c.cvError && !c.saveError) {
            trackEvent('resume_completed', {
                user_id: profile?.id,
                resume_id: requestId,
                timestamp: new Date().toISOString(),
            });
        }
        setStage('MORE_FEATURES');
    };

    return (
        <ResumeContainer sx={{ maxWidth: 920 }}>
            <RefreshDataLossDialog open={isRefreshWarningOpen} onClose={() => setIsRefreshWarningOpen(false)} />
            <DeleteSectionDialog
                open={Boolean(c.pendingDeleteSection)}
                sectionLabel={pendingDeleteLabel}
                isDeleting={c.isDeletingSection}
                onCancel={c.cancelDeleteSection}
                onConfirm={() => void c.confirmDeleteSection()}
            />

            <MainCardContainer
                ref={c.pdfRef}
                sx={{
                    minWidth: 'unset',
                    maxWidth: 920,
                    mx: 'auto',
                    overflow: 'hidden',
                }}
            >
                <CardContent
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2.5, sm: 3 },
                    }}
                >
                    <Box
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            background:
                                'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.06))',
                        }}
                    >
                        <ProfileHeader
                            fullName={c.profile.fullName}
                            dateOfBirth={c.profile.dateOfBirth}
                            visaStatus={c.resolvedVisaStatus}
                            mainSkill={c.resolvedMainSkill}
                            phone={c.resolvedPhone}
                            email={c.resolvedEmail}
                            isEditing={!c.isPreview && c.editingSection === 'profile'}
                            onEdit={c.isPreview ? undefined : () => c.handleEdit('profile')}
                            onSave={c.isPreview ? undefined : c.handleSave}
                            onCancel={c.isPreview ? undefined : c.handleCancel}
                            isSaving={c.isSaving}
                            editText={c.profileEditText}
                            onEditTextChange={c.isPreview ? undefined : c.setProfileEditText}
                            showImproveIcon={false}
                            hideActions={c.isExporting || c.isPreview}
                        />
                    </Box>

                    <ResumeAlerts
                        isCvLoading={c.isCvLoading}
                        cvError={c.cvError}
                        saveError={c.saveError}
                        improveError={c.improveError}
                        downloadError={c.downloadError}
                        onDismissSaveError={c.clearSaveError}
                        onDismissImproveError={c.clearImproveError}
                        onDismissDownloadError={c.clearDownloadError}
                    />

                    <Grid container spacing={2} alignItems='stretch'>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {!c.isSectionHidden('summary') ? <SummaryCardT2 c={c} /> : null}
                                {!c.isSectionHidden('skills') ? <SkillsCardT2 c={c} /> : null}
                                {!c.isSectionHidden('languages') ? <LanguagesCardT2 c={c} /> : null}
                                {!c.isSectionHidden('certificates') ? (
                                    <TextListCardT2
                                        c={c}
                                        title='Certificates'
                                        section='certificates'
                                        value={c.certificates}
                                        editValue={c.certificatesEditText}
                                        onEditValueChange={c.setCertificatesEditText}
                                        improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                                    />
                                ) : null}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {!c.isSectionHidden('experience') ? <ExperienceCardT2 c={c} /> : null}
                                {!c.isSectionHidden('selectedProjects') ? (
                                    <TextListCardT2
                                        c={c}
                                        title='Selected Projects'
                                        section='selectedProjects'
                                        value={c.selectedProjects}
                                        editValue={c.selectedProjectsEditText}
                                        onEditValueChange={c.setSelectedProjectsEditText}
                                        improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                                    />
                                ) : null}
                                {!c.isSectionHidden('education') ? (
                                    <TextListCardT2
                                        c={c}
                                        title='Education'
                                        section='education'
                                        value={c.education}
                                        editValue={c.educationEditText}
                                        onEditValueChange={c.setEducationEditText}
                                        improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                                    />
                                ) : null}
                                {!c.isSectionHidden('additionalInfo') ? <AdditionalInfoCardT2 c={c} /> : null}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </MainCardContainer>

            <ResumeFooter
                isPreview={c.isPreview}
                isDownloading={c.isDownloading}
                downloadProgress={c.downloadProgress}
                cvError={c.cvError}
                onDownloadPdf={() => void c.handleDownloadPdf()}
                onSubmit={handleSubmit}
            />
        </ResumeContainer>
    );
};

export default ResumeEditorTemplate2;


