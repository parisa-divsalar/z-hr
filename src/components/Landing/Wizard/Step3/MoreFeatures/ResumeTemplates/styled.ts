import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  width: '100%',
  height: '218px',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    width: '100%',
    height: 'auto',
  },
}));

export const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  paddingTop: '18px',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: 1,

  [theme.breakpoints.down('md')]: {
    flex: 'none',
  },
}));

export const TitleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
}));

export const RightSection = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
}));

export const FrameFeaturesImage = styled(Box)(() => ({
  width: '100%',
  maxWidth: 380,
  height: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  transform: 'translateY(0)',
  animation: 'frameRoll 12s ease-in-out infinite',

  '& svg': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  },

  '@keyframes frameRoll': {
    '0%': {
      transform: 'translateY(0)',
    },
    '35%': {
      transform: 'translateY(-24px)',
    },
    '65%': {
      transform: 'translateY(-24px)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
}));
