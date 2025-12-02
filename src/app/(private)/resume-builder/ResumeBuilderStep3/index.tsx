import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import MoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

interface ResumeBuilderStep3Props {
  setActiveStep: (activeStep: number) => void;
}

type Stage = 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME';

const ResumeBuilderStep3: FunctionComponent<ResumeBuilderStep3Props> = ({ setActiveStep }) => {
  const [stage, setStage] = useState<Stage>('RESUME_EDITOR');

  if (stage === 'RESUME_EDITOR') {
    return (
      <Stack width='100%' height='100%' alignItems='center' p={5}>
        <StepWrapper activeStep={3} />
        <Stack alignItems='center' height='100%' p={2}>
          <Typography variant='h5' color='text.primary' fontWeight='600' mt={2}>
            CV Preview
          </Typography>
          <Typography variant='h6' color='text.primary' my={1}>
            You can view and edit resume
          </Typography>

          <ResumeEditor setStage={setStage} setActiveStep={setActiveStep} />
        </Stack>
      </Stack>
    );
  }

  if (stage === 'MORE_FEATURES') {
    return (
      <MoreFeatures
        onBack={() => setStage('RESUME_EDITOR')}
        onSubmit={() => {
          setStage('RESUME_GENERATOR_FRAME');
        }}
      />
    );
  }

  return <ResumeGeneratorFrame />;
};

export default ResumeBuilderStep3;
