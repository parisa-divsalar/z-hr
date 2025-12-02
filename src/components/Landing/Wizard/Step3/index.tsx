import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import MoreFeatures from '@/components/Landing/Wizard/Step3/MoreFeatures';

import ResumeEditor from './ResumeEditor';

interface Step3Props {
  setActiveStep: (activeStep: number) => void;
}

const Step3: FunctionComponent<Step3Props> = (props) => {
  const { setActiveStep } = props;
  const [stage, setStage] = useState<'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME'>('RESUME_EDITOR');

  if (stage === 'RESUME_EDITOR')
    return (
      <Stack alignItems='center' height='100%' p={2}>
        <Typography variant='h5' color='text.primary' fontWeight='600' mt={2}>
          CV Preview
        </Typography>
        <Typography variant='h6' color='text.primary' my={1}>
          You can view and edit resume
        </Typography>

        <ResumeEditor setStage={setStage} setActiveStep={setActiveStep} />
      </Stack>
    );
  else return <MoreFeatures setStage={setStage} />;
};

export default Step3;
