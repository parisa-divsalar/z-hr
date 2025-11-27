import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiChips from '@/components/UI/MuiChips';

import { CardBaseiNTER, SectionHeader } from './styled';

const UpcomingInterview = () => {
  return (
    <CardBaseiNTER mt={2}>
      <SectionHeader>
        <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
          Interview
        </Typography>
        <MuiButton text='Continue' color='secondary' variant='contained' endIcon={<ArrowRightIcon />} />
      </SectionHeader>

      <Stack>
        <Stack gap={1}>
          <Stack direction='row' gap={1.5} alignItems='center'>
            <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
              Chat Interview
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
              09/09/2025
            </Typography>
            <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
              9/2
            </Typography>

            <MuiChips
              label='7 Steps left'
              color='white'
              sx={{
                width: 120,
                height: 25,
                fontSize: '12px',
                px: 3,
                py: 1,
                bgcolor: 'warning.main',
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </CardBaseiNTER>
  );
};

export default UpcomingInterview;

