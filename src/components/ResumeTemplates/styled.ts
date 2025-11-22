import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  width: '588px',
  height: '218px',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    width: '100%',
    height: 'auto',
  },
}));

export const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: '0 0 235px',

  [theme.breakpoints.down('md')]: {
    flex: 'none',
  },
}));

export const TitleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

export const Description = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const MoreButton = styled(Box)(({ theme }) => ({
  backgroundColor: '#f3f4f6',
  color: '#374151',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  alignSelf: 'flex-start',
  marginTop: theme.spacing(1),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '#e5e7eb',
  },

  [theme.breakpoints.down('md')]: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
}));

export const RightSection = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '190px',
  overflow: 'hidden',
  position: 'relative',
}));

export const ResumeCardGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 126px)',
  gap: 12,
  maxWidth: 'fit-content',
  marginTop: '-50px',
  transition: 'transform 0.5s ease-in-out',
  position: 'relative',

  '&:hover': {
    transform: 'translateY(-130px)', // تنظیم مجدد اسلاید برای نمایش مناسب
  },
}));

export const CardImage = styled(Box)(() => ({
  width: '100%',
  height: '75px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9fafb',

  '&.half-image': {
    height: '150px',
    position: 'relative',
    top: '-75px',
    overflow: 'visible',
  },

  '& svg': {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
  },
}));

export const ResumeCard = styled(Box)(({ theme }) => ({
  width: '126px',
  height: '163px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',

  '&.half-visible': {
    height: '81px', // نصف ارتفاع
    overflow: 'visible',
    position: 'relative',
  },

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.12)',
  },
}));

export const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export const JobTitle = styled(Box)(() => ({
  marginBottom: '1px',
}));

export const LevelTag = styled(Box)(() => ({
  backgroundColor: '#fef3c7',
  color: '#92400e',
  padding: '1px 8px',
  borderRadius: '12px',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 500,
  marginBottom: '1px',
}));

export const PriceTag = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const CardMoreButton = styled(Box)(() => ({
  backgroundColor: '#f9fafb',
  color: '#6b7280',
  padding: '1px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  border: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
}));

export const BookmarkIcon = styled(Box)(() => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: '50%',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: '#f3f4f6',
  },
}));
