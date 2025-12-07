import { Dialog, DialogProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiDialog-container': {
    padding: theme.spacing(2),
  },

  '& .MuiPaper-root': {
    borderRadius: '1rem',
    overflow: 'hidden',
    margin: '0',
    maxWidth: '306px',
    width: '306px',
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
  width: '258px',
  alignItems: 'left',
  paddingTop: '5px',
  paddingBottom: '5px',
  textAlign: 'left',
}));

export const HeaderContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ActionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: '3px',
}));
