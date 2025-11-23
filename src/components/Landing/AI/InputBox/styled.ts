import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const InputContainer = styled(Stack)<{ hasContent?: boolean }>(({ hasContent }) => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid ${hasContent ? '#1976d2' : '#e0e0e0'}`, // primary.main or grey.100
  padding: '1rem',
  width: '100%',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '5rem',
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
  padding: '0.5rem 0',
  resize: 'none',
  overflow: 'hidden',
  letterSpacing: '0',
  lineHeight: '1.5rem',

  height: 'auto',
  minHeight: '1.5rem',
  '&::placeholder': {
    color: theme.palette.grey[400],
    letterSpacing: '0',
  },
  '&:focus': {
    outline: 'none',
  },
}));

export const FilesStack = styled(Stack)(() => ({
  marginBottom: '1rem',
  flexWrap: 'wrap',
  gap: '0.25rem',
}));

export const FilePreviewContainer = styled(Box)(() => ({
  position: 'relative',
  width: 100,
  height: 100,
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'grey.300',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'grey.50',
}));

export const RemoveFileButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 20,
  height: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));
