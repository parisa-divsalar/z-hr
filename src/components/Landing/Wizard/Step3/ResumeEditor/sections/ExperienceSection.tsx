import { Box, Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import {
    CompanyName,
    ExperienceContainer,
    ExperienceDescription,
    ExperienceItem,
    ExperienceItemSmall,
    ExperienceTextareaAutosize,
    JobDetails,
} from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = { c: ResumeEditorController };

export default function ExperienceSection({ c }: Props) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === 'experience';
    const visibleExperiences = c.experiences.filter((exp) =>
        [exp.company, exp.position, exp.description].some((v) => String(v ?? '').trim().length > 0),
    );
    const hasContent = visibleExperiences.length > 0;
    const shouldRender =
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('experience'));

    if (!shouldRender) return null;

    return (
        <ExperienceContainer>
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
                    });
                })()
            )}
        </ExperienceContainer>
    );
}
