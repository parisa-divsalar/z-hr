import { Box, CardActionArea, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '2.5rem',
}));

export const VoiceButton = styled(CardActionArea)(() => ({
  width: 76,
  height: 76,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
}));

export const VoiceLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 500,
  textAlign: 'center',
}));

export const OrDivider = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '11rem',
  marginTop: '2.5rem',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.divider,
}));
