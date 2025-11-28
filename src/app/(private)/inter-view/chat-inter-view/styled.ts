import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ChatInterViewRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 200px)',
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 80px)',
  },
}));

export const CenterGrayBox = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  margin: theme.spacing(0, 'auto'),
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[50],
  padding: '10px',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const PageTitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),

  '& h1, & h5': {
    fontSize: '24px',
    fontWeight: 700,
    color: theme.palette.text.primary,
    margin: 0,
  },

  '& p': {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    margin: theme.spacing(1, 0, 0, 0),
  },

  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),

    '& h1, & h5': {
      fontSize: '20px',
    },

    '& p': {
      fontSize: '13px',
    },
  },
}));
