import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ChipContainer = styled(Stack)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 1rem',
  gap: '0.25rem',
  marginTop: '0.5rem',
  cursor: 'pointer',
  borderRadius: '1.5rem',
}));
