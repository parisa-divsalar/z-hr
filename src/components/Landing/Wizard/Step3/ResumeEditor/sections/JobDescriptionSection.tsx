import { Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { SectionContainer, SummaryContainer, SummaryText, StyledTextareaAutosize } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';

type Props = { c: ResumeEditorController };

export default function JobDescriptionSection({ c }: Props) {
    return (
        <SectionContainer>
            <SectionHeader
                title='Job Description'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('jobDescription')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('jobDescription')}
                isEditing={!c.isPreview && c.editingSection === 'jobDescription'}
                isImproving={!c.isPreview && c.improvingSection === 'jobDescription'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'jobDescription'}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.jobDescription) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('jobDescription')}
            />

            <SummaryContainer>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={4} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('jobDescription') ? (
                    <SkeletonParagraph lines={4} />
                ) : !c.isPreview && c.editingSection === 'jobDescription' ? (
                    <StyledTextareaAutosize
                        value={c.jobDescription}
                        onChange={(e) => c.setJobDescription(e.target.value)}
                    />
                ) : c.jobDescription ? (
                    <SummaryText>{c.jobDescription}</SummaryText>
                ) : (
                    <Typography variant='body2' color='text.secondary'>
                        No job description found.
                    </Typography>
                )}
            </SummaryContainer>
        </SectionContainer>
    );
}
