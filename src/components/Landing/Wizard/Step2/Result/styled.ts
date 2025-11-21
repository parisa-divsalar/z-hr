import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'flex-start',
  marginTop: '3rem',
}));

export const Tile = styled(Box)(({ theme }) => ({
  width: 76,
  height: 76,
  borderRadius: 16,
  border: `2px solid ${theme.palette.primary.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(94, 63, 255, 0.06)',
  boxSizing: 'border-box',
  position: 'relative',
  cursor: 'pointer',
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const Label = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 500,
}));

export const CheckBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: theme.palette.primary.main,
  border: `3px solid #5E3FFF`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
}));
