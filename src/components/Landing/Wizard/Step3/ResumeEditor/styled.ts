import { Box, Card, Typography, TextField, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainCardContainer = styled(Card)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: theme.spacing(1.5),
    boxShadow: theme.shadows[1],
    marginBottom: theme.spacing(4),
}));

export const ProfileHeaderContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

export const ProfileInfo = styled(Box)(() => ({
    flex: 1,
    marginLeft: '1rem',
}));

export const ActionButtons = styled(Box)(() => ({
    display: 'flex',
    gap: '0.5rem',
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
}));

// Resume Editor styled components
export const ResumeContainer = styled(Box)(() => ({
    maxWidth: 748,
    margin: '0 auto',
    padding: '24px',
}));

export const CardContentContainer = styled('div')(() => ({
    padding: 0,
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
    fontWeight: '500',
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
    fontWeight: '500',
    marginBottom: '4px',
}));

export const JobDetails = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 400,
}));

export const ExperienceDescription = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.6,
}));

// Profile Header styled components
export const AvatarContainer = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
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
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6',
    fontWeight: '400',
    color: theme.palette.text.primary,
}));

export const ProfileFieldTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    minHeight: '36px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.4',
    fontWeight: '400',
    color: theme.palette.text.primary,
    resize: 'none',
}));

export const ExperienceTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    minHeight: '60px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6',
    fontWeight: '400',
    color: theme.palette.text.primary,
    marginTop: '8px',
}));
