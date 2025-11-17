import { Dialog, DialogProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiDialog-container': {
    backgroundColor: '#003034',
    padding: theme.spacing(2),
  },

  '& .MuiPaper-root': {
    borderRadius: '1.5rem',
    overflow: 'hidden',
    margin: '0',
    padding: theme.spacing(1),
  },
}));

export const StackContainer = styled(Stack)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: '1rem',
}));

export const StackContent = styled(Stack)(() => ({
  flexGrow: '1',
  alignItems: 'center',
  textAlign: 'center',
}));

export const RowContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  width: '90%',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,

  '@media(max-width: 360px)': {
    padding: '0.5rem 0.75rem',
  },
}));
