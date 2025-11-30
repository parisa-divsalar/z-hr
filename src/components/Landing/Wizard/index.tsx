import { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import { AIStatus } from '@/components/Landing/type';
import Step1 from '@/components/Landing/Wizard/Step1';
import Step2 from '@/components/Landing/Wizard/Step2';
import Step3 from '@/components/Landing/Wizard/Step3';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

interface WizardProps {
  setAiStatus: (status: AIStatus) => void;
  initialStep?: number;
}

const Wizard: FunctionComponent<WizardProps> = (props) => {
  const { setAiStatus, initialStep = 1 } = props;
  const [activeStep, setActiveStep] = useState<number>(initialStep);

  const getSubChildWizard = () => {
    switch (activeStep) {
      case 1:
        return <Step1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />;
      case 2:
        return <Step2 setActiveStep={setActiveStep} />;
      case 3:
        return <Step3 setActiveStep={setActiveStep} />;
      default:
        return <Stack />;
    }
  };

  return (
    <Stack width='100%' height='100%' alignItems='center' p={5}>
      <StepWrapper activeStep={activeStep} />

      {getSubChildWizard()}
    </Stack>
  );
};

export default Wizard;
