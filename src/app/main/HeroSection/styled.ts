import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const HeroWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    textAlign: 'center',
    padding: theme.spacing(10, 0),
    backgroundImage: 'url(/images/mask-group.svg)',
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
    maxWidth: 980,
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

export const StepsGlow = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: '50%',
    top: -120,
    transform: 'translateX(-50%)',
    width: 480,
    height: 480,
    borderRadius: '999px',
    background:
        'radial-gradient(circle at 40% 35%, rgba(255, 120, 196, 0.55), rgba(143, 111, 255, 0.35) 40%, rgba(255,255,255,0) 70%)',
    filter: 'blur(2px)',
    opacity: 0.95,
    pointerEvents: 'none',
    [theme.breakpoints.down('sm')]: {
        width: 360,
        height: 360,
        top: -140,
        opacity: 0.85,
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
    minHeight: 78,
    width: 'clamp(240px, 30vw, 320px)',
    maxWidth: '100%',
    position: 'absolute',
    willChange: 'transform',
    '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        padding: theme.spacing(1.75, 2),
        borderRadius: 18,
        position: 'relative',
        animation: 'none',
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
