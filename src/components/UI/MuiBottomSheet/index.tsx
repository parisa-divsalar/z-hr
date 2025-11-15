import React, { FunctionComponent } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, Stack, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

import MuiButton from '@/components/UI/MuiButton';

interface MuiBottomSheetProps {
  title: string;
  open: boolean;
  closeDrawer: () => void;
  children: React.ReactNode;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : 'white',
    borderRadius: '1.5rem 1.5rem 0 0',
    width: '100%',
    maxWidth: '34rem',
    margin: '0 auto',
  },
}));

const ActionContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  borderTop: '1px solid ' + theme.palette.divider,
  padding: '1rem',
}));

export const MuiBottomSheet: FunctionComponent<MuiBottomSheetProps> = (props) => {
  const { title = '-', open, closeDrawer, children } = props;

  return (
    <StyledDrawer anchor='bottom' open={open} onClose={closeDrawer}>
      <Stack>
        <Stack direction='row' justifyContent='space-between' alignItems='center' px={2} pt={2}>
          <Typography color='text.primary' fontWeight='600' variant='subtitle1'>
            {title}
          </Typography>
          <IconButton onClick={closeDrawer}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>

        <Stack p={2}>{children}</Stack>

        <ActionContainer>
          <MuiButton fullWidth>Confirm</MuiButton>
        </ActionContainer>
      </Stack>
    </StyledDrawer>
  );
};
