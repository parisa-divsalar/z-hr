import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiChips from '@/components/UI/MuiChips';

export const AtsFriendlyChip = styled(MuiChips)(({ theme }) => ({
    border: `1px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.light,
    borderRadius: '8px',
    height: '26px',
}));

export const SummaryTextContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: 498,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 1),
    },
}));

export const ToastContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: '588px',
    marginTop: theme.spacing(2),
    marginInline: 'auto',
}));
