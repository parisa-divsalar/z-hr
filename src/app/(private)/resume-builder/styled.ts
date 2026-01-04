import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import ellipseBg from '@/assets/images/bg/Ellipse1.png';

export const ResumeBuilderRoot = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundImage: `url(${ellipseBg.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '250px 250px',
    backgroundPosition: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: 'calc(100vh - var(--navbar-height) - 4rem)',
    maxHeight: 'calc(100vh - var(--navbar-height) - 4rem)',
    overflow: 'hidden',
    padding: 20,
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    gap: 24,
}));
