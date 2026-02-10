'use client';

import { type FunctionComponent, type MutableRefObject, useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';

import { Box, Button, CardContent, CircularProgress, IconButton, Menu, MenuItem, Skeleton, Typography } from '@mui/material';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';
import { useWizardStore } from '@/store/wizard';

import DeleteIcon from '@/assets/images/icons/clean.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import StarIcon from '@/assets/images/icons/star.svg';

import DeleteSectionDialog from './ResumeEditor/components/DeleteSectionDialog';
import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import { useResumeEditorController, type ResumeEditorMode, type ResumeEditorController } from './ResumeEditor/hooks/useResumeEditorController';
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

import type { SectionKey } from './ResumeEditor/types';
import type { ImproveOption } from './ResumeEditor/types';
import { extractEmailAndPhone } from './ResumeEditor/utils';

type Props = {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    controller?: ResumeEditorController;
    mode?: ResumeEditorMode;
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    apiUserId?: string | null;
    requestIdOverride?: string | null;
    disableAutoPoll?: boolean;
};

const T2 = {
    pageWidthPx: 794, // A4 @ 96dpi
    pageMinHeightPx: 1123, // A4 @ 96dpi
    pagePaddingPx: 40,
    fontFamily:
        // Keep it close to system sans; prefer Inter if present in the app theme/fonts.
        'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    headerNameSizePx: 34,
    headerRoleSizePx: 12,
    sectionTitleSizePx: 12,
    bodySizePx: 12,
    subtleText: '#6B7280',
    rule: '#D1D5DB',
    ruleStrong: '#111827',
};

const DEFAULT_IMPROVE_OPTIONS: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];

