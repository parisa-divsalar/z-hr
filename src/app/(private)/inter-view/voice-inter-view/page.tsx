'use client';
import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox, VoiceInterViewContent, VoiceInterViewGrid, VoiceInterViewRoot } from './styled';
import VoiceInterviewReadyStep from './VoiceInterviewReadyStep';
import VoiceRepeatSkillInputStep from './VoiceRepeatSkillInputStep';
import VoiceSkillInputStep from './VoiceSkillInputStep';

export default function VoiceInterView() {
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
        <VoiceInterViewRoot>
            <VoiceInterViewGrid size={{ xs: 12, sm: 12, md: 12 }}>
                <Stack direction='row' alignItems='center' gap={2} onClick={() => router.push('/inter-view')}>
                    <Typography variant='h5' color='text.primary' fontWeight='500'>
                        Interview{' '}
                    </Typography>
                </Stack>

                <VoiceInterViewContent>
                    {step === 'intro' && (
                        <CenterGrayBox isIntro>
                            <Typography variant='h5' color='text.primary' fontWeight='600' mt={4}>
                                Voice Interview
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

                    {step === 'skill-input' && (
                        <VoiceSkillInputStep onBack={handleBackToIntro} onNext={handleSkillSubmit} />
                    )}

                    {step === 'repeat-skill-input' && (
                        <VoiceRepeatSkillInputStep
                            initialAnswer={skillAnswer}
                            onBack={handleBackToReady}
                            onNext={handleSkillSubmit}
                        />
                    )}

                    {step === 'ready' && (
                        <VoiceInterviewReadyStep
                            answer={skillAnswer}
                            onBack={handleBackToSkill}
                            onStart={handleStartInterview}
                            onRepeat={handleRepeatClick}
                        />
                    )}
                </VoiceInterViewContent>
            </VoiceInterViewGrid>
        </VoiceInterViewRoot>
    );
}
