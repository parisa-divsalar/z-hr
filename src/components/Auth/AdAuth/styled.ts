import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SecondChild = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4rem',
  borderRadius: '0 0.75rem 0.75rem 0',
  backgroundColor: theme.palette.primary.light,
}));
