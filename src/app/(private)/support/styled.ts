import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SupportRoot = styled(Box)(({ theme }) => ({
    width: 'min(1120px, 100%)',
    padding: theme.spacing(3),
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2.5),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        margin: `${theme.spacing(1)} auto ${theme.spacing(2)}`,
        borderRadius: theme.spacing(1.5),
    },
}));

export const GridContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
    gap: theme.spacing(3),
    width: '100%',
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5),
}));

export const SupportInfoCard = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    boxShadow: theme.shadows[0],
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

export const AccordionItem = styled(Box)(({ theme: _theme }) => ({
    borderTop: '1px solid #F0F0F2',

    '&:first-of-type': {
        borderTop: 'none',
    },
}));

interface AccordionHeaderProps {
    expanded?: boolean;
}

export const AccordionHeader = styled('button', {
    shouldForwardProp: (prop) => prop !== 'expanded',
})<AccordionHeaderProps>(({ theme, expanded: _expanded }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 200ms ease',

    '&:hover': {
        opacity: 0.8,
    },

    '&:focus': {
        outline: 'none',
    },

    [theme.breakpoints.down('md')]: {
        padding: '18px 0',
    },

    [theme.breakpoints.down('sm')]: {
        padding: '14px 0',
        flexDirection: 'row',
        gap: '8px',
    },
}));

export const TitleWrapper = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',

    [theme.breakpoints.down('sm')]: {
        gap: '0px',
    },
}));

export const TitleText = styled('span')(({ theme }) => ({
    fontSize: '18px',
    fontWeight: 500,
    color: '#111827',
    lineHeight: 1.2,

    [theme.breakpoints.down('md')]: {
        fontSize: '17px',
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '15px',
    },
}));

export const DescriptionText = styled('span')(({ theme }) => ({
    fontSize: '14px',
    fontWeight: 400,
    color: '#6B7280',
    lineHeight: 1.2,

    [theme.breakpoints.down('md')]: {
        fontSize: '13.5px',
    },

    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
        lineHeight: 1.2,
    },
}));

interface ChevronWrapperProps {
    expanded?: boolean;
}

export const ChevronWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'expanded',
})<ChevronWrapperProps>(({ theme, expanded }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '16px',
    color: '#6B7280',
    transition: 'transform 200ms ease',
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',

    [theme.breakpoints.down('md')]: {
        marginLeft: '12px',
    },

    [theme.breakpoints.down('sm')]: {
        marginLeft: '8px',
    },
}));

interface ContentRegionProps {
    expanded?: boolean;
}

export const ContentRegion = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'expanded',
})<ContentRegionProps>(({ expanded }) => ({
    maxHeight: expanded ? '500px' : '0',
    overflow: 'hidden',
    transition: 'max-height 300ms ease, opacity 200ms ease',
    opacity: expanded ? 1 : 0,
}));

export const ContentInner = styled(Box)(({ theme }) => ({
    padding: '0 0 24px 0',

    [theme.breakpoints.down('md')]: {
        padding: '0 0 20px 0',
    },

    [theme.breakpoints.down('sm')]: {
        padding: '0 0 16px 0',
    },
}));
