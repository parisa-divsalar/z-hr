import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlaybackState } from './index';

export const WaveBarsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  height: '24px',
});

export const WaveBar = styled(Box)<{ active: boolean; delay: number }>(({ active, delay }) => ({
  width: '3px',
  height: '4px',
  backgroundColor: active ? '#ef4444' : '#d1d5db',
  borderRadius: '2px',
  transition: 'all 0.3s ease-in-out',
  animation: active ? `waveAnimation 0.8s ease-in-out infinite ${delay * 0.1}s` : 'none',
  '@keyframes waveAnimation': {
    '0%': {
      height: '4px',
      opacity: 0.4,
    },
    '25%': {
      height: '12px',
      opacity: 0.7,
    },
    '50%': {
      height: '20px',
      opacity: 1,
    },
    '75%': {
      height: '8px',
      opacity: 0.8,
    },
    '100%': {
      height: '4px',
      opacity: 0.4,
    },
  },
}));

export const VoiceMessageContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: '#f0f0f0',
  borderRadius: '20px',
  width: '588px',
});

export const PlayPauseButton = styled(Box)<{ playbackState?: PlaybackState }>(({ playbackState }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '14px',
  transition: 'all 0.2s ease',
}));

export const RefreshButton = styled(Box)({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '14px',
  transition: 'all 0.2s ease',
});

export const WaveformContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  height: '32px',
  position: 'relative',
});

export const WaveformBar = styled(Box)<{ isActive: boolean; isPlayed: boolean }>(({ isActive, isPlayed }) => ({
  width: '3px',
  height: isActive ? '20px' : '8px',
  backgroundColor: isPlayed ? '#007AFF' : '#999',
  borderRadius: '2px',
  transition: 'all 0.3s ease',
  animation: isActive ? `waveAnimation 0.8s ease-in-out infinite` : 'none',
  '@keyframes waveAnimation': {
    '0%': {
      height: '8px',
      opacity: 0.6,
    },
    '25%': {
      height: '16px',
      opacity: 0.8,
    },
    '50%': {
      height: '24px',
      opacity: 1,
    },
    '75%': {
      height: '12px',
      opacity: 0.9,
    },
    '100%': {
      height: '8px',
      opacity: 0.6,
    },
  },
}));

export const ProgressBar = styled(Box)<{ progress: number }>(({ progress }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '2px',
  backgroundColor: '#007AFF',
  borderRadius: '1px',
  width: `${progress}%`,
  transition: 'width 0.1s ease',
}));

export const TimeDisplay = styled(Box)({
  fontSize: '12px',
  color: '#666',
  minWidth: '35px',
  textAlign: 'right',
});
