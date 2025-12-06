import { IconButton, Stack, Typography } from '@mui/material';
import { styled, type Theme } from '@mui/material/styles';

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

export const InputContainer = styled(Stack, {
  shouldForwardProp: shouldForwardInputContainerProp,
})<InputContainerProps>(({ theme, highlight, grow, noMarginTop }) => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid ${highlight ? theme.palette.primary.main : theme.palette.grey[100]}`,
  padding: '1rem',
  width: '100%',
  maxWidth: '458px',
  height: '52px',
  marginTop: noMarginTop ? 0 : '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  gap: '0.25rem',
  flex: grow ? 1 : undefined,
}));

export const InputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  fontSize: '1rem',
  outline: 'none',
  fontWeight: '492',
  overflow: 'hidden',
  color: theme.palette.text.primary,
  resize: 'none',
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

const getListContainerStyles = (theme: Theme) => ({
  width: '100%',
  maxWidth: '588px',
  marginTop: '10px',
  marginBottom: '10px',
  gap: '0.75rem',
  borderTop: `1px solid ${theme.palette.grey[100]}`,
});

export const ContactListContainer = styled(Stack)(({ theme }) => getListContainerStyles(theme));

export const ContactRow = styled(Stack)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
`;

export const ContactMethodText = styled(Typography)`
  flex: 1;
  word-break: break-word;
`;

export const ContactIconButton = styled(IconButton)`
  padding: 0.5px;
`;

export const AddSkillIconButton = styled(IconButton)(() => ({
  minWidth: 0,
}));

export const SkillListContainer = styled(Stack)(({ theme }) => getListContainerStyles(theme));

export const SkillRow = styled(Stack)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const SkillText = styled(Typography)`
  flex: 1;
  word-break: break-word;
`;

export const SkillIconButton = styled(IconButton)`
  padding: 0.5px;
`;

export const BottomActionsStack = styled(Stack)(() => ({
  '& > *': {
    flex: 1,
    minWidth: 0,
  },
}));
