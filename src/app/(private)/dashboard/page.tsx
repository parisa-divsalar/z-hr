'use client';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import CommunitySection from '@/components/Dashboard/CommunitySection';
import SkillGapAnalysis from '@/components/Dashboard/SkillGapAnalysis';
import { DashboardRoot } from '@/components/Dashboard/styled';
import SuggestedPositions from '@/components/Dashboard/SuggestedPositions';
import TopStats from '@/components/Dashboard/TopStats';
import UpcomingInterview from '@/components/Dashboard/UpcomingInterview';

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
