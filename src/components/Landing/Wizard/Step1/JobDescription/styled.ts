import { styled } from '@mui/material/styles';

import MuiChips from '@/components/UI/MuiChips';

export const AtsFriendlyChip = styled(MuiChips)(({ theme }) => ({
    border: `1px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.light,
    borderRadius: '8px',
    height: '26px',
}));
