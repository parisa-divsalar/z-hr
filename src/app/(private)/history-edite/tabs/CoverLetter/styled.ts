import { Dialog, DialogProps, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DialogContainer = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiDialog-container': {
        padding: theme.spacing(2),
    },
    '& .MuiPaper-root': {
        borderRadius: '1rem',
        overflow: 'hidden',
        margin: 0,
        width: '100%',
        maxWidth: '760px',
        maxHeight: '70vh',
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

export const StackContent = styled(Stack)(({ theme }) => ({
    flex: 1,
    minHeight: 0,
    width: '100%',
    alignItems: 'stretch',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    textAlign: 'left',
    overflowY: 'auto',
    position: 'relative',
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


