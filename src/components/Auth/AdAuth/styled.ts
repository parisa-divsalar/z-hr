import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import bgLogin from '@/assets/images/bg/bg-login.png';

export const SecondChild = styled(Stack)(({ theme }) => ({
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4rem',
    borderRadius: '0 0.75rem 0.75rem 0',
    backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${bgLogin.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    [theme.breakpoints.down('lg')]: {
        padding: '2.5rem',
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));
