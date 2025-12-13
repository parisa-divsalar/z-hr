import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  minHeight: '100vh',
  padding: '0 0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const MainContent = styled(Stack)(({ theme }) => ({
  width: '100%',
  minHeight: 'calc(100% - 5rem)',
  borderRadius: '0.75rem',
  display: 'flex',
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  flexDirection: 'row',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
    borderRadius: '1rem',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 6px',
  },
}));

export const FirstChild = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: '5rem',
  justifyContent: 'space-between',
  gap: '1rem',
  [theme.breakpoints.down('lg')]: {
    padding: '3rem',
  },
  [theme.breakpoints.down('md')]: {
    padding: '2rem',
    justifyContent: 'flex-start',
  },
}));

export const ThemeContainer = styled(Stack)(() => ({
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #F0F0F2',
  borderRadius: '0.5rem',
}));

export const LogoCard = styled(Stack)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 0 2px #f1f1f1 inset',
  cursor: 'pointer',
  transition: '0.2s',
  '&:hover': {
    boxShadow: '0 0 0 2px #d6d6d6 inset',
  },
  [theme.breakpoints.down('md')]: {
    width: 48,
    height: 48,
  },
}));
