import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainNavbarContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const MainNavbarContent = styled(Stack)(() => ({
  width: '100%',
  maxWidth: '75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 99,
  height: '76px',
  margin: '0 auto',
}));
