import { Typography } from '@mui/material';

import MuiChips from '@/components/UI/MuiChips';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import SkeletonParagraph from '../components/SkeletonParagraph';
import SectionHeader from '../SectionHeader';
import { SectionContainer, SkillsContainer, SkillTextField } from '../styled';

import type { ResumeEditorController } from '../hooks/useResumeEditorController';

type Props = { c: ResumeEditorController };

export default function SkillsSection({ c }: Props) {
    const locale = useLocaleStore((s) => s.locale);
    const mainT = getMainTranslations(locale);
    const resumeEditorT = mainT.landing.wizard.resumeEditor;
    const skillCategoryFa = (mainT.landing.skillCategoryFa ?? {}) as Record<string, string>;
    const sectionTitle = resumeEditorT.sections.skills;
    const noSkillsFound = resumeEditorT.noSkillsFound;
    const displaySkills =
        locale === 'fa' && Object.keys(skillCategoryFa).length > 0
            ? c.skills.map((s) => skillCategoryFa[String(s ?? '').trim()] ?? s)
            : c.skills;
    const isEditing = !c.isPreview && c.editingSection === 'skills';
    const hasContent = c.skills.some((skill) => String(skill ?? '').trim().length > 0);
    const shouldRender =
        !c.isPreview ||
        hasContent ||
        isEditing ||
        c.shouldBlockBelowSummary ||
        (c.isAutoPipelineMode && c.shouldSkeletonSection('skills'));

    if (!shouldRender) return null;

    return (
        <SectionContainer>
            <SectionHeader
                title={sectionTitle}
                onEdit={c.isPreview ? undefined : () => c.handleEdit('skills')}
                onDelete={c.isPreview ? undefined : () => c.requestDeleteSection('skills')}
                onImprove={c.isPreview || c.isTextOnlyMode ? undefined : () => void c.handleImprove('skills')}
                isEditing={isEditing}
                isImproving={!c.isPreview && c.improvingSection === 'skills'}
                improveDisabled={Boolean(c.improvingSection) && c.improvingSection !== 'skills'}
                deleteDisabled={c.isSaving || c.isDeletingSection}
                isSaving={c.isSaving}
                onSave={c.isPreview ? undefined : c.handleSave}
                onCancel={c.isPreview ? undefined : c.handleCancel}
                showImproveIcon={false}
                hideActions={c.isExporting || c.isPreview || c.shouldBlockBelowSummary}
                actionsSkeleton={c.shouldBlockBelowSummary}
            />

            <SkillsContainer>
                {c.shouldBlockBelowSummary ? (
                    <SkeletonParagraph lines={3} />
                ) : c.isAutoPipelineMode && c.shouldSkeletonSection('skills') ? (
                    <SkeletonParagraph lines={3} />
                ) : c.skills.length === 0 ? (
                    <Typography variant='body2' color='text.secondary'>
                        {noSkillsFound}
                    </Typography>
                ) : !c.isPreview && c.editingSection === 'skills' ? (
                    c.skills.map((skill, index) => (
                        <SkillTextField
                            key={index}
                            value={skill}
                            onChange={(e) => c.handleSkillsChange(index, e.target.value)}
                            size='small'
                        />
                    ))
                ) : (
                    displaySkills.map((skill, index) => (
                        <MuiChips key={`${c.skills[index] ?? skill}-${index}`} label={skill} sx={{ mt: 0 }} />
                    ))
                )}
            </SkillsContainer>
        </SectionContainer>
    );
}
