import { Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  minHeight: '100vh',
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
}));

export const FeatureCard = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  boxShadow: theme.shadows[1],
  cursor: 'pointer',
}));

export const FeatureCardContent = styled(Box)(() => ({
  flex: 1,
}));

export const NavigationListItem = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const NavigationListItemLeft = styled(Box)(() => ({
  flex: 1,
}));

export const NavigationListItemRight = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
