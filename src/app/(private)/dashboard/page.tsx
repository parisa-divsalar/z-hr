'use client';

import { Typography } from '@mui/material';

import CommunitySection from '@/components/dashboard/CommunitySection';
import CoverLetterSection from '@/components/dashboard/CoverLetterSection';
import InterviewSection from '@/components/dashboard/InterviewSection';
import ResumeBuilderCard from '@/components/dashboard/ResumeBuilderCard';
import SkillGapAnalysis from '@/components/dashboard/SkillGapAnalysis';
import SuggestedPositions from '@/components/dashboard/SuggestedPositions';
import TopStats from '@/components/dashboard/TopStats';
import { DashboardRoot } from '@/components/dashboard/styled';

const DashboardPage = () => {
  return (
    <DashboardRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Dashboard
      </Typography>

      <TopStats />
      <ResumeBuilderCard />
      <SuggestedPositions />
      <CoverLetterSection />
      <InterviewSection />
      <SkillGapAnalysis />
      <CommunitySection />
    </DashboardRoot>
  );
};

export default DashboardPage;


