'use client';

import { Stack, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';

interface PlanRequiredDialogProps {
    open: boolean;
    onClose: () => void;
}

const PlanRequiredDialog = ({ open, onClose }: PlanRequiredDialogProps) => {
    const router = useRouter();

    const handleGoToPricing = () => {
        router.push(PublicRoutes.pricing);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>Coins required</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={1}>
                    <Typography variant='subtitle2' fontWeight={500} color='text.primary'>
                        You need coins (or an active paid plan) to use this feature.
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Go to pricing to buy a coin package or upgrade your plan.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Stack direction='row' gap={1} width='100%'>
                    <MuiButton fullWidth color='secondary' onClick={handleGoToPricing}>
                        Get coins
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

