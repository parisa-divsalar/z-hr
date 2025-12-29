import { FunctionComponent, useEffect, useState } from 'react';

import { AIStatus, StageWizard } from '@/components/Landing/type';
import Certification from '@/components/Landing/Wizard/Step1/Certification';
import Experience from '@/components/Landing/Wizard/Step1/Experience';
import JobDescription from '@/components/Landing/Wizard/Step1/JobDescription';
import Questions from '@/components/Landing/Wizard/Step1/Questions';
import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';
import { useWizardStore } from '@/store/wizard';
import { clearWizardTextOnlySession, saveWizardTextOnlySession } from '@/utils/wizardTextOnlySession';

interface Step1Props {
    setAiStatus: (status: AIStatus) => void;
    setActiveStep: (activeStep: number) => void;
}

const Step1: FunctionComponent<Step1Props> = ({ setAiStatus, setActiveStep }) => {
    const [stage, setStage] = useState<StageWizard>('SKILL_INPUT');
    const recomputeAllFiles = useWizardStore((s) => s.recomputeAllFiles);
    const validate = useWizardStore((s) => s.validate);
    const setRequestId = useWizardStore((s) => s.setRequestId);

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

    const handleFinalSubmit = () => {
        recomputeAllFiles();

        const state = useWizardStore.getState();
        const isValid = validate();
        if (!isValid) {
            setStage('SKILL_INPUT');
            return;
        }

        const wizardData = state.data;
        const hasAnyFilesOrVoices = (wizardData.allFiles?.length ?? 0) > 0;

        if (!hasAnyFilesOrVoices) {
            saveWizardTextOnlySession(wizardData);
            setRequestId(null);
            setActiveStep(3);
            return;
        }

        clearWizardTextOnlySession();
        setActiveStep(2);
    };

    return <Questions onNext={handleFinalSubmit} setAiStatus={setAiStatus} setStage={setStage} />;
};

export default Step1;
