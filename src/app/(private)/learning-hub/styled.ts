import { Box, Divider, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiButton from '@/components/UI/MuiButton';

export const LearningHubRoot = styled(Box)(({ theme }) => ({
    width: '100%',
    minHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    height: 'auto',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    gap: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(2.5),
    },
    [theme.breakpoints.down('md')]: {
        minHeight: 'auto',
        maxHeight: 'none',
        padding: theme.spacing(2),
        gap: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
        gap: theme.spacing(1.5),
    },
}));

export const HeaderDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    height: '20px',
    marginTop: '14px',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: theme.spacing(1),
        height: '18px',
    },
}));

export const RelativeStack = styled(Stack)(() => ({
    position: 'relative',
}));

export const LearningHubHeader = styled(Stack)(({ theme }) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(1.5),
    },
}));

export const LearningHubControls = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start',
        gap: theme.spacing(1.5),
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

export const LearningHubTabGroup = styled(Stack)(({ theme }) => ({
    width: '100%',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
}));
