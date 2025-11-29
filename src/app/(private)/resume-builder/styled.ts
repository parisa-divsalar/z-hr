import { Box, CardActionArea, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import bgAI from '@/assets/images/bg/Ellipse.png';

export const ResumeBuilderRoot = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: 0,
  width: '100%',
  flex: 1,
  margin: '1 auto',
  marginTop: '10px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflowY: 'auto',
  overflowX: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const MainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bgAI.src})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
}));

export const InputContainer = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  backgroundColor: 'white',
  width: '100%',
  borderRadius: '1rem',
  border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`,
  padding: '1rem 1rem 0.5rem 1rem',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const CircleContainer = styled(Stack)(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
}));

export const InputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  paddingTop: '0.5rem',
  resize: 'none',
  overflow: 'hidden',
  height: 'auto',
  letterSpacing: '0',
  lineHeight: '1.25rem',
  minHeight: '0.5rem',
  '&::placeholder': {
    color: theme.palette.grey[400],
  },
}));

// === Or divider (from VoiceBox) ===
export const OrDivider = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '11rem',
  marginTop: '2rem',
  marginBottom: '1rem',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: 1,
  backgroundColor: theme.palette.divider,
}));

// === Questions step (from Wizard/Step1/Questions) ===
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

// === Result step (from Wizard/Step1/Result) ===
export const ResultContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  marginTop: '5rem',
  width: '100%',
  maxWidth: 300,
}));

export const ResultRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 2),
  boxSizing: 'border-box',
}));

export const ResultTile = styled(Box)(() => ({
  width: 48,
  height: 48,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ResultIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ResultLabel = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ResultStatus = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: 600,
  color: '#00C853',
}));

// === Skill input step (from Wizard/Step1/SKillInput) ===
export const SkillInputMainContainer = styled(Stack)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}));

export const SkillInputContainer = styled(Stack)(() => ({
  backgroundColor: 'white',
  borderRadius: '1rem',
  border: `1px solid`,
  padding: '0.5rem 1rem',
  width: '100%',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '2rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const SkillInputContent = styled('textarea')(({ theme }) => ({
  width: '100%',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,
  border: 'none',
  color: theme.palette.text.primary,
  fontSize: '1rem',
  outline: 'none',
  padding: '0.5rem 0',
  resize: 'none',
  overflow: 'hidden',
  letterSpacing: '0',
  lineHeight: '1.5rem',
  height: 'auto',
  fieldSizing: 'content',
  '&::placeholder': {
    color: theme.palette.grey[400],
    letterSpacing: '0',
  },
  '&:focus': {
    outline: 'none',
  },
}));

// === Select skill step (from Wizard/Step1/SlectSkill) ===
export const SelectSkillSkillContainer = styled(Stack)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
}));

export const SelectSkillContainerSkill = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  backgroundColor: 'white',
  width: '100%',
  borderRadius: '1rem',
  border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`,
  padding: '1rem 1rem 0.5rem 1rem',
  maxWidth: '588px',
  height: 'auto',
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '0.25rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

// keep CardActionArea import used for potential future reuse
export const VoiceButton = styled(CardActionArea)(() => ({
  width: 76,
  height: 76,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
}));
