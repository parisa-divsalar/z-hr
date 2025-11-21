import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const VoiceMessageContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '1rem 12px',
  borderRadius: '0.5rem',
  width: '588px',
  marginTop: '1.5rem',
});

export const WaveformContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  height: '32px',
  position: 'relative',
});

export const WaveformBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isPlayed',
})<{ isActive: boolean; isPlayed: boolean }>(({ isActive, isPlayed }) => ({
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
