import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiChips from '@/components/UI/MuiChips';

export const AtsFriendlyChip = styled(MuiChips)(({ theme }) => ({
    border: `1px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.light,
    borderRadius: '8px',
    height: '26px',
}));

export const SummaryTextContainer = styled(Stack)(() => ({
    width: '498px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const ToastContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: '350px',
    marginTop: theme.spacing(2),
}));
