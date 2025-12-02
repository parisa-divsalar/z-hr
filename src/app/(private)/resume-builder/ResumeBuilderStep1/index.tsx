'use client';

import React, { FunctionComponent, useState } from 'react';

import { Stack } from '@mui/material';

import { StageWizard, AIStatus } from '@/components/Landing/type';
import StepWrapper from '@/components/Landing/Wizard/Stepper';

import ResumeBuilderStep1Questions from './ResumeBuilderStep1Questions';
import ResumeBuilderStep1SelectSkill from './ResumeBuilderStep1SelectSkill';
import ResumeBuilderStep1SkillInput from './ResumeBuilderStep1SkillInput';
import ResumeBuilderStep1VoiceResult from './ResumeBuilderStep1VoiceResult';
import { Step1Wrapper } from './styled';

interface ResumeBuilderStep1Props {
  setAiStatus: (status: AIStatus) => void;
  setActiveStep: (step: number) => void;
}

const ResumeBuilderStep1: FunctionComponent<ResumeBuilderStep1Props> = ({ setAiStatus, setActiveStep }) => {
  const [stage, setStage] = useState<StageWizard>('RESULT');

  if (stage === 'RESULT') {
    return (
      <Stack width='100%' height='100%' alignItems='center' p={5}>
        <StepWrapper activeStep={1} />
        <ResumeBuilderStep1VoiceResult onSubmit={() => setStage('SELECT_SKILL')} setAiStatus={setAiStatus} />
      </Stack>
    );
  }

  if (stage === 'SELECT_SKILL') {
    return (
      <Stack width='100%' height='100%' alignItems='center' p={5}>
        <StepWrapper activeStep={1} />
        <ResumeBuilderStep1SelectSkill setStage={setStage} />
      </Stack>
    );
  }

  if (stage === 'SKILL_INPUT') {
    return (
      <Stack width='100%' height='100%' alignItems='center' p={5}>
        <StepWrapper activeStep={1} />
        <ResumeBuilderStep1SkillInput setStage={setStage} />
      </Stack>
    );
  }

  return (
    <Stack width='100%' height='100%' alignItems='center' p={5}>
      <StepWrapper activeStep={1} />
      <Step1Wrapper>
        <ResumeBuilderStep1Questions
          onNext={() => {
            setActiveStep(2);
          }}
          setAiStatus={setAiStatus}
        />
      </Step1Wrapper>
    </Stack>
  );
};

export default ResumeBuilderStep1;
