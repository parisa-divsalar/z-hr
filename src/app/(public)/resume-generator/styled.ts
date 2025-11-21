import { Stack, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
  minHeight: '100vh',
  gap: theme.spacing(4),
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const HeaderLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}));

export const PurplePill = styled(Box)(() => ({
  backgroundColor: '#8B5CF6',
  color: 'white',
  padding: '4px 12px',
  borderRadius: 16,
  fontSize: '0.75rem',
  fontWeight: 500,
}));

export const MainContent = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const ResumePreview = styled(Paper)(({ theme }) => ({
  height: 400,
  backgroundColor: '#F5F5F5',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[1],
}));

export const InfoTable = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const FitScoreBadge = styled(Box)(() => ({
  backgroundColor: '#10B981',
  color: 'white',
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
}));

export const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export const FeatureGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  cursor: 'pointer',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  position: 'relative',
}));

export const FeatureCardIcon = styled(Box)(() => ({
  position: 'absolute',
  top: 16,
  right: 16,
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
