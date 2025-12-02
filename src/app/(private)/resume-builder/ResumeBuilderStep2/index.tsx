import React, { FunctionComponent } from 'react';

import { Stack } from '@mui/material';

import Thinking from '@/components/Landing/Wizard/Step2/Thinking';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

interface ResumeBuilderStep2Props {
  setActiveStep: (activeStep: number) => void;
}

const ResumeBuilderStep2: FunctionComponent<ResumeBuilderStep2Props> = ({ setActiveStep }) => {
  return (
    <Stack width='100%' height='100%' alignItems='center' p={5}>
      <StepWrapper activeStep={2} />
      <Thinking onCancel={() => setActiveStep(1)} setActiveStep={setActiveStep} />
    </Stack>
  );
};

export default ResumeBuilderStep2;
