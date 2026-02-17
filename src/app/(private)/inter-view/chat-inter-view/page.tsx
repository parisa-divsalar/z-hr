'use client';
import { useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';
import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';
import { useUserProfile } from '@/hooks/useUserProfile';
import { fetchInterviewQuestions } from '@/services/interview/get-questions';

import InterviewReadyStep from './InterviewReadyStep';
import SkillInputStep from './SkillInputStep';
import { ChatInterViewContent, ChatInterViewGrid, ChatInterViewRoot, CenterGrayBox } from './styled';

import type { InterviewQuestionItem } from './QuestionsList';

export default function ChatInterView() {
    const router = useRouter();
    const { profile } = useUserProfile();
    const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
    const [lockedOpen, setLockedOpen] = useState(false);
    const [step, setStep] = useState<'intro' | 'skill-input' | 'ready' | 'repeat-skill-input'>('intro');
    const [skillAnswer, setSkillAnswer] = useState('');
    const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastRequestKeyRef = useRef<string | null>(null);

    const enabled = new Set((access?.enabledKeys ?? []).filter(Boolean));
    const isLocked = !isAccessLoading && !enabled.has('question_interview');

    useEffect(() => {
        if (isLocked) setLockedOpen(true);
    }, [isLocked]);

    if (isLocked) {
        return (
            <>
                <PlanRequiredDialog
                    open={lockedOpen}
                    onClose={() => setLockedOpen(false)}
                    title='Feature locked'
                    headline='Interview Questions is disabled for your account.'
                    bodyText='Enable it in More Features (Step 3) to unlock it.'
                    primaryLabel='Enable in More Features'
                    primaryHref='/resume-builder?step=3'
                />
            </>
        );
    }

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

    useEffect(() => {
        if (step !== 'ready') return;

        const requestKey = `chat:${profile?.id ?? 'anon'}`;
        if (lastRequestKeyRef.current === requestKey) return;

        let isActive = true;
        setIsLoading(true);
        setError(null);

        const run = async () => {
            try {
                const data = await fetchInterviewQuestions({
                    isFinalStep: true,
                    mode: 'chat',
                    userId: profile?.id ?? null,
                });

                if (!isActive) return;

                const mapped: InterviewQuestionItem[] = (data.questions ?? []).map((question, index) => ({
                    number: index + 1,
                    question: question.question,
                    answer: question.suggestedAnswer,
                    name: question.category ? `${question.category} interview` : undefined,
                    meta: question.category ? [{ title: 'Category', label: question.category }] : undefined,
                }));

                setQuestions(mapped);
                lastRequestKeyRef.current = requestKey;
            } catch (err: any) {
                if (!isActive) return;
                setError(err?.response?.data?.error || 'Failed to load interview questions');
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        void run();

        return () => {
            isActive = false;
        };
    }, [profile?.id, step]);

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
                            items={questions}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                </ChatInterViewContent>
            </ChatInterViewGrid>
        </ChatInterViewRoot>
    );
}
