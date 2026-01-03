'use client';

import { type FunctionComponent, type MutableRefObject, useEffect, useState } from 'react';

import { CardContent } from '@mui/material';

import ResumeAlerts from './ResumeEditor/components/ResumeAlerts';
import ResumeFooter from './ResumeEditor/components/ResumeFooter';
import RefreshDataLossDialog from './ResumeEditor/components/RefreshDataLossDialog';
import { useResumeEditorController, type ResumeEditorMode } from './ResumeEditor/hooks/useResumeEditorController';
import ProfileHeader from './ResumeEditor/ProfileHeader';
import AdditionalInfoSection from './ResumeEditor/sections/AdditionalInfoSection';
import CertificatesSection from './ResumeEditor/sections/CertificatesSection';
import ExperienceSection from './ResumeEditor/sections/ExperienceSection';
import JobDescriptionSection from './ResumeEditor/sections/JobDescriptionSection';
import LanguagesSection from './ResumeEditor/sections/LanguagesSection';
import SkillsSection from './ResumeEditor/sections/SkillsSection';
import SummarySection from './ResumeEditor/sections/SummarySection';
import { MainCardContainer, ResumeContainer } from './ResumeEditor/styled';

interface ResumeEditorProps {
    setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep: (activeStep: number) => void;
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
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = ({ setStage, mode = 'editor', pdfTargetRef }) => {
    const c = useResumeEditorController({ mode, pdfTargetRef });
    const [isRefreshWarningOpen, setIsRefreshWarningOpen] = useState<boolean>(mode !== 'preview');

    useEffect(() => {
        // Avoid opening warning dialogs in preview-only rendering contexts (e.g. PDF export/off-screen render).
        if (mode === 'preview') return;
        setIsRefreshWarningOpen(true);
    }, [mode]);

    return (
        <ResumeContainer>
            <RefreshDataLossDialog open={isRefreshWarningOpen} onClose={() => setIsRefreshWarningOpen(false)} />
            <MainCardContainer ref={c.pdfRef}>
                <CardContent>
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

                    <SummarySection c={c} />
                    <SkillsSection c={c} />
                    <CertificatesSection c={c} />
                    <JobDescriptionSection c={c} />
                    <ExperienceSection c={c} />
                    <LanguagesSection c={c} />
                    <AdditionalInfoSection c={c} />
                </CardContent>
            </MainCardContainer>

            <ResumeFooter
                isPreview={c.isPreview}
                isDownloading={c.isDownloading}
                downloadProgress={c.downloadProgress}
                cvError={c.cvError}
                onDownloadPdf={() => void c.handleDownloadPdf()}
                onSubmit={() => setStage('MORE_FEATURES')}
            />
        </ResumeContainer>
    );
};

export default ResumeEditor;

 
