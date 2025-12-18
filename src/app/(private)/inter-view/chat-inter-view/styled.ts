import { Box, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import { InputContent as BaseInputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import { ContainerSkill as BaseContainerSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';

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

export const ChatInputContainer = styled(BaseContainerSkill)(() => ({
    width: '528px',
    maxWidth: '528px',
}));

export const ChatInputContent = styled(BaseInputContent)(() => ({}));
