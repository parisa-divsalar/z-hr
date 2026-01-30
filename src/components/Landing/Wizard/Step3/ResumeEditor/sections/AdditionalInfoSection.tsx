import { Box } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = { c: ResumeEditorController };

export default function AdditionalInfoSection({ c }: Props) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const shouldRender =
        c.shouldBlockBelowSummary ||
        c.isTextOnlyMode ||
        c.additionalInfo.trim().length > 0 ||
        c.editingSection === 'additionalInfo';

    if (!shouldRender) return null;

    return (
        <SectionContainer>
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

            <Box mt={2}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={4} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('additionalInfo') ? (
                    <SkeletonParagraph lines={4} />
                ) : !c.isPreview && c.editingSection === 'additionalInfo' ? (
                    <ExperienceTextareaAutosize
                        value={c.additionalInfoEditText}
                        onChange={(e) => c.setAdditionalInfoEditText(e.target.value)}
                    />
                ) : (
                    <SummaryText sx={{ whiteSpace: 'pre-line' }}>{c.additionalInfo}</SummaryText>
                )}
            </Box>
        </SectionContainer>
    );
}
