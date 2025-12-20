'use client';

import { Grid, Stack, Typography } from '@mui/material';

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
        <Typography variant='h5' color='text.primary' fontWeight='500'>
          Dashboard
        </Typography>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <TopStats />
        </Stack>
        <Grid size={{ xs: 12, md: 12 }}>
          <UpcomingInterview />
          <SuggestedPositions />
          <CommunitySection />
          <SkillGapAnalysis />
        </Grid>
      </DashboardRoot>
    </InterviewDialogProvider>
  );
};

export default DashboardPage;
