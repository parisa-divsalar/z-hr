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
}));
export const ContainerSkillAttach = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: 'white',
  width: '350px',
  borderRadius: '1rem',
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: '1rem',
  maxWidth: '350px',
  height: 'auto',
  marginTop: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.25rem',
}));
export const ContainerSkillAttachItem = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: 'white',
  width: '550px',
  padding: '1rem',
  maxWidth: '550px',
  height: 'auto',
  marginTop: '1rem',
  display: 'flex',
  gap: '0.25rem',
}));

export const ContainerSkillAttachVoice = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: 'white',
  width: '350px',
  maxWidth: '350px',
  height: 'auto',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'left',
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
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&:focus-visible': {
    backgroundColor: 'transparent',
  },
}));
export const BackgroundEntryIndex = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  width: '38px',
  alignSelf: 'stretch',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
}));
