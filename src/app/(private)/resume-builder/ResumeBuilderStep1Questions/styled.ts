import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const QuestionsContainer = styled(Box)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '3rem',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: 820,
}));

export const QuestionsMiddleSection = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: 880,
  borderRadius: 24,
  gap: theme.spacing(4),
}));

export const QuestionsTopSection = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'center',
}));

export const QuestionsMediaRow = styled(Stack)(({ theme }) => ({
  width: '96%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {},
}));

export const QuestionsMediaItem = styled(Stack)(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center important',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const QuestionsMediaIconBox = styled(Box)(() => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: 'rgba(129, 140, 248, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const QuestionsQuestionList = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2.5),
}));

export const QuestionsQuestionCard = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: 16,
}));

export const QuestionsQuestionBadge = styled(Box)(({ theme }) => ({
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

export const QuestionsQuestionTexts = styled(Stack)(({ theme }) => ({
  flex: 1,
  gap: theme.spacing(0.5),
}));

export const QuestionsBottomSection = styled(Stack)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(1),
}));

