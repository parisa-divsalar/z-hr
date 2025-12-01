import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ResultContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '5rem',
  width: '100%',
  maxWidth: 300,
}));

export const ResultRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 2),
  boxSizing: 'border-box',
}));

export const ResultTile = styled(Box)(() => ({
  width: 48,
  height: 48,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ResultIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ResultLabel = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ResultStatus = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 600,
  color: '#00C853',
}));

