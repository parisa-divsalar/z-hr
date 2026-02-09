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

type SuggestedJob = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  locationType?: string;
  postedDate?: string;
  description?: string;
  techStack?: string[];
  applicationUrl?: string;
  fitScore: number;
  matchedResumeName: string;
};

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
  suggestedJobs?: SuggestedJob[];
};

export default function DashboardClient({ topStats, resumeInProgress, suggestedJobs = [] }: DashboardClientProps) {
  const creditsRemaining = Number(topStats.creditsRemaining ?? 0);
  const shouldShowCreditsDepletedBanner = creditsRemaining <= 0 && Boolean(resumeInProgress?.requestId);
  const isFirstResumeOnlyUser = Number(topStats.cvsCount) === 1;
  const hasAnyResume = Number(topStats.cvsCount) > 0;

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
      {hasAnyResume ? <SuggestedPositions suggestedJobs={suggestedJobs} /> : null}

      {/* UX rule: user who created exactly 1 resume only has Suggested Positions active; hide other feature sections */}
      {!isFirstResumeOnlyUser ? (
        <>
          <CoverLetterSection />
          <InterviewSection />
          <SkillGapAnalysis />
          <CommunitySection />
        </>
      ) : null}
    </DashboardRoot>
  );
}


