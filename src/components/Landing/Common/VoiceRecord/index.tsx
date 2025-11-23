/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useCallback, useEffect } from 'react';

import { Typography, IconButton, Stack } from '@mui/material';

import ButtonDIcon from '@/assets/images/icons/button-d.svg';
import ButtonPIcon from '@/assets/images/icons/button-p.svg';
import ButtonPuseIcon from '@/assets/images/icons/button-puse.svg';
import ButtonRIcon from '@/assets/images/icons/button-r.svg';
import VoiceBoxRecording from '@/components/Landing/AI/Recording';
import VoiceBox from '@/components/Landing/AI/VoiceBox';

import { VoiceMessageContainer, WaveformContainer, WaveformBar, ProgressBar, TimeDisplay } from './styled';

export type RecordingState = 'idle' | 'recording';
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
}: VoiceRecordingProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl);
  const [_audioBlob, setAudioBlob] = useState<Blob | null>(initialAudioBlob);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isInternalUrl, setIsInternalUrl] = useState(false); // Track if URL was created internally

  useEffect(() => {
    setAudioUrl(initialAudioUrl);
    setAudioBlob(initialAudioBlob);
    setIsInternalUrl(false);
  }, [initialAudioUrl, initialAudioBlob]);

  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const [waveBarsCount, setWaveBarsCount] = useState(100);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      } catch (_e) {
        // ignore cleanup errors
      }
      audioRef.current = null;
    }

    if (audioUrl && isInternalUrl) {
      try {
        URL.revokeObjectURL(audioUrl);
      } catch (_e) {
        // ignore cleanup errors
      }
      setIsInternalUrl(false);
    }

    setPlaybackState('idle');
    setPlaybackTime(0);
    setAudioProgress(0);
    setAudioDuration(0);
    setWaveBarsCount(100);
  }, [audioUrl, isInternalUrl]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType: mime });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);

        if (audioUrl && isInternalUrl) {
          try {
            URL.revokeObjectURL(audioUrl);
          } catch (_e) {
            // ignore cleanup errors
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
      setRecordingState('recording');
      onRecordingStart?.();

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

  /** PLAYBACK: create audio element lazily and attach events */
  const playRecording = useCallback(async () => {
    if (!audioUrl) return;
    if (playbackState === 'playing') return;

    try {
      if (audioRef.current && audioRef.current.src !== audioUrl) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch (_e) {
          // ignore cleanup errors
        }
        audioRef.current = null;
      }

      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

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
        };

        const fallbackTimer = setTimeout(() => {
          if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
            setAudioDuration(audioRef.current.duration);
            const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
            setWaveBarsCount(bars);
          }
        }, 400);

        audio.ontimeupdate = () => {
          if (!audioRef.current || !isFinite(audioRef.current.duration) || audioRef.current.duration === 0) return;
          const currentTime = audioRef.current.currentTime;
          const p = (currentTime / audioRef.current.duration) * 100;
          setPlaybackTime(currentTime);
          setAudioProgress(p);
        };

        audio.onended = () => {
          setPlaybackState('idle');
          setPlaybackTime(0);
          setAudioProgress(0);
        };

        audio.onerror = (e) => {
          console.error('Audio element error:', e);
          setPlaybackState('idle');
        };

        const clearFallback = () => clearTimeout(fallbackTimer);
        audio.oncanplaythrough = (() => {
          if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
            setAudioDuration(audioRef.current.duration);
            const bars = Math.max(20, Math.floor(audioRef.current.duration * 20));
            setWaveBarsCount(bars);
          }
          clearFallback();
        }) as any;
      }

      await audioRef.current.play();
      setPlaybackState('playing');
    } catch (error) {
      console.error('Failed to play audio:', error);
      setPlaybackState('idle');
    }
  }, [audioUrl, playbackState]);

  /** PAUSE */
  const pauseRecording = useCallback(() => {
    if (audioRef.current && playbackState === 'playing') {
      audioRef.current.pause();
      setPlaybackState('paused');
    }
  }, [playbackState]);

  const _stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaybackState('idle');
    setPlaybackTime(0);
    setAudioProgress(0);
  }, []);

  const togglePlayback = useCallback(() => {
    if (playbackState === 'idle' || playbackState === 'paused') {
      playRecording();
    } else if (playbackState === 'playing') {
      pauseRecording();
    }
  }, [playbackState, playRecording, pauseRecording]);

  const clearRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onerror = null; // جلوگیری از onerror الکی
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ''; // حذف منبع صوتی بدون خطا
      audioRef.current = null;
    }

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

    onClearRecording?.();
  }, [audioUrl, isInternalUrl, onClearRecording]);

  const formatTime = useCallback((seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '00.00';
    const integerPart = Math.floor(seconds).toString().padStart(2, '0');
    const decimalPart = (seconds % 1).toFixed(2).slice(1); // .XX
    return `${integerPart}${decimalPart}`;
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch (_e) {
        // ignore cleanup errors
      }
      audioRef.current = null;
      setPlaybackState('idle');
      setPlaybackTime(0);
      setAudioProgress(0);
      setAudioDuration(0);
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <Stack alignItems='center'>
      {showRecordingControls && (
        <>
          {recordingState !== 'recording' && <VoiceBox onClick={startRecording} />}

          {recordingState === 'recording' && <VoiceBoxRecording onClick={stopRecording} />}

          {recordingState === 'recording' && (
            <Typography variant='body2' color='error' mt={4}>
              {formatTime(recordingTime)}
            </Typography>
          )}
        </>
      )}

      {audioUrl && recordingState === 'idle' && (
        <Stack alignItems='center'>
          <Typography color='text.primary' variant='h5'>
            Recorded time
          </Typography>

          <Typography variant='body2' color='error'>
            {formatTime(audioDuration)}
          </Typography>

          <VoiceMessageContainer bgcolor='primary.light'>
            <WaveformContainer>
              {Array.from({ length: waveBarsCount }, (_, index) => {
                const isPlayed = (index / Math.max(1, waveBarsCount)) * 100 <= audioProgress;
                return (
                  <WaveformBar key={index} isActive={playbackState === 'playing' && isPlayed} isPlayed={isPlayed} />
                );
              })}
              <ProgressBar progress={audioProgress} />
            </WaveformContainer>

            <TimeDisplay>{formatTime(playbackState === 'idle' ? audioDuration : playbackTime)}</TimeDisplay>
          </VoiceMessageContainer>

          <Stack direction='row' gap={3} mt={2}>
            <IconButton onClick={togglePlayback}>
              {playbackState === 'playing' ? <ButtonPuseIcon /> : <ButtonPIcon />}
            </IconButton>

            <IconButton onClick={clearRecording}>
              <ButtonRIcon />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                clearRecording();
              }}
            >
              <ButtonDIcon />
            </IconButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default VoiceRecord;
