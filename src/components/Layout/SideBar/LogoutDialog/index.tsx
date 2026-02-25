'use client';
import { FunctionComponent } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import { ActionContainer, DialogContainer, HeaderContainer, StackContainer, StackContent } from './styled';

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

const LogoutDialog: FunctionComponent<LogoutDialogProps> = (props) => {
    const router = useRouter();
    const locale = useLocaleStore((s) => s.locale);
    const sidebarT = getMainTranslations(locale).sidebar as Record<string, string>;

    const { open, onClose, onConfirm } = props;

    const handleConfirm = async () => {
        await onConfirm();
        router.replace(PublicRoutes.login);
    };

    return (
        <DialogContainer onClose={onClose} open={open} maxWidth='xs'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500}>
                        {sidebarT.logoutTitle ?? 'Log out'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </HeaderContainer>

                <StackContent>
                    <Typography color='text.primary' fontWeight={400} variant='body2' mx={2}>
                        {sidebarT.logoutConfirm ?? 'Are you sure you want to log out?'}
                    </Typography>
                </StackContent>

                <Divider />

                <ActionContainer direction='row'>
                    <MuiButton fullWidth color='secondary' variant='outlined' onClick={onClose}>
                        {sidebarT.no ?? 'No'}
                    </MuiButton>
                    <MuiButton fullWidth variant='contained' color='error' onClick={handleConfirm}>
                        {sidebarT.yes ?? 'Yes'}
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default LogoutDialog;
