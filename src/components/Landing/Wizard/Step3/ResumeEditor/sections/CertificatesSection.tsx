import { Box, Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = { c: ResumeEditorController };

export default function CertificatesSection({ c }: Props) {
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const isEditing = !c.isPreview && c.editingSection === 'certificates';
    const hasContent = c.certificates.some((entry) => String(entry ?? '').trim().length > 0);
    const shouldRender =
        !c.isPreview ||
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('certificates'));

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title='Certificates'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('certificates')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('certificates')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('certificates')}
                onImproveOption={
                    c.isPreview || c.isTextOnlyMode
                        ? undefined
                        : (option) => void c.handleImprove('certificates', option)
                }
                improveOptions={improveOptions}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'certificates'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'certificates'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                hideActions={
                    c.isExporting ||
                    c.isPreview ||
                    c.shouldBlockBelowSummary ||
                    (c.isAutoPipelineMode && !Boolean(c.autoImproved.certificates) && !Boolean(c.improveError))
                }
                actionsSkeleton={c.shouldBlockBelowSummary || c.shouldSkeletonActions('certificates')}
            />

            <Box mt={2}>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('certificates') ? (
                    <SkeletonParagraph lines={3} />
                ) : !c.isPreview && c.editingSection === 'certificates' ? (
                    <ExperienceTextareaAutosize
                        value={c.certificatesEditText}
                        onChange={(e) => c.setCertificatesEditText(e.target.value)}
                    />
                ) : c.certificates.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        No certificates found.
                    </Typography>
                ) : (
                    <Box>
                        {c.certificates.map((text, idx) => (
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
