import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

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

