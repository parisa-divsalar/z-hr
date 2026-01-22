import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  flexWrap: 'wrap',
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(2),
  },
}));

export const StepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  transition: '0.2s ease',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
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
  '@supports (-moz-appearance: none)': {
    minWidth: 40,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    lineHeight: 1,
  },
  [theme.breakpoints.down('sm')]: {
    width: 34,
    height: 34,
    fontSize: '0.85rem',
  },
}));

export const Divider = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: '0 0 50px',
  height: 2,
  background: active ? theme.palette.primary.main : theme.palette.divider,
  [theme.breakpoints.down('sm')]: {
    flex: '0 0 30px',
  },
}));
