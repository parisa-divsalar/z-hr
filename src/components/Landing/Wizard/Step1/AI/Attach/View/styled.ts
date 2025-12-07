import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FilesStack = styled(Stack)(() => ({
  margin: '1rem 0',
  flexWrap: 'wrap',
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
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'grey.50',
}));

export const FilePreviewVoiceContainer = styled(Box)(({ theme }) => ({
  width: 198,
  height: 64,
  border: `1px solid ${theme.palette.grey[100]}`,

  borderRadius: '8px',
  borderColor: '#d3d3fb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
}));

export const RemoveFileButton = styled(IconButton)(() => ({
  width: 20,
  height: 20,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
}));
