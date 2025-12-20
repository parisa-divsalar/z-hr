'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import InterviewReadyStep from './InterviewReadyStep';
import SkillInputStep from './SkillInputStep';
import { ChatInterViewContent, ChatInterViewGrid, ChatInterViewRoot, CenterGrayBox } from './styled';

export default function ChatInterView() {
    const router = useRouter();
    const [step, setStep] = useState<'intro' | 'skill-input' | 'ready' | 'repeat-skill-input'>('intro');
    const [skillAnswer, setSkillAnswer] = useState('');

    const handleStartClick = () => {
        setStep('skill-input');
    };

    const handleBackToIntro = () => {
        setStep('intro');
    };

    const handleSkillSubmit = (answer: string) => {
        setSkillAnswer(answer);
        setStep('ready');
    };

    const handleBackToSkill = () => {
        setStep('skill-input');
    };

    const handleBackToReady = () => {
        setStep('ready');
    };

    const handleRepeatClick = () => {
        setStep('repeat-skill-input');
    };

    const handleStartInterview = () => {
        router.push('/inter-view');
    };

    return (
        <ChatInterViewRoot>
            <ChatInterViewGrid size={{ xs: 12, sm: 12, md: 12 }}>
                <Stack direction='row' alignItems='center' gap={2} onClick={() => router.push('/inter-view')}>
                    <Typography variant='h5' color='text.primary' fontWeight='500'>
                        Interview{' '}
                    </Typography>
                </Stack>

                <ChatInterViewContent>
                    {step === 'intro' && (
                        <CenterGrayBox isIntro>
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
                                <MuiButton
                                    color='secondary'
                                    size='large'
                                    endIcon={<ArrowRightIcon />}
                                    onClick={handleStartClick}
                                >
                                    Let's Start
                                </MuiButton>
                            </Stack>
                        </CenterGrayBox>
                    )}

                    {step === 'skill-input' && <SkillInputStep onBack={handleBackToIntro} onNext={handleSkillSubmit} />}

                    {step === 'repeat-skill-input' && (
                        <SkillInputStep
                            initialAnswer={skillAnswer}
                            onBack={handleBackToReady}
                            onNext={handleSkillSubmit}
                        />
                    )}

                    {step === 'ready' && (
                        <InterviewReadyStep
                            answer={skillAnswer}
                            onBack={handleBackToSkill}
                            onStart={handleStartInterview}
                            onRepeat={handleRepeatClick}
                        />
                    )}
                </ChatInterViewContent>
            </ChatInterViewGrid>
        </ChatInterViewRoot>
    );
}
