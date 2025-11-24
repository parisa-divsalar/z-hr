import { Stack, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  minHeight: '100vh',
}));

export const HeaderSection = styled(Box)(() => ({
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

export const JobSuggestionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  alignItems: 'flex-start',
  width: '588px',
  height: '218px',
}));

export const JobSuggestionsLeft = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  flex: 1,
}));

export const JobSuggestionsHeader = styled(Box)(() => ({
  alignItems: 'center',
  gap: 10,
}));

export const MoreButton = styled(Box)(({ theme }) => ({
  backgroundColor: '#f3f4f6',
  color: '#374151',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  alignSelf: 'flex-start',
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#e5e7eb',
  },
}));

export const JobSuggestionsRight = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  flex: 1,
  height: '190px',
  overflow: 'hidden',
  position: 'relative',
}));

export const CardsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginTop: '-30px',
  transition: 'transform 4s ease-out',
  '&:hover': {
    transform: 'translateY(-45px)',
  },
}));

export const SuggestionCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: '12px',
  padding: theme.spacing(1),
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  width: '258px',
  height: '85px',
  overflow: 'hidden',
}));

export const SuggestionCardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  marginBottom: 2,
}));

export const NumberBadge = styled(Box)(() => ({
  backgroundColor: '#3b82f6',
  color: 'white',
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 600,
}));

export const SoftSkillTag = styled(Box)(() => ({
  backgroundColor: '#fef3c7',
  color: '#92400e',
  padding: '1px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 500,
}));
