import { FunctionComponent, useEffect } from 'react';

import { Stack, Typography } from '@mui/material';

import ThinkingIcon from '@/assets/images/icons/thinking.svg';
import MuiButton from '@/components/UI/MuiButton';

interface ThinkingProps {
  onCancel: () => void;
  setActiveStep: (activeStep: number) => void;
}

const Thinking: FunctionComponent<ThinkingProps> = (props) => {
  const { onCancel, setActiveStep } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveStep(3);
    }, 3_000);

    return () => clearTimeout(timer);
  }, [setActiveStep]);

  return (
    <Stack alignItems='center' justifyContent='center' height='100%'>
      <ThinkingIcon />

      <Typography color='text.primary' variant='h6' mt={4}>
        Thinking...
      </Typography>
      <Typography color='text.primary' variant='h5' fontWeight='600'>
        A thought-provoking statement about contemplation.
      </Typography>

      <Stack mt={10} width='10rem'>
        <MuiButton variant='outlined' fullWidth onClick={onCancel}>
          Cancel
        </MuiButton>
      </Stack>
    </Stack>
  );
};
export default Thinking;
