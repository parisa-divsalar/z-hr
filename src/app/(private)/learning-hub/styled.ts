import { Box, Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiButton from '@/components/UI/MuiButton';

export const LearningHubRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 200px)',
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    height: 'calc(100vh - 80px)',
  },
}));

export const HeaderDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '20px',
  marginTop: '14px',
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(1),
}));

export const RelativeStack = styled(Stack)(() => ({
  position: 'relative',
}));

export const PopupMenu = styled('div')<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '4px',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
  // match trigger (button) width by taking full width of the relative container
  width: '100%',
  height: '100px',
  zIndex: 9999,
  overflow: 'hidden',
  opacity: isOpen ? 1 : 0,
  visibility: isOpen ? 'visible' : 'hidden',
  transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
  transformOrigin: 'top right',
  transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '132px',
  },
}));

export const SortMenuContentStack = styled(Stack)(() => ({
  padding: '8px',
  gap: '2px',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const MenuItemStack = styled(Stack)(() => ({
  cursor: 'pointer',
  alignItems: 'center',
  '&:hover': {
    opacity: 0.7,
  },
}));

export const LearningHubTabButton = styled(MuiButton)(() => ({
  borderRadius: 16,
}));
