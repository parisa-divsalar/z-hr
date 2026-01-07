import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import type { SxProps, Theme } from '@mui/material';

type SxMap = Record<string, SxProps<Theme>>;
export const imageCardSliderSx: SxMap = {
    root: {
        width: '100%',
        py: 3,
    },
    list: {
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 1,
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: 'calc(50% - 141px)',
        WebkitOverflowScrolling: 'touch',
        justifyContent: 'center',
        px: 2,
        '& > *': {
            scrollSnapAlign: 'center',
        },
        '&::-webkit-scrollbar': {
            height: 6,
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.18)',
            borderRadius: 999,
        },
    },
    card: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        width: 282,
        minWidth: 282,
        maxWidth: 282,
        flex: '0 0 282px',
        cursor: 'pointer',
    },
    cardInner: {
        position: 'relative',
        height: 350,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.72) 100%)',
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        p: 2,
        pb: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: '#fff',
    },
    title: {
        fontWeight: 600,
        lineHeight: 1.2,
        textShadow: '0 1px 8px rgba(0,0,0,0.35)',
    },
    description: {
        opacity: 0.92,
        textShadow: '0 1px 8px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
    },
    ctaButton: {
        alignSelf: 'flex-start',
        mt: 1,
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.7)',
        '&:hover': {
            borderColor: '#fff',
            backgroundColor: 'rgba(255,255,255,0.08)',
        },
    },
};
export const BlogSection = styled(Stack)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    backgroundColor: theme.palette.secondary.contrastText,
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(6),
    },
}));
