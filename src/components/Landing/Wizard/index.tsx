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
  variant?: 'landing' | 'resume-builder';
}

const Wizard: FunctionComponent<WizardProps> = (props) => {
  const { setAiStatus, initialStep = 1, variant = 'landing' } = props;
  const [activeStep, setActiveStep] = useState<number>(initialStep);

  const getSubChildWizard = () => {
    switch (activeStep) {
      case 1:
        return <Step1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />;
      case 2:
        return <Step2 setActiveStep={setActiveStep} />;
      case 3:
        return <Step3 setActiveStep={setActiveStep} variant={variant} />;
      default:
        return <Stack />;
    }
  };

  return (
    <Stack
      width='100%'
      height={variant === 'resume-builder' ? 'auto' : '100%'}
      alignItems='center'
      py={5}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: 0,
        // On resume-builder, content can be taller than viewport and should scroll via the page container
        overflow: variant === 'resume-builder' ? 'visible' : 'hidden',
      }}
    >
      <StepWrapper activeStep={activeStep} />

      {getSubChildWizard()}
    </Stack>
  );
};

export default Wizard;
