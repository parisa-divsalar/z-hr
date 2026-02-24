import { Stack, Box, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Stack)(({ theme }) => ({
    padding: theme.spacing(2, 2),
    maxWidth: 1200,
    margin: '0 auto',
    minHeight: '100vh',
    gap: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3),
        gap: theme.spacing(4),
    },
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
    },
}));

export const HeaderLeft = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
}));

export const PurplePill = styled(Box)(() => ({
    background: 'linear-gradient(135deg, #FF5900 0%, #BF00FF 100%)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 16,
    fontSize: '0.75rem',
    fontWeight: 500,
}));

export const ResumePreview = styled(Paper)(({ theme }) => ({
    height: 250,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[1],
    [theme.breakpoints.up('sm')]: {
        height: 350,
    },
    [theme.breakpoints.up('md')]: {
        height: 400,
    },
}));

export const InfoTable = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(2),
}));

export const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
}));

export const FitScoreBadge = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.main,
    padding: '4px 8px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.success.main}`,
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
}));

export const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        width: 'auto',
    },
    '& > *': {
        flex: 1,
        [theme.breakpoints.up('sm')]: {
            flex: 'none',
        },
    },
}));

export const FeatureGrid = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
}));

export const FeatureCard = styled(Paper)(({ theme }) => ({
    width: '100%',
    minHeight: 135,
    padding: theme.spacing(3),
    background: 'none',
    borderRadius: 16,
    border: `1px solid ${theme.palette.grey[100]}`,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.grey[200]}`,
    },
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
        height: 135,
    },
}));

export const FeatureCardIcon = styled(Box)(() => ({
    position: 'absolute',
    top: 16,
    insetInlineEnd: 16,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    margin: theme.spacing(1, 0),
}));
