import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '5rem',
  width: '100%',
  maxWidth: 300,
}));

export const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 2),
  boxSizing: 'border-box',
}));

export const Tile = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const Label = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const Status = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: '#00C853', // bright green
}));
