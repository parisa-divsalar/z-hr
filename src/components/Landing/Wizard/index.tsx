import { useState } from 'react';

import { Container, Stack } from '@mui/material';

import Step1 from '@/components/Landing/Wizard/Step1';
import Step2 from '@/components/Landing/Wizard/Step2';
import Step3 from '@/components/Landing/Wizard/Step3';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

const Wizard = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const getSubChildWizard = () => {
    switch (activeStep) {
      case 1:
        return <Step1 setActiveStep={setActiveStep} />;
      case 2:
        return <Step2 setActiveStep={setActiveStep} />;
      case 3:
        return <Step3 />;
      default:
        return <Stack />;
    }
  };

  return (
    <Container
      maxWidth='lg'
      sx={{
        py: 5,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Stack width='100%' maxWidth={880} spacing={4}>
        <StepWrapper activeStep={activeStep} />
        {getSubChildWizard()}
      </Stack>
    </Container>
  );
};

export default Wizard;
