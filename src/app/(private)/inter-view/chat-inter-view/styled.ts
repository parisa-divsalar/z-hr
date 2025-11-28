import { Box, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  InputContainer as BaseInputContainer,
  InputContent as BaseInputContent,
} from '@/components/Landing/Wizard/Step1/SKillInput/styled';

export const ChatInterViewRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 200px)',
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 80px)',
  },
}));

export const ChatInterViewGrid = styled(Grid)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

interface CenterGrayBoxProps {
  isIntro?: boolean;
}

export const CenterGrayBox = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'isIntro',
})<CenterGrayBoxProps>(({ theme, isIntro }) => ({
  width: '100%',
  maxWidth: isIntro ? '460px' : '528px',
  margin: theme.spacing(0, 'auto'),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isIntro ? theme.palette.grey[50] : 'transparent',
  borderRadius: '8px',
}));

export const ChatInterViewContent = styled(Stack)(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface ChatInputContainerProps {
  hasValue?: boolean;
}

export const ChatInputContainer = styled(BaseInputContainer, {
  shouldForwardProp: (prop) => prop !== 'hasValue',
})<ChatInputContainerProps>(({ theme, hasValue }) => ({
  height: '52px',
  alignItems: 'center',
  marginTop: theme.spacing(8),
  borderColor: hasValue ? theme.palette.primary.main : theme.palette.grey[100],
}));

export const ChatInputContent = styled(BaseInputContent)(() => ({
  height: '52px',
  lineHeight: '52px',
  paddingTop: 0,
  paddingBottom: 0,
  backgroundColor: 'transparent',
}));
