import { Box, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const FooterWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  background:
    'radial-gradient(1200px 520px at 28% -10%, rgba(77,73,252,0.18), transparent 60%), #111113',
  color: theme.palette.common.white,
  paddingTop: theme.spacing(7),
  paddingBottom: theme.spacing(4),
}));

export const FooterContent = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '75rem',
  margin: '0 auto',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export const TopRow = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const TopNav = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
}));

export const TopNavItem = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.55),
  fontSize: '0.75rem',
  fontWeight: 500,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 180ms ease',
  '&:hover': {
    color: alpha(theme.palette.common.white, 0.85),
  },
}));

export const FooterGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(10),
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(5),
  },
}));

export const LinksGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: theme.spacing(7),
  flex: 1,
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(5),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const ColumnTitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  fontWeight: 700,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(1.5),
}));

export const ColumnItem = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.62),
  lineHeight: 2,
  fontSize: '0.75rem',
  cursor: 'pointer',
  transition: 'color 180ms ease',
  '&:hover': {
    color: alpha(theme.palette.common.white, 0.85),
  },
}));

export const SocialList = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2.25),
}));

export const SocialIconBox = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: alpha(theme.palette.common.white, 0.06),
  border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
  color: alpha(theme.palette.common.white, 0.9),
}));

export const BottomNote = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: 'center',
  color: alpha(theme.palette.common.white, 0.45),
}));


