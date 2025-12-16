import { Stack, Typography } from '@mui/material';

import { SecondChild } from '@/components/Auth/AdAuth/styled';

const AdAuth = () => {
  return (
    <SecondChild>
      <Stack width='100%' alignItems='end'>
        <Typography color='primary.main' variant='h5'>
          Fast
        </Typography>
        <Typography color='primary.main' variant='h5'>
          Smart
        </Typography>
        <Typography color='primary.main' variant='h5'>
          High Accuracy
        </Typography>
        <Typography color='primary.main' variant='h5'>
          Best Fit Score
        </Typography>
        <Typography color='primary.main' variant='h5'>
          Job Position Suggestion
        </Typography>
      </Stack>

      <Stack width='60%'>
        <Typography color='secondary.main' variant='h2'>
          You can create your best CV using
          <Typography component='span' variant='h2' color='primary.main' mx={1} fontWeight='700'>
            Z-CV
          </Typography>
          .
        </Typography>
      </Stack>
    </SecondChild>
  );
};

export default AdAuth;
