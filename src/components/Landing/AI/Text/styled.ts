import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const InputContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  backgroundColor: 'white',
  width: '100%',
  borderRadius: '1rem',
  border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`, // primary.main or grey.100
  padding: '1rem 1rem 0.5rem 1rem',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '3rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const CircleContainer = styled(Stack)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
}));

export const InputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  paddingTop: '0.5rem',
  resize: 'none',
  overflow: 'hidden', // مهم
  height: 'auto',
  letterSpacing: '0',
  lineHeight: '1.5rem',

  minHeight: '0.5rem',

  '&::placeholder': {
    color: theme.palette.grey[400],
  },
}));
