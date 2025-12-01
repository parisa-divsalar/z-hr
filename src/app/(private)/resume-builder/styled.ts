import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MoreFeaturesTemplatesWrapper = styled(Box)(() => ({
  width: '100%',
}));

export const MoreFeaturesTemplateCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: 8,
  border: `1px solid ${theme.palette.grey[100]}`,
  height: 102,
}));
