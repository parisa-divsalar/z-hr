import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

export const VerticalDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
}));
