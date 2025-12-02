import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DASHBOARD_COLORS = {
  background: '#F7F7F7',
  cardBackground: '#FFFFFF',
  orangeTag: '#FFAB6F',
  blueAccent: '#4DA3FF',
  greenSuccess: '#2ECC71',
  lightText: '#A1A1A1',
  darkText: '#1C1C1C',
};
export const DashboardRoot = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  boxSizing: 'border-box',
  padding: 20,
  border: `1px solid ${theme.palette.grey[100]}`,
  borderRadius: '8px',
  gap: 24,
}));

export const SectionHeader = styled(Stack)(() => ({
  direction: 'ltr',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const CardBase = styled(Box)(() => ({
  borderRadius: 8,
  padding: 20,
  boxSizing: 'border-box',
}));

export const CommunityCardRoot = styled(CardBase)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: theme.shadows[1],
  borderRadius: 8,
}));

export const CommunityIconCircle = styled(Stack)(() => ({
  width: 42,
  height: 42,
  borderRadius: '50%',
  backgroundColor: '#F0F0F5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const CommunityIconWrapper = styled(Box)(() => ({
  '& svg': {
    fontSize: 22,
    color: DASHBOARD_COLORS.darkText,
  },
}));

export const SuggestedJobCardItem = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.grey['100']}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
}));

export const CardBaseiNTER = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,

  padding: 20,
  boxSizing: 'border-box',
}));

export const SmallCardBase = styled(CardBase)(({ theme }) => ({
  borderRadius: 8,
  padding: 16,
  border: `1px solid ${theme.palette.grey[100]}`,
}));

export const StatValueRow = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
}));

export const TagPill = styled(Typography)(({ theme }) => ({
  borderRadius: ' 4px',
  padding: '4px 10px',
  fontSize: 14,
  height: '20px',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  color: theme.palette.warning.main,
}));

export const SectionJob = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: '15px',
}));
