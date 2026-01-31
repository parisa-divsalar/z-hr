import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const HeroWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor:'#fff',
    padding: theme.spacing(10, 0),
    backgroundImage: 'url(/images/Maskgroup.jpg)',
    backgroundSize: '100% auto',
    backgroundPosition: 'center bottom',
    backgroundRepeat: 'no-repeat',
    color: theme.palette.secondary.main,
    height: 'auto',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(7, 0),
        minHeight: '640px',
        alignItems: 'flex-start',
    },
}));

export const StepsRow = styled(Box)(({ theme }) => ({
    position: 'relative',
    marginTop: theme.spacing(6),
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 210,
    display: 'block',
    [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(4),
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1.5),
    },
}));

export const StepCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.75, 2.25),
    borderRadius: 20,
    background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.92)}, ${alpha(
        theme.palette.common.white,
        0.82,
    )})`,
    border: `1px solid ${alpha('#D9D7E5', 0.7)}`,
    boxShadow: '0 14px 34px rgba(34, 28, 85, 0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
    width: 218,
    height: 88,
    maxWidth: '100%',
    position: 'absolute',
    willChange: 'translate, opacity',
    translate: '0 0',
    transition: 'box-shadow 220ms ease',
    animation: 'stepFloat 4.8s ease-in-out infinite, stepEnter 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both',
    animationDelay: '520ms, 0ms',
    '@keyframes stepFloat': {
        '0%, 100%': { translate: '0 0' },
        '50%': { translate: '0 -4px' },
    },
    '@keyframes stepEnter': {
        from: { opacity: 0, translate: '0 28px' },
        to: { opacity: 1, translate: '0 0' },
    },
    '&:nth-of-type(1)': { animationDelay: '520ms, 0ms' },
    '&:nth-of-type(2)': { animationDelay: '740ms, 220ms' },
    '&:nth-of-type(3)': { animationDelay: '960ms, 440ms' },
    '&:hover': {
        boxShadow: '0 18px 46px rgba(34, 28, 85, 0.16), inset 0 1px 0 rgba(255,255,255,0.75)',
    },
    '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        translate: '0 0',
    },
    [theme.breakpoints.down('sm')]: {
        width: 'min(100%, 218px)',
        height: 88,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: theme.spacing(1.75, 2),
        borderRadius: 18,
        position: 'relative',
        animation: 'stepEnter 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both',
        animationDelay: '0ms',
    },
}));

export const StepBadge = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '999px',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: theme.palette.common.white,
    border: `2px solid ${alpha(theme.palette.primary.main, 0.65)}`,
    color: theme.palette.primary.main,
    fontWeight: 800,
    flex: '0 0 auto',
}));
