'use client';
import { Grid, Stack, Typography } from '@mui/material';

import BackIcon from '@/assets/images/dashboard/imag/backIcon.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { ChatInterViewRoot, CenterGrayBox } from './styled';

const ChatInterView = () => {
  return (
    <ChatInterViewRoot>
      <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction='row' alignItems='center' gap={2}>
          <BackIcon />
          <Typography variant='h5' color='text.primary' fontWeight='500'>
            Chat Interview
          </Typography>
        </Stack>

        <Stack sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CenterGrayBox>
            <Typography variant='h5' color='text.primary' fontWeight='600' mt={4}>
              Chat Interview
            </Typography>

            <Stack direction='row' spacing={3} mt={4}>
              <Typography variant='body1' color='text.secondary' fontWeight='500'>
                Number of questions
              </Typography>
              <Typography variant='subtitle1' color='text.secondary' fontWeight='500'>
                Time duration
              </Typography>
            </Stack>

            <Stack direction='row' spacing={7} mt={1}>
              <Typography variant='h5' color='text.primary' fontWeight='600'>
                10 Questions
              </Typography>
              <Typography variant='h5' color='text.primary' fontWeight='600'>
                10 Minutes
              </Typography>
            </Stack>
            <Typography variant='subtitle1' color='text.primary' fontWeight='500' mt={5}>
              Are you ready?
            </Typography>
            <Stack my={5}>
              <MuiButton color='secondary' size='large' endIcon={<ArrowRightIcon />}>
                Let's Start
              </MuiButton>
            </Stack>
          </CenterGrayBox>
        </Stack>
      </Grid>
    </ChatInterViewRoot>
  );
};

export default ChatInterView;
