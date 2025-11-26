'use client';

import { useState } from 'react';

import SkillGapTabs from './SkillGapTabs';
import { SkillGapContainer, SectionCard } from '../styled';
import { SkillGapTabContent, InterviewQuestionsTabContent, PositionsTabContent } from '../tabs';

const GapSection = () => {
  const [activeTab, setActiveTab] = useState('skill-gap');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <SkillGapTabs onChange={handleTabChange} />

      <SectionCard>
        <SkillGapContainer>
          {activeTab === 'skill-gap' && <SkillGapTabContent />}
          {activeTab === 'interview-questions' && <InterviewQuestionsTabContent />}
          {activeTab === 'positions' && <PositionsTabContent />}
        </SkillGapContainer>
      </SectionCard>
    </>
  );
};

export default GapSection;
