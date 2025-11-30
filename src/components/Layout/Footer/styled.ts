import { Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainFooterContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const MainFooterContent = styled(Stack)(() => ({
  width: '100%',
  maxWidth: '75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 99,
  height: '73px',
  margin: '0 auto',
}));

export const VerticalDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
}));
