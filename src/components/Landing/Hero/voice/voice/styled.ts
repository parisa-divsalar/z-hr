import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

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
