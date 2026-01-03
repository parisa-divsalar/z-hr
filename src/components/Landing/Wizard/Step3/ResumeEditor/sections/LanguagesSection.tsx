import { Box, Typography } from '@mui/material';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';

type Props = { c: ResumeEditorController };

export default function LanguagesSection({ c }: Props) {
    return (
        <SectionContainer>
            <SectionHeader
                title='Languages'
                onEdit={c.isPreview ? undefined : () => c.handleEdit('languages')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('languages')}
                isEditing={!c.isPreview && c.editingSection === 'languages'}
                isImproving={!c.isPreview && c.improvingSection === 'languages'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'languages'}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <Box mt={2}>
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
                            <SummaryText key={lang.id} sx={{ mt: idx === 0 ? 0 : 1.5 }}>
                                {lang.name}
                                {lang.level ? ` - ${lang.level}` : ''}
                            </SummaryText>
                        ))}
                    </Box>
                )}
            </Box>
        </SectionContainer>
    );
}
