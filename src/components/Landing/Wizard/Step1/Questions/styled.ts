import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '3rem',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  boxSizing: 'border-box',
  maxWidth: 820,
}));
export const ContentCard = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: 880,
  borderRadius: 24,
  gap: theme.spacing(4),
}));

export const TopSection = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'center',
}));

export const MediaRow = styled(Stack)(({ theme }) => ({
  width: '96%',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {},
  alignItems: 'center',
  justifyContent: 'center',
}));

export const MediaItem = styled(Stack)(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center important',

  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const MediaIconBox = styled(Box)(() => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: 'rgba(129, 140, 248, 0.12)', // light purple
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const MiddleSection = styled(Stack)(() => ({
  width: '100%',
  alignItems: 'center',
 

}));

export const QuestionList = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2.5),
}));

export const QuestionCard = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: 16,
}));

export const QuestionBadge = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 12,
  backgroundColor: 'rgba(129, 140, 248, 0.16)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 14,
  color: theme.palette.text.primary,
}));

export const QuestionTexts = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(0.5),
}));

export const BottomSection = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(1),
}));
