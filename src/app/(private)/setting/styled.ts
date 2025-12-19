import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SettingRoot = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '85vh',
    maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    overflowY: 'auto', // scroll only inside this content
    boxSizing: 'border-box',
    padding: 20,
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    gap: 24,
}));
