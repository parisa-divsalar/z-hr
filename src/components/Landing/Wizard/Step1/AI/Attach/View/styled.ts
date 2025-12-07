import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FilesStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(1.75, 0),
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const FilePreviewContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: number }>(({ size = 100, theme }) => ({
  position: 'relative',
  width: size,
  height: size,
  borderRadius: '8px',
  border: '1px solid',
  borderColor: theme.palette.grey[100],
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'grey.50',
}));

export const FilePreviewVoiceContainer = styled(Box)(({ theme }) => ({
  width: 145,
  height: 64,
  border: `1px solid ${theme.palette.grey[100]}`,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

export const RemoveFileButton = styled(IconButton)(() => ({
  width: 24,
  height: 24,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));
