import { Box, IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { InputContent as BaseInputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';

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
  marginTop: '2rem',
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

export const InputContent = styled(BaseInputContent)(() => ({}));

export const UploadedFilesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(1),
  overflowX: 'auto',
  marginBottom: theme.spacing(0.5),
}));

export const FilePreviewBox = styled(Box)(() => ({
  width: 100,
  height: 100,
  borderRadius: 8,
  border: '1px solid #E0E0E0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: '#F9F9FA',
  flexShrink: 0,
  position: 'relative',
}));

export const PreviewImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const RemoveFileButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 20,
  height: 20,
  borderRadius: '50%',
  padding: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& svg': {
    fontSize: 14,
  },
}));
