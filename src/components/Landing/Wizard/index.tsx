import { useState } from 'react';

import { Stack } from '@mui/material';

import Step1 from '@/components/Landing/Wizard/Step1';
import Step2 from '@/components/Landing/Wizard/Step2';
import Step3 from '@/components/Landing/Wizard/Step3';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

const Wizard = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showSelectSkill, setShowSelectSkill] = useState(true);

  const getSubChildWizard = () => {
    switch (activeStep) {
      case 1:
        return (
          <Step1
            setActiveStep={setActiveStep}
            showSelectSkill={showSelectSkill}
            setShowSelectSkill={setShowSelectSkill}
          />
        );
      case 2:
        return <Step2 setActiveStep={setActiveStep} />;
      case 3:
        return <Step3 />;
      default:
        return <Stack />;
    }
  };

  return (
    <Stack alignItems='center' height='100%' p={5}>
      <StepWrapper activeStep={activeStep} />

      {getSubChildWizard()}
    </Stack>
  );
};

export default Wizard;
