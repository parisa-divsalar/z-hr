import { FunctionComponent, useState } from 'react';

import { AIStatus, StageWizard } from '@/components/Landing/type';
import Questions from '@/components/Landing/Wizard/Step1/Questions';
import Experience from '@/components/Landing/Wizard/Step1/Experience';
import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';

interface Step1Props {
  setAiStatus: (status: AIStatus) => void;
  setActiveStep: (activeStep: number) => void;
}

const Step1: FunctionComponent<Step1Props> = ({ setAiStatus, setActiveStep }) => {
  const [stage, setStage] = useState<StageWizard>('SKILL_INPUT');

  if (stage === 'SKILL_INPUT') {
    return <SKillInput setStage={setStage} />;
  }

  if (stage === 'SELECT_SKILL') {
    return <SelectSkill setStage={setStage} />;
  }

  if (stage === 'EXPERIENCE') {
    return <Experience setStage={setStage} />;
  }

  return <Questions onNext={() => setActiveStep(2)} setAiStatus={setAiStatus} />;
};

export default Step1;
