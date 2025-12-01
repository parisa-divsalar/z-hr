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
  padding: theme.spacing(3),
  paddingBottom: 0,
  width: '100%',
  flex: 1,

  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
