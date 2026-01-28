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

interface DeleteSectionDialogProps {
    open: boolean;
    sectionLabel: string;
    isDeleting?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteSectionDialog: FunctionComponent<DeleteSectionDialogProps> = ({
    open,
    sectionLabel,
    isDeleting,
    onCancel,
    onConfirm,
}) => {
    return (
        <DialogContainer open={open} maxWidth='xs'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        Delete section?
                    </Typography>
                </HeaderContainer>

                <StackContent>
                    <Typography color='text.primary' variant='subtitle2'>
                        This will remove all content from {sectionLabel}. This action cannot be undone.
                    </Typography>
                </StackContent>

                <Divider />

                <ActionContainer>
                    <MuiButton
                        fullWidth
                        variant='contained'
                        color='secondary'
                        sx={{ width: '258px' }}
                        onClick={onConfirm}
                        disabled={Boolean(isDeleting)}
                    >
                        Delete
                    </MuiButton>
                    <MuiButton
                        fullWidth
                        variant='text'
                        color='inherit'
                        sx={{ width: '258px' }}
                        onClick={onCancel}
                        disabled={Boolean(isDeleting)}
                    >
                        Cancel
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default DeleteSectionDialog;

