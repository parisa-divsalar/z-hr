import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const INTERVIEW_COLORS = {
  background: '#F7F7F7',
  cardBackground: '#FFFFFF',
  orangeTag: '#FFAB6F',
  blueAccent: '#4DA3FF',
  greenSuccess: '#2ECC71',
  lightText: '#A1A1A1',
  darkText: '#1C1C1C',
};

export const InterviewRoot = styled(Stack)(({ theme }) => ({
  width: '100%',
  minHeight: '155vh',
  boxSizing: 'border-box',
  padding: 24,
  border: `1px solid ${theme.palette.grey[100]}`,
  borderRadius: '8px',
  gap: 24,
  margin: '1px',
  marginTop: '10px',
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

export const InterviewCardRoot = styled(CardBase)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: theme.shadows[1],
  borderRadius: 8,
}));

export const SmallCardBase = styled(CardBase)(({ theme }) => ({
  borderRadius: 8,
  padding: 16,
  border: `1px solid ${theme.palette.grey[100]}`,
}));

export const StatTitle = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 500,
  color: INTERVIEW_COLORS.lightText,
  marginBottom: 8,
}));

export const StatValueRow = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
}));

export const StatValue = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: 600,
  color: INTERVIEW_COLORS.darkText,
}));

export const TagPill = styled(Typography)(({ theme }) => ({
  borderRadius: 999,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  color: theme.palette.warning.main,
}));

export const SubText = styled(Typography)(() => ({
  fontSize: 12,
  color: INTERVIEW_COLORS.lightText,
}));

export const CardBaseiNTER = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: theme.palette.warning.light,
  border: `1px solid ${theme.palette.warning.main}`,
  padding: 20,
  boxSizing: 'border-box',
}));
