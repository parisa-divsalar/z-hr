import { Box, Divider, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HistoryRoot = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  flex: 1,
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  backgroundColor: theme.palette.common.white,
  overflowY: 'auto',
  overflowX: 'hidden',
  marginTop: '2px',
}));

export const SectionHeader = styled(Stack)(() => ({
  direction: 'ltr',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const HistoryCommunityCardRoot = styled(Stack)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  paddingTop: '10px',
  paddingBottom: '10px',
}));

export const HistoryImage = styled(Box)(() => ({
  width: 152,
  height: 182,
  position: 'relative',
  borderRadius: 8,
  overflow: 'hidden',
}));

export const MoreButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  '& svg': {
    width: '24px',
    height: '24px',
  },
}));

export const PopupMenu = styled('div')<{ isOpen: boolean }>(({ theme, isOpen }) => ({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: '4px',
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)',
  width: '220px',
  maxHeight: '320px',
  zIndex: 9999,
  overflowY: 'auto',
  opacity: isOpen ? 1 : 0,
  visibility: isOpen ? 'visible' : 'hidden',
  transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
  transformOrigin: 'top right',
  transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
  border: `1px solid ${theme.palette.divider}`,

  [theme.breakpoints.down('sm')]: {
    width: '180px',
    maxHeight: '340px',
  },
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

export const HeaderDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '20px',
  marginTop: '14px',
}));

export const RelativeStack = styled(Stack)(() => ({
  position: 'relative',
}));

export const MenuContentStack = styled(Stack)(() => ({
  padding: '8px',
  gap: '8px',
  height: '100%',
  justifyContent: 'center',
}));

export const SortMenuContentStack = styled(Stack)(() => ({
  padding: '8px',
  gap: '6px',
  width: '100%',
}));

export const MenuItemStack = styled(Stack)(() => ({
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.7,
  },
}));

export const TagPill = styled(Typography)(({ theme }) => ({
  borderRadius: ' 4px',
  fontSize: 14,
  padding: '1px 3px',
  marginTop: '4px',
  height: '20px',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  color: theme.palette.warning.main,
}));
