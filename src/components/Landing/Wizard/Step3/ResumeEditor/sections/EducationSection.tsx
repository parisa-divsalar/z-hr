import { Box, Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = { c: ResumeEditorController };

export default function EducationSection({ c }: Props) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === 'education';
    const hasContent = c.education.some((entry) => String(entry ?? '').trim().length > 0);
    const shouldRender =
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('education'));

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title='Education'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('education')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('education')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('education')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode ? undefined : (option) => void c.handleImprove('education', option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'education'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'education'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.education) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('education')}
            />

            <Box mt={2}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('education') ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === 'education' ? (
                    <ExperienceTextareaAutosize
                        value={c.educationEditText}
                        onChange={(e) => c.setEducationEditText(e.target.value)}
                    />
                ) : c.education.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No education found.
                    </Typography>
                ) : (
                    <Box>
                        {c.education.map((text, idx) => (
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






