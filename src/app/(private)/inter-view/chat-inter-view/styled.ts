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
    maxWidth: '528px',
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
}));
