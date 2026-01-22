'use client';

import { Stack, Typography } from '@mui/material';

import CommunitySection from '@/components/dashboard/CommunitySection';
import SkillGapAnalysis from '@/components/dashboard/SkillGapAnalysis';
import { DashboardRoot } from '@/components/dashboard/styled';
import SuggestedPositions from '@/components/dashboard/SuggestedPositions';
import TopStats from '@/components/dashboard/TopStats';
import UpcomingInterview from '@/components/dashboard/UpcomingInterview';
import { InterviewDialogProvider } from '@/components/interview/StartInterviewDialogProvider';

const DashboardPage = () => {
  return (
    <InterviewDialogProvider>
      <DashboardRoot>
        <Stack spacing={{ xs: 1.5, md: 2 }}>
          <Typography variant='h5' color='text.primary' fontWeight='500'>
            Dashboard
          </Typography>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            flexWrap='wrap'
            gap={{ xs: 1.5, md: 0 }}
            sx={{ width: '100%' }}
          >
            <TopStats />
          </Stack>
        </Stack>
        <Stack spacing={{ xs: 2, md: 3 }} width='100%'>
          <UpcomingInterview />
          <SuggestedPositions />
          <CommunitySection />
          <SkillGapAnalysis />
        </Stack>
      </DashboardRoot>
    </InterviewDialogProvider>
  );
};

export default DashboardPage;
