import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SectionCard = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  gap: theme.spacing(2),
  transition: 'all 0.3s ease',

  '&:hover': {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

