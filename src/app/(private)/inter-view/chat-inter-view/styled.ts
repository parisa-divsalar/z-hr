import { Box, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { InputContent as BaseInputContent } from '@/components/Landing/Wizard/Step1/SKillInput/styled';
import { ContainerSkill as BaseContainerSkill } from '@/components/Landing/Wizard/Step1/SlectSkill/styled';

export const QuestionCard = styled(Stack)(() => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    marginTop: '10px',
}));

export const QuestionBadge = styled(Box)(({ theme }) => ({
    width: 38,
    height: 54,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 584,
    fontSize: 14,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
}));

export const QuestionTexts = styled(Stack)(({ theme }) => ({
    flex: 1,
    gap: theme.spacing(0.5),
    minWidth: 0,
    overflow: 'hidden',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
}));

export const QuestionTitle = styled(Typography)({
    wordBreak: 'break-word',
});

export const AnswerText = styled(Typography)({
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    flex: 1,
    minWidth: 0,
});

export const ChatInterViewRoot = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    width: '100%',
    height: '85vh',
    maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    margin: 0,
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),

    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(2.5),
    },

    [theme.breakpoints.down('md')]: {
        height: 'auto',
        maxHeight: 'none',
        padding: theme.spacing(2),
        gap: theme.spacing(2),
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
    },
}));

export const ChatInterViewGrid = styled(Grid)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
}));

interface CenterGrayBoxProps {
    isIntro?: boolean;
}

export const CenterGrayBox = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'isIntro',
})<CenterGrayBoxProps>(({ theme, isIntro }) => ({
    width: '100%',
    maxWidth: '528px',
    margin: theme.spacing(0, 'auto'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isIntro ? theme.palette.grey[50] : 'transparent',
    borderRadius: '8px',
    padding: theme.spacing(3),
    boxSizing: 'border-box',

    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
        padding: theme.spacing(2),
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
    },
}));

export const ChatInterViewContent = styled(Stack)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        alignItems: 'stretch',
    },
}));

export const ChatInputContainer = styled(BaseContainerSkill)(({ theme }) => ({
    width: '528px',
    maxWidth: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
    },
}));

export const ChatInputContent = styled(BaseInputContent)(() => ({}));

export const ScoreSards = styled(Stack, {
    name: 'scoreSards',
    slot: 'Root',
})(({ theme }) => ({
    width: '100%',
    height: '86px',
    borderRadius: '8px',
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(2),

    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: 'auto',
    },
}));