function T2SectionHeader({
    title,
    c,
    section,
    isEditing,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    hideActions,
    showImproveIcon = true,
    improveEnabled = false,
    improveOptions,
    actionsSkeleton,
}: {
    title: string;
    c: ResumeEditorController;
    section: SectionKey;
    isEditing: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    hideActions?: boolean;
    showImproveIcon?: boolean;
    improveEnabled?: boolean;
    improveOptions?: ImproveOption[];
    actionsSkeleton?: boolean;
}) {
    const shouldShowActions = (!hideActions || Boolean(actionsSkeleton)) && !c.isExporting && !c.isPreview;
    const isImprovingThisSection = !c.isPreview && c.improvingSection === section;
    const improveDisabled =
        !improveEnabled || (Boolean(c.improvingSection) && c.improvingSection !== section) || Boolean(c.isSaving) || Boolean(c.isDeletingSection);
    const shouldUseImproveMenu = Boolean(improveOptions?.length);

    const [improveAnchor, setImproveAnchor] = useState<null | HTMLElement>(null);
    const improveMenuOpen = Boolean(improveAnchor);

    const handleOpenImproveMenu = (event: ReactMouseEvent<HTMLElement>) => {
        if (improveDisabled || Boolean(c.improvingSection) || !shouldUseImproveMenu) return;
        setImproveAnchor(event.currentTarget);
    };

    const handleCloseImproveMenu = () => {
        setImproveAnchor(null);
    };

    const handleSelectImproveOption = (option: ImproveOption) => {
        handleCloseImproveMenu();
        void c.handleImprove(section, option);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Box>
                <Typography
                    sx={{
                        fontFamily: T2.fontFamily,
                        fontSize: `${T2.sectionTitleSizePx}px`,
                        letterSpacing: '0.08em',
                        fontWeight: 700,
                        color: T2.ruleStrong,
                    }}
                >
                    {title.toUpperCase()}
                </Typography>
                <Box sx={{ width: 22, height: 2, backgroundColor: T2.ruleStrong, mt: 0.75 }} />
            </Box>

            {shouldShowActions ? (
                isEditing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button size='small' variant='text' color='inherit' onClick={onCancel} disabled={Boolean(c.isSaving)}>
                            Cancel
                        </Button>
                        <Button size='small' variant='contained' color='primary' onClick={onSave} disabled={Boolean(c.isSaving) || !onSave}>
                            Save
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {actionsSkeleton ? (
                            <>
                                <Skeleton variant='circular' width={28} height={28} />
                                {showImproveIcon ? <Skeleton variant='circular' width={28} height={28} /> : null}
                            </>
                        ) : (
                            <>
                                <IconButton size='small' onClick={onEdit} disabled={Boolean(c.improvingSection)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size='small'
                                    onClick={onDelete}
                                    disabled={Boolean(c.improvingSection) || Boolean(c.isDeletingSection) || Boolean(c.isSaving) || !onDelete}
                                >
                                    <DeleteIcon />
                                </IconButton>

                                {showImproveIcon ? (
                                    <IconButton
                                        size='small'
                                        onClick={
                                            shouldUseImproveMenu ? handleOpenImproveMenu : () => void c.handleImprove(section)
                                        }
                                        disabled={improveDisabled || Boolean(c.improvingSection)}
                                    >
                                        {isImprovingThisSection ? <CircularProgress size={16} /> : <StarIcon />}
                                    </IconButton>
                                ) : null}

                                {shouldUseImproveMenu ? (
                                    <Menu
                                        anchorEl={improveAnchor}
                                        open={improveMenuOpen}
                                        onClose={handleCloseImproveMenu}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        {(improveOptions ?? []).map((option) => (
                                            <MenuItem
                                                key={option}
                                                disabled={improveDisabled || Boolean(c.improvingSection)}
                                                onClick={() => handleSelectImproveOption(option)}
                                            >
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                ) : null}
                            </>
                        )}
                    </Box>
                )
            ) : null}
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
    const hasContent = c.summary.trim().length > 0;
    const isEditing = !c.isPreview && c.editingSection === 'summary';
    const shouldRender = !c.isPreview || hasContent || isEditing || c.isPreCvLoading || c.shouldBlockBelowSummary;
    if (!shouldRender) return null;

    return (
        <Box>
            <T2SectionHeader
                title='Summary'
                c={c}
                section='summary'
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('summary')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('summary')}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                improveOptions={DEFAULT_IMPROVE_OPTIONS}
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
                    <SummaryText sx={{ color: T2.subtleText, fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px` }}>
                        No summary found.
                    </SummaryText>
                ) : (
                    <SummaryText sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px` }}>{c.summary}</SummaryText>
                )}
            </Box>
        </Box>
    );
}

function SkillsCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'skills';
    const visibleSkills = useMemo(() => c.skills.map((s) => String(s ?? '').trim()).filter(Boolean), [c.skills]);
    const hasContent = c.skills.some((skill) => String(skill ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section: 'skills', hasContent })) return null;

    return (
        <Box>
            <T2SectionHeader
                title='Skills'
                c={c}
                section='skills'
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('skills')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('skills')}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <Box sx={{ mt: 1.5 }}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('skills') ? (
                    <SkeletonParagraph lines={3} />
                ) : visibleSkills.length === 0 ? (
                    <Typography sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.subtleText }}>
                        No skills found.
                    </Typography>
                ) : !c.isPreview && c.editingSection === 'skills' ? (
                    <SkillsContainer sx={{ mt: 0 }}>
                        {c.skills.map((skill, index) => (
                            <SkillTextField
                                key={index}
                                value={skill}
                                onChange={(e) => c.handleSkillsChange(index, e.target.value)}
                                size='small'
                            />
                        ))}
                    </SkillsContainer>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.75 }}>
                        {visibleSkills.map((skill, index) => (
                            <Box
                                key={`${skill}-${index}`}
                                component='span'
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    border: `1px solid ${T2.rule}`,
                                    borderRadius: 999,
                                    px: 1,
                                    py: 0.25,
                                    backgroundColor: '#F9FAFB',
                                    maxWidth: '100%',
                                }}
                            >
                                <Typography
                                    component='span'
                                    sx={{
                                        fontFamily: T2.fontFamily,
                                        fontSize: `${T2.bodySizePx}px`,
                                        color: T2.ruleStrong,
                                        lineHeight: 1.35,
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {skill}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
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
    const isEditing = !c.isPreview && c.editingSection === section;
    const hasContent = value.some((entry) => String(entry ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section, hasContent })) return null;

    return (
        <Box>
            <T2SectionHeader
                title={title}
                c={c}
                section={section}
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit(section)}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection(section)}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                improveEnabled={improveEnabled}
                improveOptions={DEFAULT_IMPROVE_OPTIONS}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean((c.autoImproved as any)[section]) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions(section)}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection(section) ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === section ? (
                    <ExperienceTextareaAutosize value={editValue} onChange={(e) => onEditValueChange(e.target.value)} />
                ) : value.length === 0 ? (
                    <Typography sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.subtleText }}>
                        {`No ${title.toLowerCase()} found.`}
                    </Typography>
                ) : (
                    <Box>
                        {value.map((text, idx) => (
                            <SummaryText
                                key={idx}
                                sx={{
                                    mt: idx === 0 ? 0 : 1.25,
                                    fontFamily: T2.fontFamily,
                                    fontSize: `${T2.bodySizePx}px`,
                                }}
                            >
                                {text}
                            </SummaryText>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function LanguagesCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'languages';
    const hasContent = c.languages.some((lang) => String(lang?.name ?? '').trim().length > 0);
    if (!shouldShowSection({ c, section: 'languages', hasContent })) return null;

    return (
        <Box>
            <T2SectionHeader
                title='Languages'
                c={c}
                section='languages'
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('languages')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('languages')}
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
                    <ExperienceTextareaAutosize value={c.languagesEditText} onChange={(e) => c.setLanguagesEditText(e.target.value)} />
                ) : c.languages.length === 0 ? (
                    <Typography sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.subtleText }}>
                        No languages found.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {c.languages.map((lang, idx) => (
                            <Typography
                                key={lang.id}
                                sx={{
                                    mt: idx === 0 ? 0 : 0,
                                    fontFamily: T2.fontFamily,
                                    fontSize: `${T2.bodySizePx}px`,
                                    color: T2.ruleStrong,
                                    lineHeight: 1.5,
                                }}
                            >
                                {lang.name}
                                {lang.level ? ` - ${lang.level}` : ''}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

function ExperienceCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'experience';
    const visibleExperiences = c.experiences.filter((exp) =>
        [exp.company, exp.position, exp.description].some((v) => String(v ?? '').trim().length > 0),
    );
    const hasContent = visibleExperiences.length > 0;
    if (!shouldShowSection({ c, section: 'experience', hasContent })) return null;

    return (
        <Box>
            <T2SectionHeader
                title='Experience'
                c={c}
                section='experience'
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('experience')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('experience')}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                improveOptions={DEFAULT_IMPROVE_OPTIONS}
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
                    <ExperienceTextareaAutosize value={c.experienceEditText} onChange={(e) => c.setExperienceEditText(e.target.value)} />
                ) : visibleExperiences.length === 0 ? (
                    <Typography sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.subtleText }}>
                        No professional experience found.
                    </Typography>
                ) : (
                    visibleExperiences.map((experience, index) => {
                        const Wrapper = index === 0 ? ExperienceItem : ExperienceItemSmall;
                        const parts = String(experience.position ?? '')
                            .split('•')
                            .map((p) => p.trim())
                            .filter(Boolean);
                        const title = parts[0] ?? '';
                        const period = parts.length >= 2 ? parts[1] ?? '' : '';
                        const location = parts.length >= 3 ? parts[2] ?? '' : '';

                        return (
                            <Wrapper key={experience.id} sx={{ mt: index === 0 ? 0 : 2, mb: 0 }}>
                                {(experience.company || experience.position) && (
                                    <Box mb={0.75}>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                                            {experience.company ? (
                                                <CompanyName
                                                    variant='h6'
                                                    sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, fontWeight: 700 }}
                                                >
                                                    {experience.company}
                                                </CompanyName>
                                            ) : null}
                                            {location ? (
                                                <Typography
                                                    sx={{
                                                        fontFamily: T2.fontFamily,
                                                        fontSize: `${T2.bodySizePx}px`,
                                                        color: T2.subtleText,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {location}
                                                </Typography>
                                            ) : null}
                                        </Box>
                                        {(title || period) ? (
                                            <JobDetails
                                                variant='body2'
                                                sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.ruleStrong }}
                                            >
                                                {[title, period].filter(Boolean).join(' ')}
                                            </JobDetails>
                                        ) : null}
                                    </Box>
                                )}
                                {experience.description ? (
                                    <ExperienceDescription
                                        variant='body2'
                                        sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.ruleStrong }}
                                    >
                                        {experience.description}
                                    </ExperienceDescription>
                                ) : null}
                            </Wrapper>
                        );
                    })
                )}
            </Box>
        </Box>
    );
}

