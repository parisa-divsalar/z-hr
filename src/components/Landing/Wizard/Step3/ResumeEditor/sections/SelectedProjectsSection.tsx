import { Box, Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = { c: ResumeEditorController };

export default function SelectedProjectsSection({ c }: Props) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === 'selectedProjects';
    const hasContent = c.selectedProjects.some((entry) => String(entry ?? '').trim().length > 0);
    const shouldRender =
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('selectedProjects'));

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title='Selected Projects'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('selectedProjects')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('selectedProjects')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('selectedProjects')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode
                        ? undefined
                        : (option) => void c.handleImprove('selectedProjects', option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'selectedProjects'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'selectedProjects'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode &&
                        !Boolean(c.autoImproved.selectedProjects) &&
                        !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('selectedProjects')}
            />

            <Box mt={2}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('selectedProjects') ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === 'selectedProjects' ? (
                    <ExperienceTextareaAutosize
                        value={c.selectedProjectsEditText}
                        onChange={(e) => c.setSelectedProjectsEditText(e.target.value)}
                    />
                ) : c.selectedProjects.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No projects found.
                    </Typography>
                ) : (
                    <Box>
                        {c.selectedProjects.map((text, idx) => (
                            <SummaryText key={idx} sx={{ mt: idx === 0 ? 0 : 1.5 }}>
                                {text}
                            </SummaryText>
                        ))}
                    </Box>
                )}
            </Box>
        </SectionContainer>
    );
}





