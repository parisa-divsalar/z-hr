import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SupportRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 200px)',
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',
  marginTop: '10px',

  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2.5),
    height: 'calc(100vh - 150px)',
  },

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 120px)',
    borderRadius: '6px',
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    height: 'calc(100vh - 80px)',
    borderRadius: '4px',
    marginTop: '8px',
  },
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: 0,
  maxWidth: '1200px',
  margin: '0 auto',

  [theme.breakpoints.down('lg')]: {
    maxWidth: '1000px',
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    gridTemplateColumns: 'repeat(12, 1fr)',
  },

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 0,
  },
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  gridColumn: '1 / 13', // span all 12 columns

  [theme.breakpoints.down('lg')]: {
    gridColumn: '1 / 13', // span all 12 columns
  },

  [theme.breakpoints.down('md')]: {
    gridColumn: '1 / 13', // span all 12 columns
  },

  [theme.breakpoints.down('sm')]: {
    gridColumn: '1 / 13', // span all 12 columns
  },
}));

export const AccordionItem = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #F0F0F2',

  '&:first-of-type': {
    borderTop: 'none',
  },
}));

interface AccordionHeaderProps {
  expanded?: boolean;
}

export const AccordionHeader = styled('button')<AccordionHeaderProps>(({ theme, expanded }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 0',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 200ms ease',

  '&:hover': {
    opacity: 0.8,
  },

  '&:focus': {
    outline: 'none',
  },

  [theme.breakpoints.down('md')]: {
    padding: '18px 0',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '14px 0',
    flexDirection: 'row',
    gap: '8px',
  },
}));

export const TitleWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',

  [theme.breakpoints.down('sm')]: {
    gap: '0px',
  },
}));

export const TitleText = styled('span')(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  color: '#111827',
  lineHeight: 1.2,

  [theme.breakpoints.down('md')]: {
    fontSize: '17px',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
}));

export const DescriptionText = styled('span')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: '#6B7280',
  lineHeight: 1.2,

  [theme.breakpoints.down('md')]: {
    fontSize: '13.5px',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
    lineHeight: 1.2,
  },
}));

interface ChevronWrapperProps {
  expanded?: boolean;
}

export const ChevronWrapper = styled(Box)<ChevronWrapperProps>(({ theme, expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '16px',
  color: '#6B7280',
  transition: 'transform 200ms ease',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',

  [theme.breakpoints.down('md')]: {
    marginLeft: '12px',
  },

  [theme.breakpoints.down('sm')]: {
    marginLeft: '8px',
  },
}));

interface ContentRegionProps {
  expanded?: boolean;
}

export const ContentRegion = styled(Box)<ContentRegionProps>(({ expanded }) => ({
  maxHeight: expanded ? '500px' : '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease, opacity 200ms ease',
  opacity: expanded ? 1 : 0,
}));

export const ContentInner = styled(Box)(({ theme }) => ({
  padding: '0 0 24px 0',

  [theme.breakpoints.down('md')]: {
    padding: '0 0 20px 0',
  },

  [theme.breakpoints.down('sm')]: {
    padding: '0 0 16px 0',
  },
}));
