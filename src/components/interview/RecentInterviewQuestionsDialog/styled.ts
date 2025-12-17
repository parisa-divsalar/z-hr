import { Box, Dialog, DialogProps, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiDialog-container': {
        padding: theme.spacing(2),
    },

    '& .MuiPaper-root': {
        borderRadius: '1rem',
        overflow: 'hidden',
        margin: '0',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '50vh',
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
    },
}));

export const StackContainer = styled(Stack)(() => ({
    width: '100%',
    display: 'flex',
    flex: 1,
    minHeight: 0,
    alignItems: 'stretch',
}));

export const StackContent = styled(Stack)(() => ({
    flex: 1,
    minHeight: 0,
    width: '100%',
    alignItems: 'stretch',
    paddingTop: '8px',
    paddingBottom: '8px',
    textAlign: 'left',
    overflowY: 'auto',
}));

export const HeaderContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const ActionContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StyledQuestionCard = styled(Stack)(() => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginLeft: '10px',
    overflow: 'hidden',
    marginTop: '10px',
}));

export const QuestionCardInner = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(1.5),
    width: '100%',
    paddingBottom: theme.spacing(2),
}));

export const QuestionRow = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    width: '100%',
}));

export const QuestionBadge = styled(Box)(({ theme }) => ({
    width: 38,
    height: 54,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
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

export const QuestionHeading = styled(Typography)(({ theme }) => ({
    fontWeight: 492,
    color: theme.palette.text.primary,
    marginTop: theme.spacing(1),
    wordBreak: 'break-word',
}));

export const QuestionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 400,
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
}));

export const AnswerText = styled(Typography)(({ theme }) => ({
    fontWeight: 400,
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    flex: 1,
    minWidth: 0,
    marginLeft: theme.spacing(1),
}));

export const QuestionDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.grey[100],
    width: '100%',
    marginBottom: '3px',
}));
