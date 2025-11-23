import { FunctionComponent, useState } from 'react';

import Questions from '@/components/Landing/Wizard/Step1/Questions';
import VoiceResult from '@/components/Landing/Wizard/Step1/Result';
import SKillInput from '@/components/Landing/Wizard/Step1/SKillInput';
import SelectSkill from '@/components/Landing/Wizard/Step1/SlectSkill';

interface Step1Props {
  setActiveStep: (activeStep: number) => void;
}

const Step1: FunctionComponent<Step1Props> = ({ setActiveStep }) => {
  const [stage, setStage] = useState<'result' | 'selectSkill' | 'skillInput' | 'questions'>('result');

  if (stage === 'result') {
    return <VoiceResult onSubmit={() => setStage('selectSkill')} />;
  }

  if (stage === 'selectSkill') {
    return (
      <SelectSkill
        setShowSelectSkill={(show) => {
          setStage(show ? 'selectSkill' : 'skillInput');
        }}
      />
    );
  }

  if (stage === 'skillInput') {
    return <SKillInput onNext={() => setStage('questions')} />;
  }

  return <Questions onNext={() => setActiveStep(2)} />;
};

export default Step1;
