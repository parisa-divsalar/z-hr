import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const JobSuggestionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  alignItems: 'flex-start',
  width: '100%',
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
  width: '100%',
  height: '85px',
  overflow: 'hidden',
}));

export const SuggestionCardHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  marginBottom: 2,
}));

export const NumberBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  width: 33,
  height: 28,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 600,
}));

