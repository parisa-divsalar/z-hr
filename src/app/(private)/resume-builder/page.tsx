'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeAIInput from '@/app/(private)/resume-builder/ResumeAIInput';
import ResumeBuilderStep1 from '@/app/(private)/resume-builder/ResumeBuilderStep1';
import ResumeBuilderStep2 from '@/app/(private)/resume-builder/ResumeBuilderStep2';
import ResumeBuilderStep3 from '@/app/(private)/resume-builder/ResumeBuilderStep3';
import { AIStatus } from '@/components/Landing/type';

import { ResumeBuilderRoot } from './styled';

const ResumeBuilder: FunctionComponent = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [activeStep, setActiveStep] = useState<number>(1);

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <ResumeBuilderStep1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />;
      case 2:
        return <ResumeBuilderStep2 setActiveStep={setActiveStep} />;
      case 3:
        return <ResumeBuilderStep3 setActiveStep={setActiveStep} />;
      default:
        return <Stack />;
    }
  };

  return (
    <ResumeBuilderRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Resume Builder
      </Typography>
      {aiStatus === 'START' && <ResumeAIInput setAiStatus={setAiStatus} />}

      {aiStatus === 'WIZARD' && renderStep()}

      {aiStatus !== 'START' && aiStatus !== 'WIZARD' && <Stack />}
    </ResumeBuilderRoot>
  );
};

export default ResumeBuilder;
