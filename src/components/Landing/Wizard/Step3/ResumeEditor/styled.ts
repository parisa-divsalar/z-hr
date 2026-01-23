import { Box, Card, Typography, TextField, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainCardContainer = styled(Card)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: theme.spacing(1.5),
    boxShadow: theme.shadows[1],
    minWidth: '650px',
    width: '100%',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        minWidth: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: theme.spacing(1),
    },
}));

export const ProfileHeaderContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: theme.spacing(2),
    },
}));

export const ProfileInfo = styled(Box)(({ theme }) => ({
    flex: 1,
    marginLeft: '1rem',
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
    },
}));

export const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-end',
    },
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
    flexWrap: 'wrap',
}));

// Resume Editor styled components
export const ResumeContainer = styled(Box)(({ theme }) => ({
    maxWidth: 748,
    margin: '0 auto',
    padding: '24px',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        maxWidth: '100%',
    },
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(3),
}));

export const SummaryContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export const SummaryText = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    lineHeight: 1.6,
    fontSize: '14px',
    fontWeight: 400,
    whiteSpace: 'pre-line',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
}));

export const SkillsContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
}));

export const SkillItem = styled('span')(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(2),
    fontSize: '0.875rem',
    display: 'inline-block',
}));

export const ExperienceContainer = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(3),
}));

export const ExperienceItem = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

export const ExperienceItemSmall = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

export const CompanyName = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 400,
    marginBottom: '4px',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
}));

export const JobDetails = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 400,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
}));

export const ExperienceDescription = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.6,
    // Preserve user-entered newlines while still wrapping text nicely.
    whiteSpace: 'pre-line',
    // Prevent long words/URLs from overflowing the container.
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
}));

// Profile Header styled components
export const AvatarContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flex: 1,
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(1.5),
    },
}));

// Section Header styled components
export const SectionHeaderContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

export const SectionTitle = styled(Typography)(() => ({
    fontWeight: '600',
    fontSize: '16px',
}));

export const SectionActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
}));

export const SkillTextField = styled(TextField)(({ theme }) => ({
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: '120px',
}));

export const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    minHeight: '80px',
    padding: '8px',
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
    fontWeight: '400',
    color: theme.palette.text.primary,
}));

export const ExperienceTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    minHeight: '60px',
    padding: '8px',
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.6',
    fontWeight: '400',
    color: theme.palette.text.primary,
    marginTop: '8px',
}));
