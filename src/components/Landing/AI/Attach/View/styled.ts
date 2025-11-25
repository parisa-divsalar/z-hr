import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FilesStack = styled(Stack)(() => ({
  margin: '1rem 0',
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
