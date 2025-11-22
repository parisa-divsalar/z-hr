import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

export const VoiceButton = styled(Button)(({ theme }) => ({
  width: 112, // 28 * 4px = 112px (w-28 equivalent)
  height: 112,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`,
  },
  [theme.breakpoints.down('md')]: {
    width: 96, // 24 * 4px = 96px (w-24 equivalent)
    height: 96,
  },
}));

export const VoiceLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 500,
  color: '#2F2F37',
  textAlign: 'center',
}));

export const OrDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginTop: theme.spacing(3),
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.grey[300],
}));

export const OrText = styled(Typography)(({ theme }) => ({
  padding: `0 ${theme.spacing(2)}`,
  color: theme.palette.grey[500],
  fontWeight: 500,
  fontSize: '0.875rem',
}));
