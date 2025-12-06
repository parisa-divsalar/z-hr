import { IconButton, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SkillContainer = styled(Stack)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
}));

export const ContainerSkill = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: 'white',
  width: '350px',
  borderRadius: '1rem',
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.grey[100]}`,
  padding: '1rem',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const ActionRow = styled(Stack)(() => ({
  width: '100%',
  maxWidth: '350px',
  marginTop: '1.25rem',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const ActionIconButton = styled(IconButton)(() => ({
  padding: '0.25rem',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  '&:hover': {},
}));
