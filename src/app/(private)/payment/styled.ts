import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaymentRoot = styled(Box)(({ theme }) => ({
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

export const ViewButton = styled(Button)(({ theme }) => ({
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontSize: '13px',
  fontWeight: 500,
  textTransform: 'none',
  border: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    boxShadow: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '4px 12px',
    fontSize: '12px',
  },
}));

export const PageTitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),

  '& h1': {
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

    '& h1': {
      fontSize: '20px',
    },

    '& p': {
      fontSize: '13px',
    },
  },
}));
