'use client';

import { useState } from 'react';

import { Tab } from '@mui/material';

import { TabsContainer, StyledTabs } from '../styled';

interface SkillGapTabsProps {
  onChange?: (tab: string) => void;
  value?: string;
}

const DEFAULT_TAB = 'interview-questions';

const SkillGapTabs = ({ onChange, value }: SkillGapTabsProps) => {
  const [uncontrolledTab, setUncontrolledTab] = useState(DEFAULT_TAB);
  const activeTab = value ?? uncontrolledTab;

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (value === undefined) setUncontrolledTab(newValue);
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
        <Tab label='Cover letter' value='cover-letter' />
      </StyledTabs>
    </TabsContainer>
  );
};

export default SkillGapTabs;
