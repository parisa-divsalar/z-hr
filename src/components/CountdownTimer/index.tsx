import { FunctionComponent, useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import TimmerIcon from '@/assets/images/icons/timer.svg';
import { TimeState } from '@/type/common';
import { convertSecondsToTime, pad } from '@/utils/common';

type CountdownTimerProps = {
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  setIsPassed: (isPassed: boolean) => void;
};

const StackContainer = styled(Stack)(({ theme }) => ({
  borderRadius: '1rem',
  padding: '0.25rem 0.5rem 0.25rem 0.25rem',
  width: '5.5rem',
  backgroundColor: theme.palette.error.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const CircleContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CountdownTimer: FunctionComponent<CountdownTimerProps> = (props) => {
  const { remainingDays, remainingHours, remainingMinutes, setIsPassed } = props;

  const [timeLeft, setTimeLeft] = useState<TimeState>(() => {
    const totalSeconds = remainingDays * 86400 + remainingHours * 3600 + remainingMinutes * 60;

    return convertSecondsToTime(totalSeconds);
  });

  useEffect(() => {
    let totalSeconds = remainingDays * 86400 + remainingHours * 3600 + remainingMinutes * 60;

    const interval = setInterval(() => {
      totalSeconds -= 1;

      if (totalSeconds < 0) {
        clearInterval(interval);
        setIsPassed(true);
        return;
      }

      setTimeLeft(convertSecondsToTime(totalSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <StackContainer direction='row'>
      <CircleContainer>
        <TimmerIcon />
      </CircleContainer>

      <Stack direction='row'>
        <Typography variant='subtitle2' fontWeight='600' color='error.main'>
          {pad(timeLeft.seconds) || '-'}
        </Typography>
        <Typography variant='subtitle2' fontWeight='600' color='error.main'>
          :
        </Typography>

        <Typography variant='subtitle2' fontWeight='600' color='error.main'>
          {pad(timeLeft.minutes) || '-'}
        </Typography>
        <Typography variant='subtitle2' fontWeight='600' color='error.main'>
          :
        </Typography>
        <Typography variant='subtitle2' fontWeight='600' color='error.main'>
          {pad(timeLeft.hours) || '-'}
        </Typography>
      </Stack>
    </StackContainer>
  );
};

export default CountdownTimer;
