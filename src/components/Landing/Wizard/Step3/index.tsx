import React, { FunctionComponent } from 'react';

import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import FrameBg from '@/assets/images/bg/FrameBg.svg';

import ResumeEditor from './ResumeEditor';

interface Step3Props {
  setActiveStep: (activeStep: number) => void;
}

const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${FrameBg.src})`,
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'center center',
}));

const Step3: FunctionComponent<Step3Props> = (props) => {
  const { setActiveStep } = props;

  return (
    <MainContainer>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={2}>
        CV Preview
      </Typography>
      <Typography variant='h6' color='text.primary' my={1}>
        You can view and edit resume
      </Typography>

      <ResumeEditor setActiveStep={setActiveStep} />
    </MainContainer>
  );
};

export default Step3;
