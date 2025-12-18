import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import PauseIcon from '@/assets/images/icons/button-puse.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import PlayIcon from '@/assets/images/icons/voiceBtn.svg';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox, VoiceInputContainer, VoiceInputContent } from './styled';

interface VoiceSkillInputStepProps {
    onBack?: () => void;
    onNext?: (answer: string) => void;
}

const VoiceSkillInputStep = ({ onBack, onNext }: VoiceSkillInputStepProps) => {
    const [answer, setAnswer] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    const questionText = 'Tell me about yourself and your experience?';
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscRef = useRef<OscillatorNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const beepTimerRef = useRef<number | null>(null);

    const stopBeep = useCallback(() => {
        if (beepTimerRef.current) {
            window.clearTimeout(beepTimerRef.current);
            beepTimerRef.current = null;
        }

        try {
            oscRef.current?.stop();
        } catch {
            // ignore
        }
        try {
            oscRef.current?.disconnect();
        } catch {
            // ignore
        }
        try {
            gainRef.current?.disconnect();
        } catch {
            // ignore
        }

        oscRef.current = null;
        gainRef.current = null;
    }, []);

    const playBeepFallback = useCallback(async () => {
        if (typeof window === 'undefined') return;

        stopBeep();

        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) {
            setIsPlaying(false);
            return;
        }

        try {
            if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
            if (audioCtxRef.current.state === 'suspended') {
                await audioCtxRef.current.resume();
            }

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.value = 220;

            // small envelope to avoid click
            const now = audioCtxRef.current.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);
            osc.start();

            oscRef.current = osc;
            gainRef.current = gain;
            setIsPlaying(true);

            beepTimerRef.current = window.setTimeout(() => {
                stopBeep();
                setIsPlaying(false);
            }, 1200);
        } catch {
            stopBeep();
            setIsPlaying(false);
        }
    }, [stopBeep]);

    const stopFakeVoice = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            window.speechSynthesis?.cancel();
        } catch {
            // ignore
        }
        stopBeep();
        utteranceRef.current = null;
        setIsPlaying(false);
    }, [stopBeep]);

    const playFakeVoice = useCallback(() => {
        if (typeof window === 'undefined') return;

        // Ensure any prior speech is stopped first
        try {
            window.speechSynthesis?.cancel();
        } catch {
            // ignore
        }

        if (!('speechSynthesis' in window) || typeof (window as any).SpeechSynthesisUtterance === 'undefined') {
            void playBeepFallback();
            return;
        }

        const u = new SpeechSynthesisUtterance(questionText);
        u.lang = 'en-US';
        u.rate = 1;
        u.pitch = 1;

        u.onend = () => {
            utteranceRef.current = null;
            setIsPlaying(false);
        };

        u.onerror = () => {
            utteranceRef.current = null;
            setIsPlaying(false);
        };

        utteranceRef.current = u;
        setIsPlaying(true);

        try {
            window.speechSynthesis.speak(u);
        } catch {
            utteranceRef.current = null;
            void playBeepFallback();
        }
    }, [playBeepFallback, questionText]);

    const toggleFakeVoice = useCallback(() => {
        if (isPlaying) stopFakeVoice();
        else playFakeVoice();
    }, [isPlaying, playFakeVoice, stopFakeVoice]);

    useEffect(() => {
        return () => {
            stopFakeVoice();
            if (audioCtxRef.current) {
                try {
                    void audioCtxRef.current.close();
                } catch {
                    // ignore
                }
                audioCtxRef.current = null;
            }
        };
    }, [stopFakeVoice]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (!answer) return;
        onNext?.(answer);
    };

    return (
        <CenterGrayBox>
            <Typography variant='h5' color='text.primary' fontWeight='584'>
                1
            </Typography>

            <Typography variant='h5' color='text.primary' fontWeight='584' mb={4}>
                {questionText}
            </Typography>

            <IconButton
                onClick={toggleFakeVoice}
                size='small'
                aria-label={isPlaying ? 'Pause voice' : 'Play voice'}
                sx={{
                    ml: 1,
                    '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.18)' },
                }}
            >
                 {isPlaying ? <PauseIcon style={{ width: 56, height: 56 }} /> : <PlayIcon />}
            </IconButton>
            <VoiceInputContainer direction='row' active={answer !== ''}>
                <VoiceInputContent placeholder='Type your answer...' value={answer} onChange={handleChange} />
            </VoiceInputContainer>

            <Stack mt={10} mb={5} direction='row' spacing={4}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
                    onClick={onBack}
                >
                    Back
                </MuiButton>

                <MuiButton
                    color='secondary'
                    endIcon={<ArrowRightIcon />}
                    onClick={handleSubmit}
                    disabled={answer === ''}
                >
                    Next
                </MuiButton>
            </Stack>
        </CenterGrayBox>
    );
};

export default VoiceSkillInputStep;
