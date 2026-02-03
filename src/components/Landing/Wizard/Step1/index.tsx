import { FunctionComponent, useEffect, useState } from 'react';

import { AIStatus, StageWizard } from '@/components/Landing/type';
import Certification from '@/components/Landing/Wizard/Step1/Certification';
import Experience from '@/components/Landing/Wizard/Step1/Experience';
import JobDescription from '@/components/Landing/Wizard/Step1/JobDescription';
import Questions from '@/components/Landing/Wizard/Step1/Questions';
import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';
import { buildWizardSerializable, useWizardStore } from '@/store/wizard';
import { apiClientClient } from '@/services/api-client';
import { improveResume } from '@/services/cv/improve-resume';
import { useAuthStore } from '@/store/auth';
import { clearWizardTextOnlySession, saveWizardTextOnlySession } from '@/utils/wizardTextOnlySession';

interface Step1Props {
    setAiStatus: (status: AIStatus) => void;
    setActiveStep: (activeStep: number) => void;
}

const Step1: FunctionComponent<Step1Props> = ({ setAiStatus, setActiveStep }) => {
    const [stage, setStage] = useState<StageWizard>('SKILL_INPUT');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recomputeAllFiles = useWizardStore((s) => s.recomputeAllFiles);
    const validate = useWizardStore((s) => s.validate);
    const setRequestId = useWizardStore((s) => s.setRequestId);
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        const container = document.getElementById('resume-builder-scroll');
        if (!container) return;
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }, [stage]);

    if (stage === 'SKILL_INPUT') {
        return <SKillInput setStage={setStage} />;
    }

    if (stage === 'SELECT_SKILL') {
        return <SelectSkill setStage={setStage} />;
    }

    if (stage === 'EXPERIENCE') {
        return <Experience setStage={setStage} />;
    }

    if (stage === 'CERTIFICATION') {
        return <Certification setStage={setStage} />;
    }

    if (stage === 'DESCRIPTION') {
        return <JobDescription setStage={setStage} />;
    }

    const handleFinalSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            recomputeAllFiles();

            const state = useWizardStore.getState();
            const isValid = validate();
            if (!isValid) {
                setStage('SKILL_INPUT');
                return;
            }

            const wizardData = state.data;
            const serializableWizard = buildWizardSerializable(wizardData);
            const isAuthenticated = Boolean(accessToken);
            const fallbackRequestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            /**
             * Important:
             * Each final submit should create a **new resume** (new row in `cvs.json`),
             * so we must NOT reuse a previously stored requestId (sessionStorage).
             * Otherwise, the next resume overwrites the previous one and admin shows only 1.
             */
            let finalRequestId = fallbackRequestId;
            let analysisResult: unknown = null;

            if (isAuthenticated) {
                try {
                    const saveRes = await apiClientClient.post('wizard/save', {
                        requestId: finalRequestId,
                        wizardData: serializableWizard,
                    });
                    const savedRequestId = saveRes?.data?.data?.requestId;
                    if (typeof savedRequestId === 'string' && savedRequestId.trim()) {
                        finalRequestId = savedRequestId.trim();
                    }
                } catch (error) {
                    console.error('Failed to save wizard data:', error);
                }
            }

            try {
                const analyzeRes = await apiClientClient.post('cv/analyze', {
                    cvText: JSON.stringify(serializableWizard),
                    requestId: finalRequestId,
                });
                analysisResult = analyzeRes?.data?.analysis ?? analyzeRes?.data?.data?.analysis ?? null;
            } catch (error) {
                console.error('Failed to analyze CV:', error);
            }

            if (analysisResult) {
                try {
                    await improveResume({
                        resume: analysisResult,
                        mode: 'analysis',
                        isFinalStep: true,
                    });
                } catch (error) {
                    console.error('Failed to improve CV:', error);
                }
            }

            if (isAuthenticated) setRequestId(finalRequestId);
            const hasAnyFilesOrVoices = (wizardData.allFiles?.length ?? 0) > 0;

            if (!hasAnyFilesOrVoices) {
                saveWizardTextOnlySession(wizardData);
                // keep it so Step3 can still fetch/edit the backend CV.
                if (!isAuthenticated) {
                    setRequestId(null);
                }
                setActiveStep(3);
                return;
            }

            clearWizardTextOnlySession();
            setActiveStep(2);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Questions
            onNext={handleFinalSubmit}
            setAiStatus={setAiStatus}
            setStage={setStage}
            isSubmitting={isSubmitting}
        />
    );
};

export default Step1;
