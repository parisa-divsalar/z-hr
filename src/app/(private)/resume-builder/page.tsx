'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeAIInput from '@/app/(private)/resume-builder/ResumeAIInput';
import ResumeBuilderStep1 from '@/app/(private)/resume-builder/ResumeBuilderStep1';
import { AIStatus } from '@/components/Landing/type';

import { ResumeBuilderRoot } from './styled';

const ResumeBuilder: FunctionComponent = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <ResumeBuilderRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Resume Builder
      </Typography>
      {aiStatus === 'START' ? (
        <ResumeAIInput setAiStatus={setAiStatus} />
      ) : aiStatus === 'WIZARD' ? (
        activeStep === 1 ? (
          <ResumeBuilderStep1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />
        ) : (
          <Stack />
        )
      ) : (
        <Stack />
      )}
    </ResumeBuilderRoot>
  );
};

export default ResumeBuilder;
