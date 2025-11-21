import { useState, useRef, useCallback, useEffect } from 'react';

import { Mic, Stop, Pause } from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';

import ButtonDIcon from '@/assets/images/icons/button-d.svg';
import ButtonPIcon from '@/assets/images/icons/button-p.svg';
import ButtonRIcon from '@/assets/images/icons/button-r.svg';

import {
  WaveBarsContainer,
  WaveBar,
  VoiceMessageContainer,
  PlayPauseButton,
  RefreshButton,
  WaveformContainer,
  WaveformBar,
  ProgressBar,
  TimeDisplay,
} from './styled';

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

const VoiceRecording2 = ({
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
  const [audioBlob, setAudioBlob] = useState<Blob | null>(initialAudioBlob);
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
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl && isInternalUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setIsInternalUrl(false);
    }
    setPlaybackState('idle');
    setPlaybackTime(0);
    setAudioProgress(0);
    setAudioDuration(0);
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

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        setIsInternalUrl(true); // Mark this URL as internally created
        setRecordingTime(0);
        setRecordingState('idle');
        onRecordingComplete?.(url, blob);
        onRecordingStop?.();
      };

      mediaRecorder.start(100);
      setRecordingState('recording');
      onRecordingStart?.();

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Voice recording error:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  }, [maxDuration, onRecordingComplete, onRecordingStart, onRecordingStop]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [recordingState]);

  const playRecording = useCallback(async () => {
    if (audioUrl && playbackState !== 'playing') {
      try {
        // Create new audio element if it doesn't exist or if URL has changed
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);

          audioRef.current.onloadedmetadata = () => {
            if (audioRef.current) {
              setAudioDuration(audioRef.current.duration);
            }
          };

          audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
              const currentTime = audioRef.current.currentTime;
              const progress = (currentTime / audioRef.current.duration) * 100;
              setPlaybackTime(currentTime);
              setAudioProgress(progress);
            }
          };

          audioRef.current.onended = () => {
            setPlaybackState('idle');
            setPlaybackTime(0);
            setAudioProgress(0);
          };

          audioRef.current.onerror = (error) => {
            console.error('Audio playback error:', error);
            setPlaybackState('idle');
            alert('Error playing audio. Please try again.');
          };
        }

        await audioRef.current.play();
        setPlaybackState('playing');
      } catch (error) {
        console.error('Failed to play audio:', error);
        setPlaybackState('idle');
        alert('Error playing audio. Please try again.');
      }
    }
  }, [audioUrl, playbackState]);

  const pauseRecording = useCallback(() => {
    if (audioRef.current && playbackState === 'playing') {
      audioRef.current.pause();
      setPlaybackState('paused');
    }
  }, [playbackState]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState('idle');
      setPlaybackTime(0);
      setAudioProgress(0);
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (playbackState === 'idle' || playbackState === 'paused') {
      playRecording();
    } else if (playbackState === 'playing') {
      pauseRecording();
    }
  }, [playbackState, playRecording, pauseRecording]);

  const clearRecording = useCallback(() => {
    stopPlayback();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setRecordingTime(0);
    setRecordingState('idle');
    setPlaybackState('idle');
    setPlaybackTime(0);
    setAudioProgress(0);
    setAudioDuration(0);
    onClearRecording?.();
  }, [audioUrl, stopPlayback, onClearRecording]);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const formatTime = useCallback((seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) {
      return '';
    }
    const integerPart = Math.floor(seconds).toString().padStart(2, '0');
    const decimalPart = (seconds % 1).toFixed(2).slice(1); // Get .XX part
    return `${integerPart}${decimalPart}`;
  }, []);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaybackState('idle');
      setPlaybackTime(0);
      setAudioProgress(0);
      setAudioDuration(0);
    }
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <Box>
      {showRecordingControls && (
        <>
          <IconButton
            onClick={recordingState === 'recording' ? stopRecording : startRecording}
            color={recordingState === 'recording' ? 'error' : 'primary'}
            size='small'
          >
            {recordingState === 'recording' ? <Stop /> : <Mic />}
          </IconButton>

          {recordingState === 'recording' && (
            <WaveBarsContainer>
              {Array.from({ length: 5 }, (_, index) => (
                <WaveBar key={index} active={recordingState === 'recording'} delay={index * 0.1} />
              ))}
            </WaveBarsContainer>
          )}

          {recordingState === 'recording' && (
            <Typography variant='body2' color='error'>
              {formatTime(recordingTime)}
            </Typography>
          )}
        </>
      )}

      {audioUrl && recordingState === 'idle' && (
        <Box>
          <VoiceMessageContainer>
            <WaveformContainer>
              {Array.from({ length: 20 }, (_, index) => {
                const isPlayed = (index / 20) * 100 <= audioProgress;
                return (
                  <WaveformBar key={index} isActive={playbackState === 'playing' && isPlayed} isPlayed={isPlayed} />
                );
              })}
              <ProgressBar progress={audioProgress} />
            </WaveformContainer>

            <TimeDisplay>{formatTime(playbackState === 'idle' ? audioDuration : playbackTime)}</TimeDisplay>
          </VoiceMessageContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
            <PlayPauseButton playbackState={playbackState} onClick={togglePlayback}>
              {playbackState === 'playing' ? <Pause fontSize='small' /> : <ButtonPIcon />}
            </PlayPauseButton>

            <RefreshButton onClick={handleRefresh}>
              <ButtonRIcon />
            </RefreshButton>

            <RefreshButton
              onClick={(e) => {
                e.stopPropagation();
                clearRecording();
              }}
            >
              <ButtonDIcon />
            </RefreshButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VoiceRecording2;
