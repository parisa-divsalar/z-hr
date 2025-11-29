import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
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
  padding: theme.spacing(3),
  width: '100%',
  height: 'calc(100vh - 200px)',
  margin: '1 auto',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',
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

export const InterviewCardRoot = styled(CardBase)(() => ({
  display: 'flex',
  padding: 0,
  height: 108,
  alignItems: 'center',
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
  borderRadius: 8,
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

// RecentInterviews Components
export const RecentInterviewsContainer = styled(Box)(() => ({
  width: '100%',
}));

export const InterviewsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const RecentInterviewCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  border: '1px solid',
  borderColor: theme.palette.grey[200],
}));

export const InterviewCardContent = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '10px',
  paddingBottom: '10px',
}));

export const InterviewMetaInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(1),
}));

export const InterviewStatusChip = styled(Box)(() => ({
  width: 100,
  height: 25,
  fontSize: '12px',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
}));

// UpcomingInterview Components
export const StepsLeftChip = styled(Box)(({ theme }) => ({
  height: 25,
  fontSize: '9px',
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 8,
  paddingBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  backgroundColor: theme.palette.warning.main,
  color: 'white',
}));

export const ActiveInterviewsRoot = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  gap: theme.spacing(2),
}));

export const ViewAllButton = styled(Button)(() => ({
  textTransform: 'none',
}));

export const InterviewCardFlex = styled(Stack)(() => ({
  flex: 1,
}));

export const CompanyAvatar = styled(Avatar)(() => ({
  width: 56,
  height: 56,
}));

export const InterviewDetails = styled(Stack)(() => ({
  flex: 1,
}));

export const DateTimeStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const SmallIcon = styled(Box)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.secondary,
}));
