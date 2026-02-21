import { Stack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const MainNavbarContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  // borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  // Raise z-index above other overlays to keep the fixed navbar always visible.
  zIndex: Math.max(theme.zIndex.appBar, theme.zIndex.drawer) + 1,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.78),
}));

export const MainNavbarContent = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 99,
  height: '76px',
  margin: '0 auto',
  paddingInline: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    height: '64px',
  },
}));
