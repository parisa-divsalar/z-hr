import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '3rem',
  width: '100%',
  maxWidth: 420,
}));

export const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
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
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const Status = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: '#00C853', // bright green
}));
