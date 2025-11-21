import React from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeEditor from './ResumeEditor';

const Step3 = () => {
  return (
    <Stack alignItems='center' height='100%' p={2}>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
        CV Preview
      </Typography>
      <Typography variant='h6' color='text.primary'>
        You can view and edit resume
      </Typography>

      <ResumeEditor />
    </Stack>
  );
};

export default Step3;
