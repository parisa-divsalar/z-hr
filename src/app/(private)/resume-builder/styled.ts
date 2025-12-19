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
    width: '100%',
    height: '85vh',
    maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    overflow: 'hidden', // resume-builder uses an internal scroll area inside the Wizard
    padding: 20,
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    gap: 24,
}));
