import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import type { SxProps, Theme } from '@mui/material';

const HOVER_ANIM_MS = 550;
const HOVER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'; // smooth ease-out

type SxMap = Record<string, SxProps<Theme>>;
export const imageCardSliderSx: SxMap = {
    root: {
        width: '100%',
        py: 3,
    },
    list: {
        display: 'flex',
        gap: 5,
        overflowX: 'auto',
        pb: 1,
        scrollSnapType: 'x mandatory',
        scrollPaddingInline: 'calc(50% - 141px)',
        WebkitOverflowScrolling: 'touch',
        justifyContent: 'center',

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
        '@media (hover: none)': {
            '& .imageCardContent': {
                transform: 'translateY(0)',
            },
            '& .imageCardOverlay': {
                opacity: 0.82,
            },
            '& .imageCardButton': {
                opacity: 1,
                transform: 'translateY(0)',
                pointerEvents: 'auto',
            },
        },
        '&:hover .imageCardContent, &:focus-within .imageCardContent': {
            transform: 'translateY(-28px)',
        },
        '&:hover .imageCardOverlay, &:focus-within .imageCardOverlay': {
            opacity: 0.82,
        },
        '&:hover .imageCardButton, &:focus-within .imageCardButton': {
            opacity: 1,
            transform: 'translateY(0)',
            pointerEvents: 'auto',
        },
        '&:focus-visible': {
            outline: '2px solid rgba(255,255,255,0.9)',
            outlineOffset: 3,
        },
    },
    cardInner: {
        position: 'relative',
        height: 439,
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
        opacity: 0.6,
        transition: `opacity ${HOVER_ANIM_MS}ms ${HOVER_EASING}`,
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
        justifyContent: 'flex-end',
        transform: 'translateY(0)',
        willChange: 'transform',
        transition: `transform ${HOVER_ANIM_MS}ms ${HOVER_EASING}`,
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
        },
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
        alignSelf: 'center',
        mt: 1,
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.7)',
        borderRadius: 2,
        px: 3,
        py: 0.75,
        textTransform: 'none',
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(10px)',
        transition: `opacity ${HOVER_ANIM_MS}ms ${HOVER_EASING}, transform ${HOVER_ANIM_MS}ms ${HOVER_EASING}, background-color 180ms ease, border-color 180ms ease`,
        '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
        },
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








