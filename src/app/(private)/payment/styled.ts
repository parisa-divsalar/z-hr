import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaymentRoot = styled(Box)(({ theme }) => ({
    maxHeight: '100vh', // limit height to viewport
    overflowY: 'auto', // scroll only inside this content
    boxSizing: 'border-box',
    padding: 24,
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    gap: 24,
    marginTop: 10,
}));

export const PageTitle = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),

    '& h1': {
        fontSize: '24px',
        fontWeight: 700,
        color: theme.palette.text.primary,
        margin: 0,
    },

    '& p': {
        fontSize: '14px',
        color: theme.palette.text.secondary,
        margin: theme.spacing(1, 0, 0, 0),
    },

    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),

        '& h1': {
            fontSize: '20px',
        },

        '& p': {
            fontSize: '13px',
        },
    },
}));
