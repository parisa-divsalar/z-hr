import { Box } from '@mui/material';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { SectionContainer, SummaryContainer, SummaryText, StyledTextareaAutosize } from '../styled';
import { useTranslatedSummary } from '../hooks/useTranslatedSummary';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';
import type { ImproveOption } from '../types';

type Props = {
    c: ResumeEditorController;
};

export default function SummarySection({ c }: Props) {
    const locale = useLocaleStore((s) => s.locale);
    const { displayText: summaryDisplayText, isLoading: isSummaryTranslating } = useTranslatedSummary(c.summary, locale);
    const sectionTitle = getMainTranslations(locale).landing.wizard.resumeEditor.sections.summary;
    const noSummaryFound = getMainTranslations(locale).landing.wizard.resumeEditor.noSummaryFound;
    const improveOptions: ImproveOption[] = ['shorter', 'longer', 'creative', 'formal'];
    const hasContent = c.summary.trim().length > 0;
    const isEditing = !c.isPreview && c.editingSection === 'summary';
    const shouldRender = !c.isPreview || hasContent || isEditing || c.isPreCvLoading || c.shouldBlockBelowSummary;

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title={sectionTitle}
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

            <SummaryContainer>
                {!c.isPreview && c.editingSection === 'summary' ? (
                    <StyledTextareaAutosize value={c.summary} onChange={(e) => c.setSummary(e.target.value)} />
                ) : c.isPreCvLoading && !c.summary.trim() ? (
                    <Box>
                        <SkeletonParagraph lines={5} />
                    </Box>
                ) : !c.summary.trim() ? (
                    <SummaryText sx={{ color: 'text.secondary' }}>{noSummaryFound}</SummaryText>
                ) : (
                    <SummaryText sx={isSummaryTranslating ? { opacity: 0.7 } : undefined}>
                        {summaryDisplayText}
                    </SummaryText>
                )}
            </SummaryContainer>
        </SectionContainer>
    );
}
