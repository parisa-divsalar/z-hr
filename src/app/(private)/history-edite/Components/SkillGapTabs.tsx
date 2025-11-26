'use client';

import { useState } from 'react';

import { Tab } from '@mui/material';

import { TabsContainer, StyledTabs } from '../styled';

interface SkillGapTabsProps {
  onChange?: (tab: string) => void;
}

const SkillGapTabs = ({ onChange }: SkillGapTabsProps) => {
  const [activeTab, setActiveTab] = useState('skill-gap');

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    onChange?.(newValue);
  };

  return (
    <TabsContainer>
      <StyledTabs
        value={activeTab}
        onChange={handleChange}
        textColor='primary'
        indicatorColor='primary'
        variant='standard'
      >
        <Tab label='Suggested interview questions' value='interview-questions' />
        <Tab label='Suggested Positions' value='positions' />
        <Tab label='Skill Gap' value='skill-gap' />
      </StyledTabs>
    </TabsContainer>
  );
};

export default SkillGapTabs;
