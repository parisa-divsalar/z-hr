import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeBuilderMoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import MoreFeatures from '@/components/Landing/Wizard/Step3/MoreFeatures';

import ResumeEditor from './ResumeEditor';

interface Step3Props {
  setActiveStep: (activeStep: number) => void;
  variant?: 'landing' | 'resume-builder';
}

const Step3: FunctionComponent<Step3Props> = (props) => {
  const { setActiveStep, variant = 'landing' } = props;
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

  if (stage === 'MORE_FEATURES') {
    if (variant === 'resume-builder') {
      return (
        <Stack width='100%'>
          <ResumeBuilderMoreFeatures onBack={() => setStage('RESUME_EDITOR')} onSubmit={() => setStage('RESUME_GENERATOR_FRAME')} />
        </Stack>
      );
    }

    return <MoreFeatures setStage={setStage} />;
  }

  if (stage === 'RESUME_GENERATOR_FRAME') {
    return <ResumeGeneratorFrame />;
  }

  return null;
};

export default Step3;
