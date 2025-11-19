'use client';
import { Typography } from '@mui/material';

import AIInputBox from '@/components/Landing/AI/InputBox';
import { MainContainer } from '@/components/Landing/AI/styled';

const AISection = () => {
  return (
    <MainContainer>
      <Typography variant='h6' color='text.primary'>
        Create your resume with
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
        Voice, Video, Photo and Text
      </Typography>

      <AIInputBox />
    </MainContainer>
  );
};

export default AISection;
