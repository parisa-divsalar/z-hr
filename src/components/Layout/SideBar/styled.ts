import { Box, ListItemButton, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 280,
    backgroundColor: '#25252a',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    height: 'calc(100vh - var(--navbar-height) - 4rem)',
    maxHeight: 'calc(100vh - var(--navbar-height) - 4rem)',
    position: 'sticky',
    top: 'calc(var(--navbar-height) + 1rem)',

    zIndex: 2,

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: 150,
        height: 150,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.25), rgba(255,255,255,0) 70%)',
    },

    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: 'auto',
        maxHeight: 'none',
        position: 'static',
        top: 'auto',
        borderRadius: '1rem',
        padding: theme.spacing(2),
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        backgroundColor: theme.palette.background.paper,
        '&::before': {
            display: 'none',
        },
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
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
        backgroundColor: active ? theme.palette.primary.main : theme.palette.grey.A700,
    },
}));

export const ItemIcon = styled(ListItemIcon)(() => ({
    minWidth: 36,
    color: '#8c8c8c',
}));
