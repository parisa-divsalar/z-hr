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
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

interface RefreshDataLossDialogProps {
    open: boolean;
    onClose: () => void;
}

const RefreshDataLossDialog: FunctionComponent<RefreshDataLossDialogProps> = ({ open, onClose }) => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).landing.wizard.resumeEditor.refreshDataLossDialog;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const isRtl = dir === 'rtl';

    return (
        <DialogContainer open={open} maxWidth='xs'>
            <StackContainer dir={dir} sx={{ direction: dir, textAlign: isRtl ? 'right' : 'left' }}>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='body1' fontWeight={500} sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {t.title}
                    </Typography>
                </HeaderContainer>

                <StackContent>
                    <Typography color='text.primary' variant='subtitle2' sx={{ textAlign: isRtl ? 'right' : 'left' }}>
                        {t.body}
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
                        {t.gotIt}
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default RefreshDataLossDialog;




































