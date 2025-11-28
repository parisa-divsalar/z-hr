import { Stack, Typography } from '@mui/material';

import RepeatIcon from '@/assets/images/dashboard/repeat.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox } from './styled';

interface InterviewReadyStepProps {
  answer: string;
  onBack?: () => void;
  onStart?: () => void;
  onRepeat?: () => void;
}

const InterviewReadyStep = ({ answer, onBack, onStart, onRepeat }: InterviewReadyStepProps) => {
  return (
    <CenterGrayBox isIntro>
      <Typography variant='h5' color='text.primary' fontWeight='600' mt={4}>
        You chat interview score{' '}
      </Typography>

      <Stack
        mt={3}
        sx={{
          width: 61,
          height: 61,
          borderRadius: '50%',
          bgcolor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h4' color='primary.light' fontWeight='500' textAlign='center'>
          34%
        </Typography>
      </Stack>
      <Typography variant='subtitle1' color='text.secondary' fontWeight='500' mt={3} textAlign='center'>
        Number of questions{' '}
      </Typography>

      <Typography variant='h5' color='text.primary' fontWeight='600' mt={1} textAlign='center'>
        10 Questions{' '}
      </Typography>
      <Typography variant='subtitle1' color='text.secondary' fontWeight='500' mt={1} textAlign='center'>
        Time duration{' '}
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='600' mt={1} textAlign='center'>
        09:57{' '}
      </Typography>

      <Stack direction='row' spacing={3} mt={6} mb={3}>
        <MuiButton variant='outlined' color='secondary' endIcon={<ArrowRightIcon />} onClick={onStart}>
          Interview page
        </MuiButton>
        <MuiButton color='secondary' startIcon={<RepeatIcon />} onClick={onRepeat} sx={{ width: 172 }}>
          Repeat{' '}
        </MuiButton>
      </Stack>
    </CenterGrayBox>
  );
};

export default InterviewReadyStep;
