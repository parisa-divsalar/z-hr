import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import InterviewIcon from '@/assets/images/dashboard/imag/interview.svg';
import MuiButton from '@/components/UI/MuiButton';

import { SmallCardBase, StatValueRow } from './styled';

const InterviewStats = () => {
  return (
    <Grid container spacing={2} width='100%'>
      <Grid size={{ xs: 12, md: 6 }}>
        <SmallCardBase>
          <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Stack sx={{ width: 100, height: 100 }}>
                <InterviewIcon />
              </Stack>
              <Stack direction='column'>
                <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                  Chat Interview
                </Typography>
                <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                  2/3 free credits used
                </Typography>
                <Typography mt={1} variant='subtitle2' fontWeight='400' color='text.primary'>
                  2 Credit
                </Typography>
              </Stack>
            </Stack>
            <Stack mt={5}>
              {' '}
              <MuiButton variant='outlined' color='secondary'>
                Start{' '}
              </MuiButton>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <SmallCardBase>
          <StatValueRow sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Stack sx={{ width: 100, height: 100 }}>
                <InterviewIcon />
              </Stack>
              <Stack direction='column'>
                <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                  Chat Interview
                </Typography>
                <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                  2/3 free credits used
                </Typography>
                <Typography mt={1} variant='subtitle2' fontWeight='400' color='text.primary'>
                  2 Credit
                </Typography>
              </Stack>
            </Stack>
            <Stack mt={5}>
              {' '}
              <MuiButton variant='outlined' color='secondary'>
                Start{' '}
              </MuiButton>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>
    </Grid>
  );
};

export default InterviewStats;
