import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import ellipseBg from '@/assets/images/bg/Ellipse1.png';

export const MoreFeaturesTemplatesWrapper = styled(Box)(() => ({
    width: '100%',
}));

export const MoreFeaturesTemplateCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${theme.palette.grey[100]}`,
    height: 102,
}));

export const ResumeBuilderRoot = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundImage: `url(${ellipseBg.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '250px 250px',
    backgroundPosition: 'center',
    boxSizing: 'border-box',
    minHeight: 0,
    // Fill the available viewport area inside the app layout.
    // This ensures the page itself doesn't scroll; only this container does.
    height: 'calc(100vh - var(--navbar-height) - var(--footer-height) - 2 * var(--children-padding))',
    maxHeight: 'calc(100vh - var(--navbar-height) - var(--footer-height) - 2 * var(--children-padding))',
    overflowY: 'auto', // scroll only inside this content
    padding: theme.spacing(3),
    paddingBottom: 0,
    width: '100%',
    flex: 1,
    margin: '0 auto',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));
