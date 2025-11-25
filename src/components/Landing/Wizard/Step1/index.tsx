import { FunctionComponent, useState } from 'react';

import { AIStatus, StageWizard } from '@/components/Landing/type';
import Questions from '@/components/Landing/Wizard/Step1/Questions';
import VoiceResult from '@/components/Landing/Wizard/Step1/Result';
import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';

interface Step1Props {
  setAiStatus: (status: AIStatus) => void;
  setActiveStep: (activeStep: number) => void;
}

const Step1: FunctionComponent<Step1Props> = ({ setAiStatus, setActiveStep }) => {
  const [stage, setStage] = useState<StageWizard>('RESULT');

  if (stage === 'RESULT') {
    return <VoiceResult onSubmit={() => setStage('SELECT_SKILL')} setAiStatus={setAiStatus} />;
  }

  if (stage === 'SELECT_SKILL') {
    return <SelectSkill setStage={setStage} />;
  }

  if (stage === 'SKILL_INPUT') {
    return <SKillInput setStage={setStage} />;
  }

  return <Questions onNext={() => setActiveStep(2)} setAiStatus={setAiStatus} />;
};

export default Step1;
