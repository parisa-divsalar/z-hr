import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `2px solid ${active ? theme.palette.primary.main : '#F0F0F2'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: active ? theme.palette.primary.main : '#F0F0F2',
  color: active ? '#fff' : theme.palette.text.primary,
  fontWeight: 600,
}));

export const Divider = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  flex: '0 0 50px',
  height: 2,
  background: active ? theme.palette.primary.main : theme.palette.divider,
}));
