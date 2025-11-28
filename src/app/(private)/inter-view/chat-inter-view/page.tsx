'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import BackIcon from '@/assets/images/dashboard/imag/backIcon.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import SkillInputStep from './SkillInputStep';
import { ChatInterViewContent, ChatInterViewGrid, ChatInterViewRoot, CenterGrayBox } from './styled';

const ChatInterView = () => {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'skill-input'>('intro');

  const handleStartClick = () => {
    setStep('skill-input');
  };

  const handleBackToIntro = () => {
    setStep('intro');
  };

  const handleSkillSubmit = (answer: string) => {
    // TODO: connect to interview questions flow
    // eslint-disable-next-line no-console
    console.log('Selected skill for chat interview:', answer);
  };

  return (
    <ChatInterViewRoot>
      <ChatInterViewGrid size={{ xs: 12, sm: 12, md: 12 }}>
        <Stack direction='row' alignItems='center' gap={2}>
          <BackIcon onClick={() => router.push('/inter-view')} style={{ cursor: 'pointer' }} />
          <Typography variant='h5' color='text.primary' fontWeight='500'>
            Chat Interview
          </Typography>
        </Stack>

        <ChatInterViewContent>
          {step === 'intro' ? (
            <CenterGrayBox>
              <Typography variant='h5' color='text.primary' fontWeight='600' mt={4}>
                Chat Interview
              </Typography>

              <Stack direction='row' spacing={3} mt={4}>
                <Typography variant='body1' color='text.secondary' fontWeight='500'>
                  Number of questions
                </Typography>
                <Typography variant='subtitle1' color='text.secondary' fontWeight='500'>
                  Time duration
                </Typography>
              </Stack>

              <Stack direction='row' spacing={7} mt={1}>
                <Typography variant='h5' color='text.primary' fontWeight='600'>
                  10 Questions
                </Typography>
                <Typography variant='h5' color='text.primary' fontWeight='600'>
                  10 Minutes
                </Typography>
              </Stack>
              <Typography variant='subtitle1' color='text.primary' fontWeight='500' mt={5}>
                Are you ready?
              </Typography>
              <Stack my={5}>
                <MuiButton color='secondary' size='large' endIcon={<ArrowRightIcon />} onClick={handleStartClick}>
                  Let's Start
                </MuiButton>
              </Stack>
            </CenterGrayBox>
          ) : (
            <SkillInputStep onBack={handleBackToIntro} onNext={handleSkillSubmit} />
          )}
        </ChatInterViewContent>
      </ChatInterViewGrid>
    </ChatInterViewRoot>
  );
};

export default ChatInterView;
