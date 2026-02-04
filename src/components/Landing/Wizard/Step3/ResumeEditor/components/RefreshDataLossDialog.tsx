import { FunctionComponent } from 'react';

import { Divider, Typography } from '@mui/material';

import {
    ActionContainer,
    DialogContainer,
    HeaderContainer,
    StackContainer,
    StackContent,
} from '@/components/Landing/Wizard/Step1/SlectSkill/EditSkillDialog/styled';
import MuiButton from '@/components/UI/MuiButton';

interface RefreshDataLossDialogProps {
    open: boolean;
    onClose: () => void;
}

const RefreshDataLossDialog: FunctionComponent<RefreshDataLossDialogProps> = ({ open, onClose }) => {
    return (
        <DialogContainer open={open} maxWidth='xs'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        Important
                    </Typography>
                </HeaderContainer>

                <StackContent>
                    <Typography color='text.primary' variant='subtitle2'>
                        Refreshing this page will result in data loss. Please download your resume before refreshing or
                        closing the page.
                    </Typography>
                </StackContent>

                <Divider />

                <ActionContainer>
                    <MuiButton
                        fullWidth
                        variant='contained'
                        color='secondary'
                        sx={{ width: '258px' }}
                        onClick={onClose}
                    >
                        Got it
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default RefreshDataLossDialog;


























