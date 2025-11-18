'use client';
import { Typography, Stack } from '@mui/material';

import { VoiceIcon } from '@/components/Icons';
import PromptBox from '@/components/Landing/Hero/Prompt';
import { MainContainer, VoiceButton, HorizontalDivider } from '@/components/Landing/Hero/styled';

const HeroSection = () => {
  return (
    <MainContainer mt={10}>
      <Typography variant='h6' color='text.primary'>
        Create your resume with
      </Typography>
      <Typography variant='h5' color='text.primary' fontWeight='700'>
        Voice, Video, Photo and Text
      </Typography>

      <Stack gap={2} alignItems='center' mt={10}>
        <VoiceButton>
          <VoiceIcon />
        </VoiceButton>

        <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
          Voice
        </Typography>
      </Stack>
      <Stack direction='row' gap={2} alignItems='center' mt={10}>
        <HorizontalDivider orientation='horizontal' />
        <Typography variant='subtitle1' color='text.secondry' fontWeight='400'>
          or
        </Typography>
        <HorizontalDivider orientation='horizontal' />
      </Stack>
      <PromptBox />
    </MainContainer>
  );
};

export default HeroSection;
