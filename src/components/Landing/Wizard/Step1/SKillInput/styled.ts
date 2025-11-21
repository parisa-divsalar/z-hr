import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}));

export const InputContainer = styled(Stack)(() => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid`,
  padding: '0.5rem 1rem',
  width: '100%',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const InputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  padding: '0.5rem 0',
  resize: 'none',
  overflow: 'hidden',
  letterSpacing: '0',
  lineHeight: '1.5rem',

  height: 'auto',
  fieldSizing: 'content',
  '&::placeholder': {
    color: theme.palette.grey[400],
    letterSpacing: '0',
  },
  '&:focus': {
    outline: 'none',
  },
}));
