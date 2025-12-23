import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

type SxMap = Record<string, SystemStyleObject<Theme>>;

export const faqSx: SxMap = {
    sparkleSvg: { display: 'block' },

    section: {
        py: { xs: 6, md: 10 },
        position: 'relative',
    },
    container: { px: { xs: 2, sm: 3 } },

    stickyCol: {
        position: { xs: 'relative', md: 'sticky' },
        top: { md: 96 },
        alignSelf: 'flex-start',
    },

    heading: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'text.primary',
        lineHeight: 1.1,
        fontSize: { xs: 34, sm: 40, md: 44 },
    },
    lead: {
        mt: 1.75,
        color: 'text.secondary',
        lineHeight: 1.7,
        maxWidth: { md: 260 },
        fontSize: { xs: 15, md: 16 },
    },

    ctaWrap: { mt: 3, position: 'relative', display: 'inline-flex', alignItems: 'center' },
    ctaButton: {
        bgcolor: 'common.black',
        color: 'common.white',
        textTransform: 'none',
        borderRadius: 2.5,
        px: 2.5,
        py: 1.2,
        fontWeight: 700,
        fontSize: 15,
        '&:hover': { bgcolor: '#111111' },
    },

    sparkleCtaFloat: {
        position: 'absolute',
        left: -20,
        top: 40,
        width: 40,
        height: 40,
        display: 'grid',
        placeItems: 'center',
        filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
        pointerEvents: 'none',
    },
    sparkleTopLeftFloat: {
        position: 'absolute',
        left: { xs: 16, sm: 24 },
        top: { xs: 16, sm: 24 },
        width: 40,
        height: 40,
        display: 'grid',
        placeItems: 'center',
        filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
        pointerEvents: 'none',
    },
    sparkleCenterFloat: {
        position: 'absolute',
        right: { xs: 16, sm: 24 },
        top: '20%',
        transform: 'translateY(-50%)',
        width: 40,
        height: 40,
        display: 'grid',
        placeItems: 'center',
        filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
        pointerEvents: 'none',
    },

    accordion: {
        borderRadius: 4,
        bgcolor: 'common.white',
        border: '1px solid',
        borderColor: 'rgba(16, 24, 40, 0.08)',
        boxShadow: '0px 10px 30px rgba(16, 24, 40, 0.06)',
        overflow: 'hidden',
        transition: 'box-shadow 220ms ease, border-color 220ms ease',
        '&:before': { display: 'none' },
        '&:hover': {
            borderColor: 'rgba(16, 24, 40, 0.12)',
            boxShadow: '0px 14px 40px rgba(16, 24, 40, 0.08)',
        },
    },

    expandIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        border: '1px solid',
        borderColor: 'rgba(16, 24, 40, 0.12)',
        bgcolor: 'rgba(16, 24, 40, 0.02)',
        transition: 'transform 200ms ease, background-color 200ms ease',
    },
    expandIcon: { fontSize: 20, color: 'text.primary' },

    summary: {
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 1.75 },
        minHeight: 'unset',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-content': {
            my: 0,
            ml: 2,
        },
        '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'none',
        },
    },
    question: {
        fontWeight: 650,
        fontSize: { xs: 16, sm: 17 },
        lineHeight: 1.35,
    },

    details: {
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 2.5 },
        pt: 0,
    },
    answer: {
        color: 'text.secondary',
        lineHeight: 1.7,
        fontSize: { xs: 14, sm: 14.5 },
        maxWidth: 760,
    },
};


