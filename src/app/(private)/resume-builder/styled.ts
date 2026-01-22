import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import ellipseBg from '@/assets/images/bg/Ellipse1.png';

export const ResumeBuilderRoot = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundImage: `url(${ellipseBg.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '250px 250px',
    backgroundPosition: 'center',
    boxSizing: 'border-box',
    width: '100%',
    overflow: 'hidden',
    padding: theme.spacing(2.5),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: theme.shape.borderRadius,
    gap: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    transition: 'padding 0.3s ease, background-size 0.3s ease',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
        backgroundSize: '220px 220px',
        backgroundPosition: 'top 1.5rem right 1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
        backgroundSize: '180px 180px',
        backgroundPosition: 'top',
        borderRadius: '8px',
    },
}));
