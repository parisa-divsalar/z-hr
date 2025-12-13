import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  gap: theme.spacing(4),
}));

export const StepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: '0.2s ease',
}));

export const StepCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'current',
})<{ active?: boolean; current: boolean }>(({ theme, active, current }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `2px solid ${active || current ? theme.palette.primary.main : theme.palette.grey[50]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? theme.palette.primary.main : current ? theme.palette.primary.light : theme.palette.primary.light,
  color: active ? theme.palette.primary.contrastText : current ? theme.palette.primary.main : theme.palette.grey[500],
  fontWeight: 500,
  // Firefox-only: prevent flexbox shrinking/odd font-metrics shifting the digit inside the circle.
  '@supports (-moz-appearance: none)': {
    minWidth: 40,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    lineHeight: 1,
  },
}));

export const Divider = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: '0 0 50px',
  height: 2,
  background: active ? theme.palette.primary.main : theme.palette.divider,
}));
