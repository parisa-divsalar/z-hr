import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaymentRoot = styled(Box)(({ theme }) => ({
    width: 'min(1120px, 100%)',
    margin: '16px auto',
    padding: theme.spacing(4),
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    transition: 'padding 0.3s ease, margin 0.3s ease',

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        margin: theme.spacing(2),
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        borderRadius: theme.spacing(1.25),
        border: `1px solid ${theme.palette.grey[100]}`,
        boxShadow: 'none',
    },
}));

export const PageTitle = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1),

    '& h1': {
        fontSize: '24px',
        fontWeight: 700,
        color: theme.palette.text.primary,
        margin: 0,
    },

    '& p': {
        fontSize: '14px',
        color: theme.palette.text.secondary,
        margin: 0,
    },

    [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        '& h1': {
            fontSize: '20px',
        },
        '& p': {
            fontSize: '13px',
        },
    },
}));

export const TableWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    overflowX: 'auto',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),

    '& > div': {
        minWidth: '100%',
    },
}));

export const MobilePaymentList = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const MobilePaymentRow = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[200]}`,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[0],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}));
