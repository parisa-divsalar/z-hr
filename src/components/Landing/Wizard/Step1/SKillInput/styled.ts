import { IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}));

interface InputContainerProps {
  highlight?: boolean;
  grow?: boolean;
  noMarginTop?: boolean;
}

const shouldForwardInputContainerProp = (prop: PropertyKey) =>
  !['highlight', 'grow', 'noMarginTop'].includes(prop.toString());

export const InputContainer = styled(Stack, { shouldForwardProp: shouldForwardInputContainerProp })<
  InputContainerProps
>(({ theme, highlight, grow, noMarginTop }) => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid ${highlight ? theme.palette.primary.main : theme.palette.grey[100]}`,
  padding: '0.5rem 1rem',
  width: '100%',
  maxWidth: '588px',
  height: 'auto',
  marginTop: noMarginTop ? 0 : '1rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  flex: grow ? 1 : undefined,
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
  fieldSizing: 'content',
  '&::placeholder': {
    color: theme.palette.grey[400],
    letterSpacing: '0',
  },
  '&:focus': {
    outline: 'none',
  },
}));

const listContainerStyles = ({ theme }: { theme: any }) => ({
  width: '100%',
  maxWidth: '588px',
  marginTop: '10px',
  marginBottom: '10px',
  gap: '0.75rem',
  borderTop: `1px solid ${theme.palette.grey[100]}`,
});

const listRowStyles = () => ({
  width: '100%',
  padding: '0.2rem 1rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '0.2rem',
});

const listTextStyles = () => ({
  flex: 1,
  wordBreak: 'break-word',
});

const iconButtonStyles = () => ({
  padding: 0.5,
});

export const ContactListContainer = styled(Stack)(listContainerStyles);

export const ContactRow = styled(Stack)(listRowStyles);

export const ContactMethodText = styled(Typography)(listTextStyles);

export const ContactIconButton = styled(IconButton)(iconButtonStyles);

export const AddSkillIconButton = styled(IconButton)(() => ({
  minWidth: 0,
}));

export const SkillListContainer = styled(Stack)(listContainerStyles);

export const SkillRow = styled(Stack)(listRowStyles);

export const SkillText = styled(Typography)(listTextStyles);

export const SkillIconButton = styled(IconButton)(iconButtonStyles);

export const BottomActionsStack = styled(Stack)(() => ({
  '& > *': {
    flex: 1,
    minWidth: 0,
  },
}));
