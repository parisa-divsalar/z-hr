import React, { FunctionComponent } from 'react';

import { Stack, Typography } from '@mui/material';

import ResumeEditor from './ResumeEditor';

interface Step3Props {
  setActiveStep: (activeStep: number) => void;
}

const Step3: FunctionComponent<Step3Props> = (props) => {
  const { setActiveStep } = props;

  return (
    <Stack alignItems='center' height='100%' p={2}>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={2}>
        CV Preview
      </Typography>
      <Typography variant='h6' color='text.primary' my={1}>
        You can view and edit resume
      </Typography>

      <ResumeEditor setActiveStep={setActiveStep} />
    </Stack>
  );
};

export default Step3;
