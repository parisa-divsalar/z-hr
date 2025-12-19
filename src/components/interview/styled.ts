import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const InterviewRoot = styled(Stack)(({ theme }) => ({
    width: '100%',
    height: '85vh',
    maxHeight: 'calc(100vh - var(--navbar-height) - 2rem)',
    overflowY: 'auto', // scroll only inside this content
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
    borderRadius: '8px',
    border: '1px solid',
    borderColor: theme.palette.grey[100],
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
    marginTop: theme.spacing(2),
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

export const START_INTERVIEW_DIALOG_PAPER_SX = {
    borderRadius: '8px',
    width: '306px',
    overflow: 'hidden',
    margin: 0,
} as const;

export const START_INTERVIEW_DIALOG_HEADER_SX = {
    px: 2,
    py: 1.5,
} as const;

export const START_INTERVIEW_DIALOG_CONTENT_SX = {
    px: 2,
    py: 2,
} as const;

export const START_INTERVIEW_DIALOG_ACTIONS_SX = {
    p: 2,
} as const;

export const START_INTERVIEW_DIALOG_SELECT_SX = {
    height: '42px',
    minHeight: '42px',
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        height: '100%',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '8px',
    },
} as const;

export const START_INTERVIEW_DIALOG_MENU_PAPER_SX = {
    maxHeight: '180px',
    overflowY: 'auto',
    py: 1,
    '& .MuiMenu-list': { py: 0.5 },
} as const;
