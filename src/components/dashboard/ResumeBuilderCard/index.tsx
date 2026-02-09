'use client';

import { Stack, Typography } from '@mui/material';

import { ResumeBuilderCardRoot } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

const ResumeBuilderCard = () => {
  return (
    <ResumeBuilderCardRoot>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 2, sm: 3 }}
      >
        <Stack gap={0.75} sx={{ minWidth: 0 }}>
          <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
            Resume Builder
          </Typography>

          <Stack direction='row' gap={2} alignItems='center' sx={{ flexWrap: 'wrap' }}>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              First Step
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              •
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              09/09/2025
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              •
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              2/9
            </Typography>
          </Stack>
        </Stack>

        <MuiButton
          text='Continue'
          color='secondary'
          sx={{
            height: 40,
            px: 3,
            borderRadius: 2,
            alignSelf: { xs: 'stretch', sm: 'center' },
            minWidth: { xs: '100%', sm: 130 },
          }}
        />
      </Stack>
    </ResumeBuilderCardRoot>
  );
};

export default ResumeBuilderCard;


