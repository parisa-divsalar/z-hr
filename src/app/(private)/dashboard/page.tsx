'use client';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import CommunitySection from '@/components/dashboard/CommunitySection';
import SkillGapAnalysis from '@/components/dashboard/SkillGapAnalysis';
import { DashboardRoot } from '@/components/dashboard/styled';
import SuggestedPositions from '@/components/dashboard/SuggestedPositions';
import TopStats from '@/components/dashboard/TopStats';
import UpcomingInterview from '@/components/dashboard/UpcomingInterview';

const DashboardPage = () => {
  return (
    <DashboardRoot>
      <Typography variant='subtitle1' color='text.primary' fontWeight='600'>
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
  );
};

export default DashboardPage;
