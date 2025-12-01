'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import ResumeAIInput from '@/app/(private)/resume-builder/ResumeAIInput';
import ResumeBuilderStep1 from '@/app/(private)/resume-builder/ResumeBuilderStep1';
import { AIStatus } from '@/components/Landing/type';
import Thinking from '@/components/Landing/Wizard/Step2/Thinking';
import Step3 from '@/components/Landing/Wizard/Step3';

import { ResumeBuilderRoot } from './styled';

const ResumeBuilder: FunctionComponent = () => {
  const [aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <ResumeBuilderRoot>
      {aiStatus === 'START' ? (
        <ResumeAIInput setAiStatus={setAiStatus} />
      ) : aiStatus === 'WIZARD' ? (
        activeStep === 1 ? (
          <ResumeBuilderStep1 setAiStatus={setAiStatus} setActiveStep={setActiveStep} />
        ) : activeStep === 2 ? (
          <Thinking
            onCancel={() => {
              setAiStatus('START');
              setActiveStep(1);
            }}
            setActiveStep={setActiveStep}
          />
        ) : activeStep === 3 ? (
          <Step3 setActiveStep={setActiveStep} />
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
