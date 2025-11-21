import { FunctionComponent } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';

interface SignUpDialogProps {
  open: boolean;
  closeDialog: () => void;
  setActiveStep: (activeStep: number) => void;
}

const SignUpDialog: FunctionComponent<SignUpDialogProps> = (props) => {
  const { open, closeDialog, setActiveStep } = props;

  return (
    <DialogContainer onClose={() => {}} open={open} maxWidth='xs'>
      <StackContainer>
        <HeaderContainer direction='row'>
          <Typography color='text.primary' variant='subtitle1' fontWeight={600}>
            Sign up
          </Typography>
          <IconButton disabled onClick={closeDialog}>
            <CloseRoundedIcon />
          </IconButton>
        </HeaderContainer>

        <StackContent>
          <Typography color='text.primary' variant='subtitle2'>
            To use it, you need to sign up for Z-CV.
          </Typography>
          <Typography color='text.primary' variant='subtitle2' mt={2}>
            You can use it for free, and for your registration, we will take 10 credits for usage.
          </Typography>
        </StackContent>

        <Divider />

        <ActionContainer direction='row'>
          <MuiButton fullWidth color='secondary' variant='outlined'>
            Login
          </MuiButton>
          <MuiButton fullWidth color='secondary' onClick={() => setActiveStep(3)}>
            Sign Up
          </MuiButton>
        </ActionContainer>
      </StackContainer>
    </DialogContainer>
  );
};

export default SignUpDialog;
