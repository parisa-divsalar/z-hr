import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RecordingControlsStack = styled(Stack)(({ theme }) => ({
  width: 160,
  height: 44,
  border: `2px solid ${theme.palette.grey[100]}`,
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
