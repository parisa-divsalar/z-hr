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

type DashboardClientProps = {
  topStats: {
    cvsCount: number;
    shouldShowResumesCreatedCard: boolean;
    creditsRemaining?: number;
    interviewPractices?: number;
  };
};

export default function DashboardClient({ topStats }: DashboardClientProps) {
  return (
    <DashboardRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Dashboard
      </Typography>

      <TopStats
        cvsCount={topStats.cvsCount}
        shouldShowResumesCreatedCard={topStats.shouldShowResumesCreatedCard}
        creditsRemaining={topStats.creditsRemaining}
        interviewPractices={topStats.interviewPractices}
      />
      <ResumeBuilderCard />
      <SuggestedPositions />
      <CoverLetterSection />
      <InterviewSection />
      <SkillGapAnalysis />
      <CommunitySection />
    </DashboardRoot>
  );
}


