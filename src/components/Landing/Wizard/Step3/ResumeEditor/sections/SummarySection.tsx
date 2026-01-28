import { Box } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { SectionContainer, SummaryContainer, SummaryText, StyledTextareaAutosize } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';

type Props = {
    c: ResumeEditorController;
};

export default function SummarySection({ c }: Props) {
    const hasContent = c.summary.trim().length > 0;
    const isEditing = !c.isPreview && c.editingSection === 'summary';
    const shouldRender = hasContent || isEditing || c.isPreCvLoading || c.shouldBlockBelowSummary;

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title='Summary'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('summary')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('summary')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('summary')}
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

            <SummaryContainer>
                {!c.isPreview && c.editingSection === 'summary' ? (
                    <StyledTextareaAutosize value={c.summary} onChange={(e) => c.setSummary(e.target.value)} />
                ) : c.isPreCvLoading && !c.summary.trim() ? (
                    <Box>
                        <SkeletonParagraph lines={5} />
                    </Box>
                ) : (
                    <SummaryText>{c.summary}</SummaryText>
                )}
            </SummaryContainer>
        </SectionContainer>
    );
}
