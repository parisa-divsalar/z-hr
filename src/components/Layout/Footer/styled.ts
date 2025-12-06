import { Divider, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainFooterContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  borderTop: `1px solid ${theme.palette.divider}`,
  height: '73px',
  justifyContent: 'center',
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

export const IconButtonWrapper = styled(IconButton)(({ theme }) => ({
  '& svg': {
    color: theme.palette.grey[300],
    transition: 'color 0.3s ease',
  },
  '&:hover svg': {
    color: theme.palette.secondary.main,
  },
}));
