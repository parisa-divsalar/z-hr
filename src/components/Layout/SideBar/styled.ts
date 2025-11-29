import { Box, ListItemButton, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SidebarContainer = styled(Box)(() => ({
  width: 282,
  height: '97%',
  backgroundColor: '#25252a',
  borderRadius: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  justifyContent: 'space-between',
  position: 'relative', // مهم

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150, // می‌تونی مقدارشو تغییر بدی
    height: 150,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.25), rgba(255,255,255,0) 70%)',
  },
}));

export const ItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  borderRadius: 8,
  margin: '4px 0',
  padding: '10px 24px',
  color: '#d1d1d1',
  fontSize: 14,
  ...(active && {
    background: theme.palette.primary.main,
    color: '#fff',
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
  }),
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.main : theme.palette.secondary.main,
  },
}));

export const ItemIcon = styled(ListItemIcon)(() => ({
  minWidth: 36,
  color: '#8c8c8c',
}));
