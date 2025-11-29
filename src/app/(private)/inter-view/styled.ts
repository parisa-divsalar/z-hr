import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaymentRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  maxHeight: '100vh', // limit height to viewport
  overflowY: 'auto', // scroll only inside this content
  boxSizing: 'border-box',
  padding: 24,
  border: `1px solid ${theme.palette.grey[100]}`,
  borderRadius: '8px',
  gap: 24,
  margin: '1px',

  marginTop: '20px',
}));
