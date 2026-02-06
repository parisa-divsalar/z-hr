 
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
    onRecordingComplete?: (audioUrl: string, blob: Blob, duration: number) => void;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    maxDuration?: number;
    showRecordingControls?: boolean;
    initialAudioUrl?: string | null;
    initialAudioBlob?: Blob | null;
    initialAudioDuration?: number;
    onClearRecording?: () => void;
    recordingState: RecordingState;
    setRecordingState: (recordingState: RecordingState) => void;
    stackDirection?: 'row' | 'column';
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
    initialAudioDuration = 0,
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
    const recordingTimeRef = useRef(0);

    useEffect(() => {
        setAudioUrl(initialAudioUrl);
        setAudioBlob(initialAudioBlob);
        setAudioDuration(initialAudioDuration);
        setIsInternalUrl(false);
    }, [initialAudioUrl, initialAudioBlob, initialAudioDuration]);

    useEffect(() => {
        audioUrlRef.current = audioUrl;
    }, [audioUrl]);

    useEffect(() => {
        isInternalUrlRef.current = isInternalUrl;
    }, [isInternalUrl]);

    const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
    const [_playbackTime, setPlaybackTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(initialAudioDuration);
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
        recordingTimeRef.current = 0;
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
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            recordingTimeRef.current = 0;
            setRecordingTime(0);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 48000,
                },
            });

            streamRef.current = stream;
            chunksRef.current = [];

            const audioElement = document.createElement('audio');
            const mimeCandidates = [
                'audio/webm;codecs=opus',
                'audio/webm; codecs=opus',
                'audio/webm; codecs="opus"',
                'audio/ogg;codecs=opus',
                'audio/ogg; codecs=opus',
                'audio/ogg; codecs="opus"',
                // Safari family typically prefers mp4/aac
                'audio/mp4',
                'audio/x-m4a',
                // Fallbacks (rarely recordable via MediaRecorder, but keep as last resort)
                'audio/webm',
                'audio/ogg',
            ];

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
                    void 0;
                }
            }

            if (!selectedMimeType) {
                throw new Error('No supported audio codec available for recording');
            }

            const finalMimeType = selectedMimeType;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: finalMimeType,
                audioBitsPerSecond: 128000,
            });

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
                setAudioDuration(recordingTimeRef.current);
                const recordedDuration = recordingTimeRef.current;
                setRecordingTime(0);
                setRecordingState('idle');

                onRecordingComplete?.(url, blob, recordedDuration);
                onRecordingStop?.();
            };

            mediaRecorder.start();
            hasStartedRecordingRef.current = true;
            recordingTimeRef.current = 0;
            setRecordingState('recording');
            onRecordingStart?.();
            setShowFilesStackPreview(false);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    recordingTimeRef.current = newTime;
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
            setShowFilesStackPreview(false);
            setRecordingState('idle');
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
                    console.warn('Audio element error:', audioRef.current?.error || 'Unknown audio error');
                    clearPlaybackTimer();
                    setPlaybackState('idle');
                    setPlaybackTime(0);
                    setAudioProgress(0);
                };
            }

            await audioRef.current.play();
            startPlaybackTimer();

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
        if (!audioUrl) {
            if (audioRef.current) {
                try {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                } catch {
                    void 0;
                }
                audioRef.current = null;
            }
            setPlaybackState('idle');
            setPlaybackTime(0);
            setAudioProgress(0);
            setAudioDuration(0);
            setWaveBarsCount(100);
            return;
        }

        let metadataAudio: HTMLAudioElement | null = new Audio(audioUrl);
        metadataAudio.preload = 'metadata';

        const updateDurationFromMetadata = () => {
            if (!metadataAudio || !isFinite(metadataAudio.duration) || metadataAudio.duration <= 0) {
                return;
            }

            setAudioDuration(metadataAudio.duration);
            const bars = Math.max(20, Math.floor(metadataAudio.duration * 20));
            setWaveBarsCount(bars);
        };

        const cleanupMetadataAudio = () => {
            if (metadataAudio) {
                metadataAudio.removeEventListener('loadedmetadata', updateDurationFromMetadata);
                metadataAudio.removeEventListener('error', cleanupMetadataAudio);
                metadataAudio.src = '';
                metadataAudio = null;
            }
        };

        metadataAudio.addEventListener('loadedmetadata', updateDurationFromMetadata);
        metadataAudio.addEventListener('error', cleanupMetadataAudio);

        if (audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.src = '';
            } catch {
                void 0;
            }
            audioRef.current = null;
            setPlaybackState('idle');
            setPlaybackTime(0);
            setAudioProgress(0);
        }

        return () => {
            cleanupMetadataAudio();
        };
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
        if (!showRecordingControls || recordingState !== 'idle' || !!audioUrl || hasStartedRecordingRef.current) {
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
