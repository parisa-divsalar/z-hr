import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

export const SkillContainer = styled(Stack)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
}));
