import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SettingRoot = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '1100px',
    padding: theme.spacing(3),
    borderRadius: '10px',
    border: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    margin: '0 auto',
    boxSizing: 'border-box',

    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2.5),
        gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        gap: theme.spacing(1.5),
        borderRadius: theme.spacing(1.5),
    },
}));

export const SectionCard = styled(Box)(({ theme }) => ({
    width: '100%',
    borderRadius: theme.spacing(1.75),
    border: `1px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    transition: 'box-shadow 0.25s ease',
    '&:hover': {
        boxShadow: theme.shadows[2],
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2.5),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.75),
        gap: theme.spacing(1.25),
    },
}));
