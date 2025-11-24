import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
  padding: '1rem',
}));

export const TermsTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: '0 0.25rem',
  fontWeight: '600',
  cursor: 'pointer',
}));
