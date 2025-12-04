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
  overflow: 'hidden',
  height: '32px',
  position: 'relative',
});

export const WaveformBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isPlayed',
})<{ isActive: boolean; isPlayed: boolean }>(({ isActive, isPlayed }) => ({
  width: '3px',
  height: isActive ? '55px' : '35px',
  backgroundColor: isPlayed ? '#007AFF' : '#b9b9b9',
  borderRadius: '2px',
  transition: 'all 0.3s ease',
  animation: isActive ? `waveAnimation 0.8s ease-in-out infinite` : 'none',
  '@keyframes waveAnimation': {
    '0%': {
      height: '11px',
      opacity: 0.6,
    },
    '25%': {
      height: '16px',
      opacity: 0.8,
    },
    '50%': {
      height: '34px',
      opacity: 1,
    },
    '75%': {
      height: '18px',
      opacity: 0.9,
    },
    '100%': {
      height: '5px',
      opacity: 0.6,
    },
  },
}));

export const ProgressBar = styled(Box)<{ progress: number }>(({ progress }) => ({
  position: 'absolute',
  bottom: '-6px',
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
