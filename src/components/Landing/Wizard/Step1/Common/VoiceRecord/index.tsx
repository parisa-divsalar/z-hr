/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback, useEffect } from 'react';

import { Typography, IconButton, Stack } from '@mui/material';
import { alpha, keyframes, styled } from '@mui/material/styles';

import ButtonPIcon from '@/assets/images/icons/button-play.svg';
import ButtonPuseIcon from '@/assets/images/icons/button-puse.svg';
import CleanIcon from '@/assets/images/icons/clean.svg';
import ButtonPuse from '@/assets/images/icons/stop-circle.svg';
import { RecordingState } from '@/components/Landing/Wizard/Step1/AI';
import {
    FilePreviewVoiceContainer,
    FilesStack,
    RemoveFileButton,
} from '@/components/Landing/Wizard/Step1/AI/Attach/View/styled';

import { RecordingControlsStack } from './styled';

const createRecordingPulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${alpha(color, 0.5)};
  }
  70% {
    box-shadow: 0 0 0 18px ${alpha(color, 0)};
  }
  100% {
    box-shadow: 0 0 0 0 ${alpha(color, 0)};
  }
`;

const createRecordingScale = keyframes`
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
`;

const RecordingPulseButton = styled(IconButton)(() => ({
    position: 'relative',
    width: 56,
    height: 56,
    borderRadius: '50%',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    transformOrigin: 'center',
    animation: `${createRecordingScale} 1.6s ease-in-out infinite`,
    '&:hover': {
        backgroundColor: 'transparent',
    },
    cursor: 'default',
}));

const RecordingPulseDot = styled('span')(({ theme }) => {
    const pulseAnimation = createRecordingPulse(theme.palette.error.main);
    return {
        width: 9,
        height: 9,
        borderRadius: '50%',
        backgroundColor: theme.palette.error.main,
        animation: `${pulseAnimation} 2s infinite`,
        display: 'block',
        cursor: 'default',
    };
});

export type PlaybackState = 'idle' | 'playing' | 'paused';

export interface VoiceRecordingProps {
    onRecordingComplete?: (audioUrl: string, blob: Blob) => void;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    maxDuration?: number;
    showRecordingControls?: boolean;
    initialAudioUrl?: string | null;
    initialAudioBlob?: Blob | null;
    onClearRecording?: () => void;
    recordingState: RecordingState;
    setRecordingState: (recordingState: RecordingState) => void;
    stackDirection?: 'row' | 'column';
    /** اگر false باشد، کامپوننت تمام عرض را نمی‌گیرد و برای استفاده در لیست‌های افقی مناسب است */
    fullWidth?: boolean;
}

const VoiceRecord = ({
    onRecordingComplete,
    onRecordingStart,
    onRecordingStop,
    maxDuration = 300, // 5 minutes default
    showRecordingControls = true,
    initialAudioUrl = null,
    initialAudioBlob = null,
    onClearRecording,
    recordingState,
    setRecordingState,
    stackDirection = 'row',
    fullWidth = true,
}: VoiceRecordingProps) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl);
    const [_audioBlob, setAudioBlob] = useState<Blob | null>(initialAudioBlob);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isInternalUrl, setIsInternalUrl] = useState(false); // Track if URL was created internally
    const [showFilesStackPreview, setShowFilesStackPreview] = useState(false);
    const audioUrlRef = useRef<string | null>(audioUrl);
    const isInternalUrlRef = useRef<boolean>(isInternalUrl);

    useEffect(() => {
        setAudioUrl(initialAudioUrl);
        setAudioBlob(initialAudioBlob);
        setIsInternalUrl(false);
    }, [initialAudioUrl, initialAudioBlob]);

    useEffect(() => {
        audioUrlRef.current = audioUrl;
    }, [audioUrl]);

    useEffect(() => {
        isInternalUrlRef.current = isInternalUrl;
    }, [isInternalUrl]);

    const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
    const [_playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [_audioProgress, setAudioProgress] = useState(0);

    const [_waveBarsCount, setWaveBarsCount] = useState(100);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasStartedRecordingRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearPlaybackTimer = useCallback(() => {
        if (playbackTimerRef.current) {
            clearInterval(playbackTimerRef.current);
            playbackTimerRef.current = null;
        }
    }, []);

    const startPlaybackTimer = useCallback(() => {
        clearPlaybackTimer();
        playbackTimerRef.current = setInterval(() => {
            if (audioRef.current) {
                setPlaybackTime(audioRef.current.currentTime);
            }
        }, 200);
    }, [clearPlaybackTimer]);

    const cleanup = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.src = '';
            } catch {
                // ignore cleanup errors
                void 0;
            }
            audioRef.current = null;
        }

        clearPlaybackTimer();

        if (audioUrlRef.current && isInternalUrlRef.current) {
            try {
                URL.revokeObjectURL(audioUrlRef.current);
            } catch {
                // ignore cleanup errors
                void 0;
            }
            setIsInternalUrl(false);
        }

        setPlaybackState('idle');
        setPlaybackTime(0);
        setAudioProgress(0);
        setAudioDuration(0);
        setWaveBarsCount(100);
        setShowFilesStackPreview(false);
    }, [clearPlaybackTimer]);

    const startRecording = useCallback(async () => {
        try {
            // هر بار شروع ضبط، تایمر را از ابتدا شروع می‌کنیم
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setRecordingTime(0);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            streamRef.current = stream;
            chunksRef.current = [];

            // Try to pick a mime type that browser can BOTH record and play,
            // to avoid NotSupportedError: "Failed to load because no supported source was found."
            const audioElement = document.createElement('audio');
            const mimeCandidates = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/webm', 'audio/ogg'];

            let selectedMimeType: string | undefined;
            for (const type of mimeCandidates) {
                try {
                    const canRecord = MediaRecorder.isTypeSupported(type);
                    const canPlay = audioElement.canPlayType(type) !== '';
                    if (canRecord && canPlay) {
                        selectedMimeType = type;
                        break;
                    }
                } catch {
                    // In very old implementations, isTypeSupported might throw – ignore and continue
                    void 0;
                }
            }

            const finalMimeType = selectedMimeType ?? 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType: finalMimeType });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: finalMimeType });
                const url = URL.createObjectURL(blob);

                if (audioUrl && isInternalUrl) {
                    try {
                        URL.revokeObjectURL(audioUrl);
                    } catch {
                        // ignore cleanup errors
                        void 0;
                    }
                }

                setAudioUrl(url);
                setAudioBlob(blob);
                setIsInternalUrl(true); // mark new URL as internal
                setRecordingTime(0);
                setRecordingState('idle');

                onRecordingComplete?.(url, blob);
                onRecordingStop?.();
            };

            mediaRecorder.start(100); // timeslice
            hasStartedRecordingRef.current = true;
            setRecordingState('recording');
            onRecordingStart?.();
            setShowFilesStackPreview(false);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    if (newTime >= maxDuration) {
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                            mediaRecorderRef.current.stop();
                        }
                        return maxDuration;
                    }
                    return newTime;
                });
            }, 1000);
        } catch (error) {
            hasStartedRecordingRef.current = false;
            console.error('Voice recording error:', error);
        }
    }, [maxDuration, onRecordingComplete, onRecordingStart, onRecordingStop, audioUrl, isInternalUrl]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setRecordingState('idle');
    }, []);

    const handleStopRecordingClick = useCallback(() => {
        setShowFilesStackPreview(true);
        stopRecording();
    }, [stopRecording]);

    /** PLAYBACK: create audio element lazily and attach events */
    const playRecording = useCallback(async () => {
        if (!audioUrl) return;
        if (playbackState === 'playing') return;

        try {
            if (audioRef.current && audioRef.current.src !== audioUrl) {
                try {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                } catch {
                    // ignore cleanup errors
                    void 0;
                }
                audioRef.current = null;
            }

            if (!audioRef.current) {
                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                const fallbackTimer = setTimeout(() => {
                    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
                        setAudioDuration(audioRef.current.duration);
                        const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
                        setWaveBarsCount(bars);
                    }
                }, 400);

                const clearFallback = () => clearTimeout(fallbackTimer);

                audio.onloadedmetadata = () => {
                    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
                        setAudioDuration(audioRef.current.duration);
                        const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
                        setWaveBarsCount(bars);
                    }
                };

                audio.oncanplaythrough = () => {
                    if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
                        setAudioDuration(audioRef.current.duration);
                        const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
                        setWaveBarsCount(bars);
                    }
                    clearFallback();
                };

                audio.ontimeupdate = () => {
                    if (!audioRef.current || !isFinite(audioRef.current.duration) || audioRef.current.duration === 0)
                        return;
                    const currentTime = audioRef.current.currentTime;
                    const p = (currentTime / audioRef.current.duration) * 100;
                    setPlaybackTime(currentTime);
                    setAudioProgress(p);
                };

                audio.onended = () => {
                    clearPlaybackTimer();
                    setPlaybackState('idle');
                    setPlaybackTime(0);
                    setAudioProgress(0);
                };

                audio.onerror = () => {
                    // Use warn instead of error to avoid React dev overlay,
                    // and gracefully reset playback state if the audio fails.
                    console.warn('Audio element error:', audioRef.current?.error || 'Unknown audio error');
                    clearPlaybackTimer();
                    setPlaybackState('idle');
                    setPlaybackTime(0);
                    setAudioProgress(0);
                };
            }

            await audioRef.current.play();
            startPlaybackTimer();

            // Ensure duration and waveform info are set even if metadata events were late
            if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
                setAudioDuration(audioRef.current.duration);
                const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
                setWaveBarsCount(bars);
            }

            setPlaybackState('playing');
        } catch (error) {
            console.error('Failed to play audio:', error);
            setPlaybackState('idle');
        }
    }, [audioUrl, playbackState, clearPlaybackTimer, startPlaybackTimer]);

    /** PAUSE */
    const pauseRecording = useCallback(() => {
        if (audioRef.current && playbackState === 'playing') {
            audioRef.current.pause();
            setPlaybackState('paused');
            clearPlaybackTimer();
        }
    }, [clearPlaybackTimer, playbackState]);

    const _stopPlayback = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        clearPlaybackTimer();
        setPlaybackState('idle');
        setPlaybackTime(0);
        setAudioProgress(0);
    }, [clearPlaybackTimer]);

    const togglePlayback = useCallback(() => {
        if (playbackState === 'idle' || playbackState === 'paused') {
            playRecording();
        } else if (playbackState === 'playing') {
            pauseRecording();
        }
    }, [playbackState, playRecording, pauseRecording]);

    const handlePlaybackClick = useCallback(() => {
        setShowFilesStackPreview(true);
        togglePlayback();
    }, [togglePlayback]);

    const clearRecording = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.onerror = null;
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
            audioRef.current = null;
        }

        clearPlaybackTimer();

        if (audioUrl && isInternalUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(null);
        setAudioBlob(null);
        setIsInternalUrl(false);

        setRecordingState('idle');
        setPlaybackState('idle');
        setPlaybackTime(0);
        setAudioProgress(0);
        setAudioDuration(0);
        setRecordingTime(0);
        setShowFilesStackPreview(false);
        onClearRecording?.();
    }, [audioUrl, isInternalUrl, onClearRecording]);

    const formatTime = useCallback((seconds: number) => {
        if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '00:00';
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    }, []);

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.src = '';
            } catch {
                // ignore cleanup errors
                void 0;
            }
            audioRef.current = null;
            setPlaybackState('idle');
            setPlaybackTime(0);
            setAudioProgress(0);
            setAudioDuration(0);
        }
    }, [audioUrl]);

    useEffect(() => {
        if (audioUrl) {
            setShowFilesStackPreview(true);
        }
    }, [audioUrl]);

    useEffect(() => {
        hasStartedRecordingRef.current = false;
        return () => {
            hasStartedRecordingRef.current = false;
            cleanup();
        };
    }, [cleanup]);

    useEffect(() => {
        if (
            !showRecordingControls ||
            recordingState !== 'idle' ||
            !!audioUrl ||
            hasStartedRecordingRef.current
        ) {
            return;
        }

        hasStartedRecordingRef.current = true;
        void startRecording();
    }, [showRecordingControls, recordingState, startRecording, audioUrl]);

    return (
        <Stack
            alignItems='center'
            direction={stackDirection}
            justifyContent='center'
            sx={{ width: fullWidth ? '100%' : 'auto' }}
            gap={stackDirection === 'column' ? 2 : 0}
        >
            {showRecordingControls && recordingState === 'recording' && (
                <RecordingControlsStack direction='row' alignItems='center' mt={stackDirection === 'column' ? 4 : 0}>
                    <ButtonPuse onClick={handleStopRecordingClick} style={{ cursor: 'pointer' }} />
                    <RecordingPulseButton aria-label='Stop recording'>
                        <RecordingPulseDot />
                    </RecordingPulseButton>
                    <Typography variant='body1' color='text.primary' fontWeight='584'>
                        {formatTime(recordingTime)}
                    </Typography>
                </RecordingControlsStack>
            )}

            {showFilesStackPreview && (
                <FilesStack
                    direction='row'
                    gap={1}
                    sx={{
                        my: 0.5,
                    }}
                >
                    <FilePreviewVoiceContainer>
                        {audioUrl ? (
                            <>
                                <IconButton
                                    onClick={handlePlaybackClick}
                                    disabled={!audioUrl}
                                    disableRipple
                                    disableFocusRipple
                                    sx={{
                                        p: 0,
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiTouchRipple-root': {
                                            display: 'none',
                                        },
                                    }}
                                >
                                    {playbackState === 'playing' ? <ButtonPuseIcon /> : <ButtonPIcon />}
                                </IconButton>

                                <Typography variant='body2' color='error' my={2}>
                                    {formatTime(playbackState === 'idle' ? audioDuration : _playbackTime)}
                                </Typography>

                                <RemoveFileButton
                                    onClick={clearRecording}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        padding: 0,
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <CleanIcon width={24} height={24} />
                                </RemoveFileButton>
                            </>
                        ) : (
                            <Typography variant='body2' color='text.secondary'>
                                Preparing your recording…
                            </Typography>
                        )}
                    </FilePreviewVoiceContainer>
                </FilesStack>
            )}
        </Stack>
    );
};

export default VoiceRecord;
