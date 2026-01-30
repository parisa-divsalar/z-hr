'use client';

import { Stack, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PrivateRoutes } from '@/config/routes';

interface PlanRequiredDialogProps {
    open: boolean;
    onClose: () => void;
}

const PlanRequiredDialog = ({ open, onClose }: PlanRequiredDialogProps) => {
    const router = useRouter();

    const handleBuyPlan = () => {
        router.push(PrivateRoutes.payment);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>Plan required</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={1}>
                    <Typography variant='subtitle2' fontWeight={500} color='text.primary'>
                        Dear user, please purchase a plan before uploading files or recording voice.
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Purchasing a plan lets you unlock uploads and voice recordings.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Stack direction='row' gap={1} width='100%'>
                    <MuiButton fullWidth color='secondary' onClick={handleBuyPlan}>
                        Buy plan
                    </MuiButton>
                    <MuiButton fullWidth color='secondary' variant='text' onClick={onClose}>
                        Close
                    </MuiButton>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default PlanRequiredDialog;

