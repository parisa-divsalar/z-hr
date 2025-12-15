import { Box, Stack, Typography, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HistoryEditeRoot = styled(Box)(() => ({
    width: '100%',
    height: 'calc(100vh - 165px)',
    margin: '1 auto',
    borderRadius: '8px',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: '5px',
}));

export const PreviewEditeRoot = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: `1px solid ${theme.palette.grey[100]}`,

    '&:hover': {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    },
}));

export const SectionCard = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    borderRadius: '8px',

    border: `1px solid ${theme.palette.grey[100]}`,
}));

export const QuestionsRoot = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    transition: 'all 0.3s ease',

    '&:hover': {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    },
}));

export const QuestionList = styled(Stack)(({ theme }) => ({
    width: '100%',
    gap: theme.spacing(2.5),
}));

export const QuestionCard = styled(Stack)(() => ({
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    marginTop: '10px',
}));

export const QuestionBadge = styled(Box)(({ theme }) => ({
    width: 38,
    height: 54,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
}));

export const QuestionTexts = styled(Stack)(({ theme }) => ({
    flex: 1,
    gap: theme.spacing(0.5),
    minWidth: 0,
    overflow: 'hidden',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
}));

export const QuestionTitle = styled(Typography)({
    wordBreak: 'break-word',
});

export const AnswerRow = styled(Stack)({
    width: '100%',
});

export const AnswerLabel = styled(Typography)({
    flexShrink: 0,
});

export const AnswerText = styled(Typography)({
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    flex: 1,
    minWidth: 0,
});

export const HorizontalScrollContainer = styled(Stack)(({ theme }) => ({
    overflowX: 'auto',
    paddingBottom: theme.spacing(2),
}));

export const HorizontalItem = styled(Stack)(() => ({
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',

    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

export const SkillGapContainer = styled(Stack)(({ theme }) => ({
    width: '100%',
    gap: theme.spacing(3),
}));

export const TabsContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 400,
        minWidth: 'auto',
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
        transition: 'all 0.3s ease',
        '&.Mui-selected': {
            color: theme.palette.text.secondary,
            fontWeight: 500,
        },
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    '& .MuiTabs-indicator': {
        height: 3,
        borderRadius: '3px 3px 0 0',
    },
}));

export const SkillGapCard = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[100]}`,
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '&:hover': {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
        transform: 'translateY(-6px)',
    },
}));

export const CardImageWrapper = styled(Box)(() => ({
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
    overflow: 'hidden',
}));

export const StyledRectangleImage = styled('svg')(() => ({
    position: 'absolute',
    top: '60%',
    left: '60%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: 'auto',
}));

export const CardImage = styled('img')(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
}));

export const CardContent = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2.5),
    gap: theme.spacing(1.5),
}));

export const CardHeader = styled(Stack)(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
}));

export const CardTitleSection = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(0.5),
    flex: 1,
}));

export const CardFooter = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    paddingX: '6px',
}));

export const PriceSection = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginTop: '6px',
}));

export const Price = styled(Typography)(({ theme }) => ({
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.primary.main,
}));

export const FreeChip = styled(Box)(() => ({
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
}));

export const StyledArrowIcon = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '& .MuiSvgIcon-root': {
        fontSize: 18,
    },
});
