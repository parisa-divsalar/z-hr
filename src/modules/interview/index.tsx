import type { FC } from 'react';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import HeadInterviewIcon from '@/assets/images/dashboard/headIterview.svg';
import InterviewStats from '@/components/interview/InterviewStats';
import RecentInterviews from '@/components/interview/RecentInterviews';
import { InterviewRoot } from '@/components/interview/styled';
import UpcomingInterview from '@/components/interview/UpcomingInterview';

type InterviewModuleProps = {
  onAction?: () => void;
};

const InterviewModule: FC<InterviewModuleProps> = () => {
  return (
    <InterviewRoot>
      <Typography variant='h5' color='text.primary' fontWeight='500'>
        Interview
      </Typography>

      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <InterviewStats />
      </Stack>

      <Grid size={{ xs: 12, md: 12 }}>
        <Stack direction='row' alignItems='center' gap={2} mt={3}>
          <HeadInterviewIcon />
          <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
            Interview History
          </Typography>
        </Stack>{' '}
        <UpcomingInterview />
        <RecentInterviews />
      </Grid>
    </InterviewRoot>
  );
};

export default InterviewModule;
