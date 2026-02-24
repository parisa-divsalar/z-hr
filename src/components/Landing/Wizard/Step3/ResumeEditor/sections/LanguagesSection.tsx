import { Box, Typography } from '@mui/material';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { ExperienceTextareaAutosize, SectionContainer, SummaryText } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';

type Props = { c: ResumeEditorController };

export default function LanguagesSection({ c }: Props) {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).landing.wizard.resumeEditor;
    const sectionTitle = t.sections.languages;
    const noLanguagesFound = t.noLanguagesFound;
    const isEditing = !c.isPreview && c.editingSection === 'languages';
    const hasContent = c.languages.some((lang) => String(lang?.name ?? '').trim().length > 0);
    const shouldRender =
        !c.isPreview ||
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('languages'));

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title={sectionTitle}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('languages')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('languages')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('languages')}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'languages'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'languages'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
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
                        {noLanguagesFound}
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
