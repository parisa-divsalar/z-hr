import { Stack, IconButton, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: 'calc(100vh - 290px)',
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '1rem',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}));

export const VoiceButton = styled(IconButton)(({ theme }) => ({
  width: '76px',
  height: '76px',
  borderRadius: '16px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const HorizontalDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  width: '80px',
  height: '1px',
}));

export const GlassContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: '1rem',
  width: '588px',
  height: 'auto',
  minHeight: '76px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const InputContainer = styled('textarea')(({ theme }) => ({
  width: '100%',
  borderRadius: '0.5rem',
  textAlign: 'left',
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  padding: '0.5rem 0',
  resize: 'none',
  overflow: 'hidden',
  minHeight: '1.5rem',
  height: 'auto',
  fieldSizing: 'content',
  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
  '&:focus': {
    outline: 'none',
  },
}));
