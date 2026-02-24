'use client';

import { type FunctionComponent, type MutableRefObject, useEffect, useMemo, useState } from 'react';

import { CardContent } from '@mui/material';

import { useUserProfile } from '@/hooks/useUserProfile';
import { getMainTranslations } from '@/locales/main';
import { trackEvent } from '@/lib/analytics';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';

import DeleteSectionDialog from './ResumeEditor/components/DeleteSectionDialog';
import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import { useResumeEditorController, type ResumeEditorController, type ResumeEditorMode } from './ResumeEditor/hooks/useResumeEditorController';
import ProfileHeader from './ResumeEditor/ProfileHeader';
import AdditionalInfoSection from './ResumeEditor/sections/AdditionalInfoSection';
import CertificatesSection from './ResumeEditor/sections/CertificatesSection';
import EducationSection from './ResumeEditor/sections/EducationSection';
import ExperienceSection from './ResumeEditor/sections/ExperienceSection';
import LanguagesSection from './ResumeEditor/sections/LanguagesSection';
import SelectedProjectsSection from './ResumeEditor/sections/SelectedProjectsSection';
import SkillsSection from './ResumeEditor/sections/SkillsSection';
import SummarySection from './ResumeEditor/sections/SummarySection';
import { MainCardContainer, ResumeContainer } from './ResumeEditor/styled';

import type { SectionKey } from './ResumeEditor/types';

interface ResumeEditorProps {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
    /**
     * Optional controller override to avoid re-fetching when switching templates.
     */
    controller?: ResumeEditorController;
    /**
     * When set to 'preview', edit/improve actions and footer buttons are hidden.
     * Useful for pages that only need the rendered resume + PDF export.
     */
    mode?: ResumeEditorMode;
    /**
     * Optional ref override for the element that should be exported as PDF.
     * If not provided, ResumeEditor manages its own ref internally.
     */
    pdfTargetRef?: MutableRefObject<HTMLDivElement | null>;
    /**
     * Optional API overrides for admin / tooling flows.
     */
    apiUserId?: string | null;
    requestIdOverride?: string | null;
    disableAutoPoll?: boolean;
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = ({
    setStage,
    controller,
    mode = 'editor',
    pdfTargetRef,
    apiUserId,
    requestIdOverride,
    disableAutoPoll,
}) => {
    const c = controller ?? useResumeEditorController({ mode, pdfTargetRef, apiUserId, requestIdOverride, disableAutoPoll });
    const { profile } = useUserProfile();
    const requestId = useWizardStore((state) => state.requestId);
    const locale = useLocaleStore((s) => s.locale);
    const [isRefreshWarningOpen, setIsRefreshWarningOpen] = useState<boolean>(mode !== 'preview');
    const sectionLabels: Record<SectionKey, string> = useMemo(() => {
        const t = getMainTranslations(locale).landing.wizard.resumeEditor;
        return {
            summary: t.sections.summary,
            skills: t.sections.skills,
            contactWays: t.sections.contactWays,
            education: t.sections.education,
            languages: t.sections.languages,
            certificates: t.sections.certificates,
            selectedProjects: t.sections.selectedProjects,
            experience: t.sections.experience,
            additionalInfo: t.sections.additionalInfo,
        };
    }, [locale]);

    const pendingDeleteLabel = c.pendingDeleteSection
        ? sectionLabels[c.pendingDeleteSection]
        : getMainTranslations(locale).landing.wizard.resumeEditor.thisSection;

    useEffect(() => {
        // Avoid opening warning dialogs in preview-only rendering contexts (e.g. PDF export/off-screen render).
        if (mode === 'preview') return;
        setIsRefreshWarningOpen(true);
    }, [mode]);

    const handleSubmit = () => {
        // Only track completion if no errors present
        if (!c.cvError && !c.saveError) {
            trackEvent('resume_completed', {
                user_id: profile?.id,
                resume_id: requestId,
                timestamp: new Date().toISOString(),
            });
        }
        setStage('MORE_FEATURES');
    };

    return (
        <ResumeContainer>
            <RefreshDataLossDialog open={isRefreshWarningOpen} onClose={() => setIsRefreshWarningOpen(false)} />
            <DeleteSectionDialog
                open={Boolean(c.pendingDeleteSection)}
                sectionLabel={pendingDeleteLabel}
                isDeleting={c.isDeletingSection}
                onCancel={c.cancelDeleteSection}
                onConfirm={() => void c.confirmDeleteSection()}
            />
            <MainCardContainer ref={c.pdfRef}>
                <CardContent
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2.5, sm: 3 },
                    }}
                >
                    <ProfileHeader
                        fullName={c.profile.fullName}
                        dateOfBirth={c.profile.dateOfBirth}
                        visaStatus={c.resolvedVisaStatus}
                        mainSkill={c.resolvedMainSkill}
                        phone={c.resolvedPhone}
                        email={c.resolvedEmail}
                        isEditing={!c.isPreview && c.editingSection === 'profile'}
                        onEdit={c.isPreview ? undefined : () => c.handleEdit('profile')}
                        onSave={c.isPreview ? undefined : c.handleSave}
                        onCancel={c.isPreview ? undefined : c.handleCancel}
                        isSaving={c.isSaving}
                        editText={c.profileEditText}
                        onEditTextChange={c.isPreview ? undefined : c.setProfileEditText}
                        showImproveIcon={false}
                        hideActions={c.isExporting || c.isPreview}
                    />

                    <ResumeAlerts
                        isCvLoading={c.isCvLoading}
                        cvError={c.cvError}
                        saveError={c.saveError}
                        improveError={c.improveError}
                        downloadError={c.downloadError}
                        onDismissSaveError={c.clearSaveError}
                        onDismissImproveError={c.clearImproveError}
                        onDismissDownloadError={c.clearDownloadError}
                    />

                    {!c.isSectionHidden('summary') ? <SummarySection c={c} /> : null}
                    {!c.isSectionHidden('skills') ? <SkillsSection c={c} /> : null}
                    {!c.isSectionHidden('education') ? <EducationSection c={c} /> : null}
                    {!c.isSectionHidden('certificates') ? <CertificatesSection c={c} /> : null}
                    {!c.isSectionHidden('experience') ? <ExperienceSection c={c} /> : null}
                    {!c.isSectionHidden('selectedProjects') ? <SelectedProjectsSection c={c} /> : null}
                    {!c.isSectionHidden('languages') ? <LanguagesSection c={c} /> : null}
                    {!c.isSectionHidden('additionalInfo') ? <AdditionalInfoSection c={c} /> : null}
                </CardContent>
            </MainCardContainer>

            <ResumeFooter
                isPreview={c.isPreview}
                isDownloading={c.isDownloading}
                downloadProgress={c.downloadProgress}
                cvError={c.cvError}
                onDownloadPdf={() => void c.handleDownloadPdf()}
                onSubmit={handleSubmit}
            />
        </ResumeContainer>
    );
};

export default ResumeEditor;

 
