'use client';

import { Typography } from '@mui/material';

import CommunitySection from '@/components/dashboard/CommunitySection';
import CoverLetterSection from '@/components/dashboard/CoverLetterSection';
import CreditsDepletedBanner from '@/components/dashboard/CreditsDepletedBanner';
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
  resumeInProgress?: {
    requestId: string;
    updatedAt: string;
    step?: string;
    completedSections: number;
    totalSections: number;
  } | null;
};

export default function DashboardClient({ topStats, resumeInProgress }: DashboardClientProps) {
  const creditsRemaining = Number(topStats.creditsRemaining ?? 0);
  const shouldShowCreditsDepletedBanner = creditsRemaining <= 0 && Boolean(resumeInProgress?.requestId);

  return (
    <DashboardRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Dashboard
      </Typography>

      <TopStats
        cvsCount={topStats.cvsCount}
        shouldShowResumesCreatedCard={topStats.shouldShowResumesCreatedCard}
        creditsRemaining={creditsRemaining}
        interviewPractices={topStats.interviewPractices}
      />

      {shouldShowCreditsDepletedBanner && <CreditsDepletedBanner />}

      <ResumeBuilderCard resumeInProgress={resumeInProgress} creditsRemaining={creditsRemaining} />
      <SuggestedPositions />
      <CoverLetterSection />
      <InterviewSection />
      <SkillGapAnalysis />
      <CommunitySection />
    </DashboardRoot>
  );
}


