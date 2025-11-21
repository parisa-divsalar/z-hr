import { styled } from '@mui/material/styles';

export const Container = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  padding: '40px',
}));

export const TopBox = styled('div')(() => ({
  width: '76px',
  height: '76px',
  borderRadius: '1rem',
  border: '2px solid #d1d1d1',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const Fill = styled('div')(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  background: 'rgba(80, 100, 255, 0.15)',
  borderTop: '2px solid #4a5bff',
  transition: 'height 0.2s linear',
}));

export const Icon = styled('div')(() => ({
  position: 'relative',
  zIndex: 10,
  color: '#666',
  fontSize: '32px',
}));

export const PercentText = styled('div')(() => ({
  fontSize: '14px',
  fontWeight: 600,
}));

export const BarContainer = styled('div')(() => ({
  width: '15rem',
  maxWidth: '600px',
  height: '18px',
  background: 'rgba(80, 100, 255, 0.1)',
  borderRadius: '50px',
  overflow: 'hidden',
}));

export const BarFill = styled('div')(() => ({
  height: '100%',
  background: '#4a5bff',
  transition: 'width 0.2s',
}));
