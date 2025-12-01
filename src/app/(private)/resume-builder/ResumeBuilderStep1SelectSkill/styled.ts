import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SelectSkillSkillContainer = styled(Stack)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
}));

export const OrDivider = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '11rem',
  marginTop: '2rem',
  marginBottom: '1rem',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.divider,
}));

export const SelectSkillContainerSkill = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  backgroundColor: 'white',
  width: '100%',
  borderRadius: '1rem',
  border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`,
  padding: '1rem 1rem 0.5rem 1rem',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const SelectSkillInputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  paddingTop: '0.5rem',
  resize: 'none',
  overflow: 'hidden',
  height: 'auto',
  letterSpacing: '0',
  lineHeight: '1.25rem',
  minHeight: '0.5rem',
  '&::placeholder': {
    color: theme.palette.grey[400],
  },
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

