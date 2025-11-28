import { Box } from '@mui/material';
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
