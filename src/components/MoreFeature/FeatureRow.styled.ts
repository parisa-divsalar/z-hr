import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiButton from '@/components/UI/MuiButton';

export const RowContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(4),
    padding: theme.spacing(1),
    borderRadius: '8px',
    border: `1px solid ${theme.palette.grey[100]}`,
    width: '100%',
    height: '171px',

    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(3),
        padding: theme.spacing(2),
        width: '100%',
        height: 'auto',
    },

    '[dir="rtl"] &': {
        flexDirection: 'row-reverse',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
}));

export const RowLeft = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    flex: 1,
    paddingTop: '18px',
    height: '100%',
    minHeight: 0,
    [theme.breakpoints.down('md')]: {
        flex: 'none',
        paddingTop: 0,
        height: 'auto',
    },
}));

export const LeftContent = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    flex: 1,
}));

export const TitleSection = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    minHeight: 0,
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
    marginInlineStart: theme.spacing(1),
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
}));

export const FooterRow = styled(Box)(({ theme }) => ({
    marginInlineStart: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    width: '100%',
}));

export const MoreButton = styled(MuiButton)(({ theme }) => ({
    backgroundColor: '#F0F0F2',
    color: theme.palette.secondary.main,
}));

export const RowRight = styled(Box)(({ theme }) => ({
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1),
}));

export const RightPreview = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'rightWidth',
})<{
    rightWidth?: number | string;
}>(({ theme, rightWidth }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    width: rightWidth ?? 'auto',
    maxWidth: '100%',

    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
}));


