import type { Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';

type SxMap = Record<string, SystemStyleObject<Theme>>;

export const faqPublicSx: SxMap = {
  root: {
    width: '100%',
    minHeight: '100vh',
  },

  hero: {
    width: '100%',
    pt: { xs: 2, sm: 3 },
    pb: { xs: 5, sm: 6, md: 7 },
  },

  heroInner: {
    maxWidth: 920,
    mx: 'auto',
    px: { xs: 2, sm: 3 },
    textAlign: 'center',
  },

  breadcrumbs: {
    justifyContent: 'center',
    mb: { xs: 1, sm: 1.25 },
    '& .MuiBreadcrumbs-ol': { justifyContent: 'center' },
    '& .MuiBreadcrumbs-separator': { color: 'text.secondary' },
    '& .MuiTypography-root': {
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },



  heroLead: {
    mt: { xs: 1.25, sm: 1.75 },
    mx: 'auto',
    maxWidth: 760,
    fontWeight: 492,
    color: 'text.primary',
    opacity: 0.9,
    lineHeight: 1.7,
    fontSize: { xs: 14.5, sm: 15.5, md: 16 },
  },

  heroSearchWrap: {
    mt: { xs: 2.5, sm: 3 },
    display: 'flex',
    justifyContent: 'center',
  },

  heroSearch: {
    width: '100%',
    maxWidth: 450,
    '& .MuiOutlinedInput-root': {
      borderRadius: '16px',
      height: 52,
      '& fieldset': {
      },
      '&:hover fieldset': {
      },
      '&.Mui-focused fieldset': {
      },
    },
    '& input::placeholder': { opacity: 0.7 },
  },


  contentSection: {
    width: '100%',
      bgcolor: '#F9F9FE',

      position: 'relative',
    pt: { xs: 5, sm: 6, md: 7 },
    pb: { xs: 6, sm: 7, md: 9 },
    overflow: 'hidden',
  },

  contentInner: {
    maxWidth: 980,
    mx: 'auto',
    px: { xs: 2, sm: 3 },
  },

  sectionTitle: {
    textAlign: 'center',
  },

  sectionLead: {
    textAlign: 'center',
    mt: 1.25,
    mx: 'auto',
    maxWidth: 760,
    fontWeight: 492,
    color: 'text.primary',
    opacity: 0.85,
    lineHeight: 1.7,
    fontSize: { xs: 14.5, sm: 15.5, md: 16 },
  },

  tabsRow: {
    mt: { xs: 3, sm: 3.5 },
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },

  tabsScroller: {
    display: 'flex',
    gap: 1,
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    pb: 1,
    pl: 0.5,
    pr: 2,
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(16, 24, 40, 0.22) transparent',
    // WebKit (Chrome/Edge/Safari): keep it very thin, but grow a bit on hover to make the handle easy to grab.
    '&::-webkit-scrollbar': { height: 2 },
    '&:hover::-webkit-scrollbar': { height: 4 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(16, 24, 40, 0.18)',
      borderRadius: 999,
      // Makes the thumb *look* slimmer on Windows where the OS may enforce a minimum scrollbar thickness.
      border: '1px solid transparent',
      backgroundClip: 'padding-box',
    },
  },

  tabPill: {
    flexShrink: 0,
    borderRadius: 999,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 12.5,
    lineHeight: 1,
    px: 1.5,
    py: 1,
    whiteSpace: 'nowrap',
    border: '1px solid rgba(16, 24, 40, 0.10)',
    bgcolor: 'rgba(255,255,255,0.75)',
    color: 'text.primary',
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.95)',
      borderColor: 'rgba(16, 24, 40, 0.14)',
    },
  },

  tabPillActive: {
    borderColor: 'rgba(99, 102, 241, 0.65)',
    bgcolor: 'rgba(99, 102, 241, 0.08)',
    color: '#4F46E5',
  },

  listWrap: {
    mt: { xs: 2, sm: 2.5 },
    display: 'grid',
    gap: 1.5,
    maxWidth: 860,
    mx: 'auto',
  },

  accordion: {
    borderRadius: '24px',
    bgcolor: 'common.white',
    border: '1px solid',
    borderColor: 'rgba(16, 24, 40, 0.08)',
    overflow: 'hidden',
    '&:before': { display: 'none' },
    '&.MuiAccordion-root.Mui-expanded': { margin: 0, borderRadius: '24px' },
    '&.MuiAccordion-root:first-of-type': { borderRadius: '24px' },
    '&.MuiAccordion-root:last-of-type': { borderRadius: '24px' },
    '&.MuiAccordion-root.Mui-expanded:first-of-type': { borderRadius: '24px' },
    '&.MuiAccordion-root.Mui-expanded:last-of-type': { borderRadius: '24px' },
  },

  summary: {
    position: 'relative',
    pl: { xs: 2, sm: 3 },
    pr: { xs: 7, sm: 8 },
    py: 0,
    minHeight: { xs: 76, sm: 80 },
    '&.Mui-expanded': { minHeight: { xs: 76, sm: 80 } },
    '& .MuiAccordionSummary-content': {
      my: 0,
      mx: 0,
      alignItems: 'center',
      '&.Mui-expanded': { my: 0 },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      position: 'absolute',
      right: { xs: 16, sm: 24 },
      left: 'auto',
      top: '50%',
      margin: 0,
      transform: 'translateY(-50%)',
      '&.Mui-expanded': { transform: 'translateY(-50%)' },
    },
  },

  question: {
    fontWeight: 650,
    fontSize: { xs: 15, sm: 16 },
    lineHeight: 1.35,
  },

  details: {
    px: { xs: 2, sm: 3 },
    pb: { xs: 2, sm: 2.5 },
    pt: 0,
  },

  answer: {
    color: 'text.secondary',
    maxWidth: 820,
  },

  expandIconBubble: {
    width: 36,
    height: 36,
    borderRadius: '24px',
    display: 'grid',
    placeItems: 'center',
    border: '1px solid rgba(16, 24, 40, 0.12)',
    bgcolor: 'transparent',
  },

  chip: {
    mt: 1.5,
    alignSelf: 'flex-start',
    borderRadius: '24px',
    height: 26,
    fontWeight: 600,
    fontSize: 12,
    bgcolor: 'rgba(99, 102, 241, 0.08)',
    color: '#4F46E5',
  },

  sparkleFloatLeft: {
    position: 'absolute',
    left: { xs: 16, sm: 24 },
    top: { xs: 46, sm: 56 },
    width: 40,
    height: 40,
    display: 'grid',
    placeItems: 'center',
    filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
    pointerEvents: 'none',
    opacity: 0.95,
  },

  sparkleFloatRight: {
    position: 'absolute',
    right: { xs: 16, sm: 24 },
    top: { xs: 160, sm: 180 },
    width: 40,
    height: 40,
    display: 'grid',
    placeItems: 'center',
    filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
    pointerEvents: 'none',
    opacity: 0.95,
  },
};


