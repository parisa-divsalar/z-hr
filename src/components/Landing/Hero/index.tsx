'use client';
import { Typography } from '@mui/material';

import PromptBox from '@/components/Landing/Hero/Prompt';
import { MainContainer } from '@/components/Landing/Hero/styled';

const HeroSection = () => {
  return (
    <MainContainer>
      <Typography variant='h6' color='text.primary'>
        Create your resume with
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='700'>
        Voice, Video, Photo and Text
      </Typography>

      <PromptBox />
    </MainContainer>
  );
};

export default HeroSection;
