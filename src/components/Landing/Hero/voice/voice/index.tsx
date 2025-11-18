import { useState, useRef, useCallback, useEffect } from 'react';

import { Mic, Stop, PlayArrow, Delete } from '@mui/icons-material';
import { Box, Typography, IconButton } from '@mui/material';

import { WaveBarsContainer, WaveBar } from './styled';

export type RecordingState = 'idle' | 'recording';

export interface VoiceRecordingProps {
  onRecordingComplete?: (audioUrl: string, blob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  maxDuration?: number;
  className?: string;
}

const VoiceRecording = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  maxDuration = 300, // 5 minutes default
  className,
}: VoiceRecordingProps) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

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
      alert('خطا در دسترسی به میکروفون. لطفا دسترسی را بررسی کنید.');
    }
  }, [maxDuration, onRecordingComplete, onRecordingStart, onRecordingStop]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [recordingState]);

  const playRecording = useCallback(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }, [audioUrl]);

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setRecordingState('idle');
  }, [audioUrl]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={recordingState === 'recording' ? stopRecording : startRecording}
        color={recordingState === 'recording' ? 'error' : 'primary'}
        size='small'
      >
        {recordingState === 'recording' ? <Stop /> : <Mic />}
      </IconButton>

      {/* Recording Animation - ChatGPT Style */}
      {recordingState === 'recording' && (
        <WaveBarsContainer>
          {Array.from({ length: 5 }, (_, index) => (
            <WaveBar key={index} active={recordingState === 'recording'} delay={index * 0.1} />
          ))}
        </WaveBarsContainer>
      )}

      {/* Recording Time Display */}
      {recordingState === 'recording' && (
        <Typography variant='body2' color='error'>
          {formatTime(recordingTime)}
        </Typography>
      )}

      {audioUrl && recordingState === 'idle' && (
        <>
          <IconButton onClick={playRecording} color='primary' size='small'>
            <PlayArrow />
          </IconButton>
          <IconButton onClick={clearRecording} color='error' size='small'>
            <Delete />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default VoiceRecording;