function AdditionalInfoCardT2({ c }: { c: ResumeEditorController }) {
    const shouldRender =
        !c.isPreview ||
        c.shouldBlockBelowSummary ||
        c.isTextOnlyMode ||
        c.additionalInfo.trim().length > 0 ||
        c.editingSection === 'additionalInfo';
    if (!shouldRender) return null;

    return (
        <Box>
            <T2SectionHeader
                title='Additional Information'
                c={c}
                section='additionalInfo'
                isEditing={!c.isPreview && c.editingSection === 'additionalInfo'}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('additionalInfo')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('additionalInfo')}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                improveEnabled={!c.isPreview && !c.isTextOnlyMode}
                improveOptions={DEFAULT_IMPROVE_OPTIONS}
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
                    <ExperienceTextareaAutosize value={c.additionalInfoEditText} onChange={(e) => c.setAdditionalInfoEditText(e.target.value)} />
                ) : !c.additionalInfo.trim() ? (
                    <Typography sx={{ fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px`, color: T2.subtleText }}>
                        No additional information found.
                    </Typography>
                ) : (
                    <SummaryText sx={{ whiteSpace: 'pre-line', fontFamily: T2.fontFamily, fontSize: `${T2.bodySizePx}px` }}>
                        {c.additionalInfo}
                    </SummaryText>
                )}
            </Box>
        </Box>
    );
}

function DetailsCardT2({ c }: { c: ResumeEditorController }) {
    const isEditing = !c.isPreview && c.editingSection === 'contactWays';
    const hasContent = c.contactWays.some((v) => String(v ?? '').trim().length > 0) || Boolean(c.resolvedEmail) || Boolean(c.resolvedPhone);
    if (!shouldShowSection({ c, section: 'contactWays', hasContent })) return null;

    const parsed = useMemo(() => {
        const ways = Array.isArray(c.contactWays) ? c.contactWays : [];
        const { email, phone } = extractEmailAndPhone(ways);
        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
        const phoneRegex = /(\+?\d[\d\s\-().]{6,}\d)/;
        const clean = (raw: string) =>
            String(raw ?? '')
                .trim()
                .replace(/^mailto:/i, '')
                .replace(/^tel:/i, '')
                .replace(/^(email|e-mail)\s*:\s*/i, '')
                .replace(/^(phone|mobile|tel)\s*:\s*/i, '')
                .trim();

        const others = ways
            .map(clean)
            .filter(Boolean)
            .filter((x) => !(emailRegex.test(x) || phoneRegex.test(x)));

        const addressCandidate =
            others.find((x) => /road|rd\.?|street|st\.?|avenue|ave\.?|boulevard|blvd\.?|lane|ln\.?|drive|dr\.?/i.test(x)) ??
            others.find((x) => /\d{5}(-\d{4})?/.test(x)) ??
            others[0] ??
            '';

        const addressLines = addressCandidate
            ? addressCandidate
                  .split(/,\s*/)
                  .map((x) => x.trim())
                  .filter(Boolean)
            : [];

        return {
            phone: String(c.resolvedPhone ?? phone ?? '').trim(),
            email: String(c.resolvedEmail ?? email ?? '').trim(),
            addressLines,
        };
    }, [c.contactWays, c.resolvedEmail, c.resolvedPhone]);

    const rowLabelSx = {
        fontFamily: T2.fontFamily,
        fontSize: '10px',
        letterSpacing: '0.08em',
        fontWeight: 700,
        color: T2.ruleStrong,
    } as const;

    const rowValueSx = {
        fontFamily: T2.fontFamily,
        fontSize: `${T2.bodySizePx}px`,
        color: T2.ruleStrong,
        lineHeight: 1.5,
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    } as const;

    return (
        <Box>
            <T2SectionHeader
                title='Details'
                c={c}
                section='contactWays'
                isEditing={isEditing}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('contactWays')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('contactWays')}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <Box mt={1.5}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={4} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('contactWays') ? (
                    <SkeletonParagraph lines={4} />
                ) : !c.isPreview && c.editingSection === 'contactWays' ? (
                    <ExperienceTextareaAutosize value={c.contactWaysEditText} onChange={(e) => c.setContactWaysEditText(e.target.value)} />
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {parsed.addressLines.length ? (
                            <Box>
                                <Typography sx={rowLabelSx}>ADDRESS</Typography>
                                <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                    {parsed.addressLines.map((line, idx) => (
                                        <Typography key={idx} sx={rowValueSx}>
                                            {line}
                                        </Typography>
                                    ))}
                                </Box>
                            </Box>
                        ) : null}

                        {parsed.phone ? (
                            <Box>
                                <Typography sx={rowLabelSx}>PHONE</Typography>
                                <Typography sx={{ ...rowValueSx, mt: 0.5 }}>{parsed.phone}</Typography>
                            </Box>
                        ) : null}

                        {parsed.email ? (
                            <Box>
                                <Typography sx={rowLabelSx}>EMAIL</Typography>
                                <Typography sx={{ ...rowValueSx, mt: 0.5 }}>{parsed.email}</Typography>
                            </Box>
                        ) : null}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

const ResumeEditorTemplate2: FunctionComponent<Props> = ({
    setStage,
    controller,
    mode = 'editor',
    pdfTargetRef,
    apiUserId,
    requestIdOverride,
    disableAutoPoll,
}) => {
    const c = controller ?? useResumeEditorController({ mode, pdfTargetRef, apiUserId, requestIdOverride, disableAutoPoll });
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
        <ResumeContainer
            sx={{
                maxWidth: 920,
                // Give a subtle background so the card border/shadow is visible on white pages.
                borderRadius: { xs: 2, sm: 3 },
                px: { xs: 1.25, sm: 2 },
                py: { xs: 1.25, sm: 2 },
            }}
        >
            <RefreshDataLossDialog open={isRefreshWarningOpen} onClose={() => setIsRefreshWarningOpen(false)} />
            <DeleteSectionDialog
                open={Boolean(c.pendingDeleteSection)}
                sectionLabel={pendingDeleteLabel}
                isDeleting={c.isDeletingSection}
                onCancel={c.cancelDeleteSection}
                onConfirm={() => void c.confirmDeleteSection()}
            />

            <Box sx={{ maxWidth: 920, mx: 'auto', overflow: 'visible' }}>
                <Box
                    sx={{
                        overflow: 'hidden',
                        borderRadius: { xs: 2, sm: 3 },
                        boxShadow: {
                            xs: '0 10px 28px rgba(15, 23, 42, 0.12)',
                            sm: '0 18px 60px rgba(15, 23, 42, 0.14)',
                        },
                        border: '1px solid',
                        // Force visible border even on very light themes.
                        borderColor: 'rgba(15, 23, 42, 0.12)',
                        backgroundColor: '#fff',
                    }}
                >
                    <MainCardContainer
                        ref={c.pdfRef}
                        sx={{
                            minWidth: 'unset',
                            maxWidth: 'unset',
                            mx: 0,
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            boxShadow: 'none',
                            borderRadius: 0,
                            mb: 0,
                        }}
                    >
                    <CardContent
                        sx={{
                            p: 0,
                        }}
                    >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: `${T2.pageWidthPx}px`,
                            minHeight: { xs: 'unset', md: `${T2.pageMinHeightPx}px` },
                            mx: 'auto',
                            px: { xs: 2.5, md: `${T2.pagePaddingPx}px` },
                            py: { xs: 3, md: `${T2.pagePaddingPx}px` },
                            boxSizing: 'border-box',
                            fontFamily: T2.fontFamily,
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                            <Typography
                                sx={{
                                    fontFamily: T2.fontFamily,
                                    fontSize: `${T2.headerNameSizePx}px`,
                                    fontWeight: 800,
                                    letterSpacing: '0.02em',
                                    lineHeight: 1.05,
                                    textTransform: 'uppercase',
                                    color: '#000',
                                }}
                            >
                                {String(c.profile.fullName ?? '').trim() || '—'}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: T2.fontFamily,
                                    fontSize: `${T2.headerRoleSizePx}px`,
                                    color: T2.subtleText,
                                    fontWeight: 500,
                                }}
                            >
                                {String(c.resolvedMainSkill ?? '').trim() || ' '}
                            </Typography>
                        </Box>

                        <Box sx={{ height: 1, backgroundColor: T2.rule, mt: 2.5, mb: 2.5 }} />

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

                        {/* Body */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '260px 1px 1fr' },
                                columnGap: { xs: 0, md: 3.5 },
                                rowGap: { xs: 3, md: 0 },
                                alignItems: 'start',
                            }}
                        >
                            {/* Left column */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {!c.isSectionHidden('contactWays') ? <DetailsCardT2 c={c} /> : null}
                                {!c.isSectionHidden('skills') ? <SkillsCardT2 c={c} /> : null}
                                {!c.isSectionHidden('languages') ? <LanguagesCardT2 c={c} /> : null}
                            </Box>

                            {/* Vertical divider */}
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'block' },
                                    width: 1,
                                    backgroundColor: T2.rule,
                                    alignSelf: 'stretch',
                                }}
                            />

                            {/* Right column */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {!c.isSectionHidden('summary') ? <SummaryCardT2 c={c} /> : null}
                                {!c.isSectionHidden('experience') ? <ExperienceCardT2 c={c} /> : null}
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
                                {/* Render extra sections only if user has content; keeps screenshot-like output for typical data */}
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
                                {!c.isSectionHidden('additionalInfo') ? <AdditionalInfoCardT2 c={c} /> : null}
                            </Box>
                        </Box>
                    </Box>
                        </CardContent>
                    </MainCardContainer>
                </Box>
            </Box>

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


