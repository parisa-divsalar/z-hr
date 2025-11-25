import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

import CommunitySection from '@/components/dashboard/CommunitySection';
import SkillGapAnalysis from '@/components/dashboard/SkillGapAnalysis';
import { DashboardRoot } from '@/components/dashboard/styled';
import SuggestedPositions from '@/components/dashboard/SuggestedPositions';
import TopStats from '@/components/dashboard/TopStats';
import UpcomingInterview from '@/components/dashboard/UpcomingInterview';
import MuiButton from '@/components/UI/MuiButton';

type DashboardModuleProps = {
  onLogout?: () => void;
};

const DashboardModule = ({ onLogout }: DashboardModuleProps) => {
  return (
    <DashboardRoot>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <TopStats />

        {onLogout && (
          <MuiButton size='small' color='error' onClick={onLogout} sx={{ borderRadius: 999 }}>
            خروج
          </MuiButton>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <UpcomingInterview />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SuggestedPositions />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CommunitySection />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SkillGapAnalysis />
        </Grid>
      </Grid>
    </DashboardRoot>
  );
};

export default DashboardModule;
