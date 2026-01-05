'use client';

import { useState } from 'react';

import CoverLetter from '@/app/(private)/history-edite/tabs/CoverLetter';
import InterviewQuestionsTabContent from '@/app/(private)/history-edite/tabs/InterviewQuestionsTabContent';
import PositionsTabContent from '@/app/(private)/history-edite/tabs/PositionsTabContent';
import SkillGapTabContent from '@/app/(private)/history-edite/tabs/SkillGapTabContent';

import SkillGapTabs from './SkillGapTabs';
import { SkillGapContainer, SectionCard } from '../styled';

const GapSection = () => {
    const [activeTab, setActiveTab] = useState('interview-questions');

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <>
            <SkillGapTabs value={activeTab} onChange={handleTabChange} />

            <SectionCard>
                <SkillGapContainer>
                    {activeTab === 'skill-gap' && <SkillGapTabContent />}
                    {activeTab === 'interview-questions' && <InterviewQuestionsTabContent />}
                    {activeTab === 'positions' && <PositionsTabContent />}
                    {activeTab === 'cover-letter' && <CoverLetter />}
                </SkillGapContainer>
            </SectionCard>
        </>
    );
};

export default GapSection;
