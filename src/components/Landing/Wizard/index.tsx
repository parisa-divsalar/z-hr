import { useState } from 'react';

import { Stack } from '@mui/material';

import ArrowLeftIcon from '@/assets/images/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import StepWrapper from '@/components/Landing/Wizard/Stepper';
import MuiButton from '@/components/UI/MuiButton';

const Wizard = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <Stack justifyContent='center' alignItems={'center'} p={2}>
      <StepWrapper activeStep={activeStep} />

      <Stack direction='row' mt={4} gap={2}>
        <MuiButton
          color='secondary'
          startIcon={<ArrowLeftIcon />}
          disabled={activeStep === 1}
          onClick={() => activeStep !== 1 && setActiveStep((prevState) => prevState - 1)}
        >
          Prev
        </MuiButton>

        <MuiButton
          color='secondary'
          endIcon={<ArrowRightIcon />}
          disabled={activeStep === 3}
          onClick={() => activeStep !== 3 && setActiveStep((prevState) => prevState + 1)}
        >
          Next
        </MuiButton>
      </Stack>
    </Stack>
  );
};

export default Wizard;
