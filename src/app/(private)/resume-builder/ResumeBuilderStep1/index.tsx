'use client';

import React, { FunctionComponent, useState } from 'react';

import MoreFeatures from '@/app/(private)/resume-builder/MoreFeatures';
import ResumeGeneratorFrame from '@/app/(private)/resume-builder/ResumeGeneratorFrame';
import { StageWizard, AIStatus } from '@/components/Landing/type';

import ResumeBuilderStep1Questions from '../ResumeBuilderStep1Questions';
import ResumeBuilderStep1SelectSkill from '../ResumeBuilderStep1SelectSkill';
import ResumeBuilderStep1SkillInput from '../ResumeBuilderStep1SkillInput';
import ResumeBuilderStep1VoiceResult from '../ResumeBuilderStep1VoiceResult';
import { Step1Wrapper } from './styled';

interface ResumeBuilderStep1Props {
  setAiStatus: (status: AIStatus) => void;
  setActiveStep: (step: number) => void;
}

const ResumeBuilderStep1: FunctionComponent<ResumeBuilderStep1Props> = ({ setAiStatus }) => {
  const [stage, setStage] = useState<StageWizard>('RESULT');
  const [showMoreFeatures, setShowMoreFeatures] = useState<boolean>(false);
  const [showResumeGenerator, setShowResumeGenerator] = useState<boolean>(false);

  if (showResumeGenerator) {
    return <ResumeGeneratorFrame />;
  }

  if (showMoreFeatures) {
    return (
      <MoreFeatures
        onBack={() => setShowMoreFeatures(false)}
        onSubmit={() => {
          setShowResumeGenerator(true);
        }}
      />
    );
  }

  if (stage === 'RESULT') {
    return <ResumeBuilderStep1VoiceResult onSubmit={() => setStage('SELECT_SKILL')} setAiStatus={setAiStatus} />;
  }

  if (stage === 'SELECT_SKILL') {
    return <ResumeBuilderStep1SelectSkill setStage={setStage} />;
  }

  if (stage === 'SKILL_INPUT') {
    return <ResumeBuilderStep1SkillInput setStage={setStage} />;
  }

  return (
    <Step1Wrapper>
      <ResumeBuilderStep1Questions
        onNext={() => {
          setShowMoreFeatures(true);
        }}
        setAiStatus={setAiStatus}
      />
    </Step1Wrapper>
  );
};

export default ResumeBuilderStep1;
