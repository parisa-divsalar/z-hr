import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ToastContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    maxWidth: '588px',
    marginTop: theme.spacing(2),
    marginInline: 'auto',
}));

