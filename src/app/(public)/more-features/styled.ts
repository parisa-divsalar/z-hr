import { Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  minHeight: '100vh',
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  alignItems: 'center',
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

export const FeatureCard = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'stretch',
  borderRadius: '8px',
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[100]}`,
  width: 600,
  height: 102,
}));

export const FeatureCardContent = styled(Box)(() => ({
  flex: 1,
}));

export const NavigationListItem = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  padding: '24px',
  border: `1px solid ${theme.palette.grey[100]}`,
  borderRadius: '8px',
  cursor: 'pointer',
  width: 600,
  height: 102,
}));

export const NavigationListItemContent = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));
