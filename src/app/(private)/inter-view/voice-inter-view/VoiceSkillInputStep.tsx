import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';

import RecordIcon from '@/assets/images/icons/answerVoice.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import PauseIcon from '@/assets/images/icons/button-puse.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import PlayIcon from '@/assets/images/icons/voiceBtn.svg';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import VoiceRecord from '@/components/Landing/Wizard/Step1/Common/VoiceRecord';
import MuiButton from '@/components/UI/MuiButton';

import { CenterGrayBox } from './styled';

interface VoiceSkillInputStepProps {
    onBack?: () => void;
    onNext?: (answer: string, voice?: { blob: Blob; duration: number }) => void;
}

const VoiceSkillInputStep = ({ onBack, onNext }: VoiceSkillInputStepProps) => {
    const [answer, setAnswer] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showAnswerRecorder, setShowAnswerRecorder] = useState(false);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [answerVoiceUrl, setAnswerVoiceUrl] = useState<string | null>(null);
    const [answerVoiceBlob, setAnswerVoiceBlob] = useState<Blob | null>(null);
    const [answerVoiceDuration, setAnswerVoiceDuration] = useState<number>(0);
    const [recorderKey, setRecorderKey] = useState(0);
    const answerVoiceUrlRef = useRef<string | null>(null);

    const isRecording = recordingState === 'recording';
    const shouldShowRecordButton = !isRecording && !showAnswerRecorder && !answerVoiceUrl;
    const canProceed = !isRecording && (answer.trim() !== '' || !!answerVoiceUrl);

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

            // cleanup persisted voice url (created in this component)
            if (answerVoiceUrlRef.current) {
                try {
                    URL.revokeObjectURL(answerVoiceUrlRef.current);
                } catch {
                    // ignore
                }
                answerVoiceUrlRef.current = null;
            }
        };
    }, [stopFakeVoice]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = () => {
        const trimmed = answer.trim();
        if (!trimmed && !answerVoiceUrlRef.current) return;
        const voicePayload = answerVoiceBlob ? { blob: answerVoiceBlob, duration: answerVoiceDuration } : undefined;
        onNext?.(trimmed || '', voicePayload);
    };

    const handleShowAnswerRecorder = () => {
        // If user already has a recording, clicking the mic starts a fresh recording
        if (answerVoiceUrlRef.current) {
            try {
                URL.revokeObjectURL(answerVoiceUrlRef.current);
            } catch {
                // ignore
            }
            answerVoiceUrlRef.current = null;
        }

        setAnswerVoiceUrl(null);
        setAnswerVoiceBlob(null);
        setAnswerVoiceDuration(0);
        setRecordingState('idle');
        setShowAnswerRecorder(true);
        setRecorderKey((prev) => prev + 1);
    };

    const handleAnswerRecordingComplete = (_internalUrl: string, blob: Blob, duration: number) => {
        // VoiceRecord creates an internal objectURL which it may revoke on unmount.
        // Persist our own URL from the blob and use that for playback.
        if (answerVoiceUrlRef.current) {
            try {
                URL.revokeObjectURL(answerVoiceUrlRef.current);
            } catch {
                // ignore
            }
        }

        const persistedUrl = URL.createObjectURL(blob);
        answerVoiceUrlRef.current = persistedUrl;

        setAnswerVoiceUrl(persistedUrl);
        setAnswerVoiceBlob(blob);
        setAnswerVoiceDuration(duration);
    };

    const handleClearAnswerRecording = () => {
        if (answerVoiceUrlRef.current) {
            try {
                URL.revokeObjectURL(answerVoiceUrlRef.current);
            } catch {
                // ignore
            }
            answerVoiceUrlRef.current = null;
        }

        setAnswerVoiceUrl(null);
        setAnswerVoiceBlob(null);
        setAnswerVoiceDuration(0);
        setRecordingState('idle');
        setShowAnswerRecorder(false);
        setRecorderKey((prev) => prev + 1);
    };

    return (
        <CenterGrayBox>
            <Typography variant='h5' color='text.primary' fontWeight='584'>
                1
            </Typography>

            <Typography variant='h5' color='text.primary' mt={2} fontWeight='584' mb={4}>
                {questionText}
            </Typography>
            <IconButton
                onClick={toggleFakeVoice}
                size='small'
                aria-label={isPlaying ? 'Pause question voice' : 'Play question voice'}
                sx={{
                    '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.18)' },
                }}
            >
                {isPlaying ? <PauseIcon style={{ width: 56, height: 56 }} /> : <PlayIcon />}
            </IconButton>

            <Stack
                width='100%'
                alignItems='center'
                justifyContent='center'
                mt={2}
                mb={4}
                sx={{
                    minHeight: 96,
                }}
            >
                {shouldShowRecordButton && (
                    <IconButton
                        onClick={handleShowAnswerRecorder}
                        size='small'
                        aria-label='Record your answer'
                        disableRipple
                        disableFocusRipple
                        sx={{
                            p: 0,
                            width: 76,
                            height: 76,
                            minWidth: 0,
                            minHeight: 0,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            backgroundColor: 'transparent',
                            transition: 'background-color 160ms ease, transform 160ms ease',
                            '&:hover': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(129, 140, 248, 0.12)',
                                transform: 'translateY(-1px)',
                            },
                            '&:focus-visible': {
                                backgroundColor: 'rgba(129, 140, 248, 0.16)',
                            },
                        }}
                    >
                        <RecordIcon />
                    </IconButton>
                )}

                {(showAnswerRecorder || answerVoiceUrl) && (
                    <VoiceRecord
                        key={recorderKey}
                        onRecordingComplete={handleAnswerRecordingComplete}
                        onClearRecording={handleClearAnswerRecording}
                        showRecordingControls={showAnswerRecorder}
                        recordingState={recordingState}
                        setRecordingState={setRecordingState}
                        initialAudioUrl={answerVoiceUrl}
                        initialAudioBlob={answerVoiceBlob}
                        initialAudioDuration={answerVoiceDuration}
                        stackDirection='column'
                        fullWidth={false}
                        maxDuration={90}
                    />
                )}
            </Stack>

            <Stack mt={10} mb={5} direction='row' spacing={4}>
                <MuiButton
                    color='secondary'
                    variant='outlined'
                    startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
                    onClick={onBack}
                >
                    Back
                </MuiButton>

                <MuiButton color='secondary' endIcon={<ArrowRightIcon />} onClick={handleSubmit} disabled={!canProceed}>
                    Next
                </MuiButton>
            </Stack>
        </CenterGrayBox>
    );
};

export default VoiceSkillInputStep;
