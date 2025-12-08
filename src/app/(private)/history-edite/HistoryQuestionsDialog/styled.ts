import { Dialog, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    padding: theme.spacing(2),
  },
  '& .MuiPaper-root': {
    borderRadius: '1rem',
    overflow: 'hidden',
    margin: '0',
    maxWidth: '18rem',
    padding: theme.spacing(1),
  },
}));

export const StackContainer = styled(Stack)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StackContent = styled(Stack)(() => ({
  flexGrow: '1',
  padding: '1rem 3px',
  alignItems: 'center',
  textAlign: 'center',
}));

export const HeaderContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ActionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '0.5rem 1rem',
  borderTop: `1px solid ${theme.palette.divider}`,
}));




















