'use client';

import { Box, Stack, Typography } from '@mui/material';

import { SectionCard, SettingRoot } from '@/app/(private)/setting/styled';
import NewPasswordForm, { NewPasswordFormValues } from '@/components/Auth/NewPasswordForm';
import { updatePassword } from '@/services/auth/update-password';

const Setting = () => {
    const handlePasswordSubmit = async ({ currentPassword, password, repeatPassword }: NewPasswordFormValues) => {
        await updatePassword({
            currentPassword: currentPassword ?? '',
            password,
            confirmPassword: repeatPassword,
        });
    };

    return (
        <SettingRoot>
            <Stack spacing={0.5}>
                <Typography variant='h5' fontWeight='500' color='text.primary'>
                    Setting
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    Configure notifications, language preferences, and update your password from one place.
                </Typography>
            </Stack>

            <SectionCard>
                <Stack spacing={0.5}>
                    <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                        Password
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Keep your account protected by regularly refreshing your password.
                    </Typography>
                </Stack>

                <Box sx={{ width: '100%', maxWidth: 700 }}>
                    <NewPasswordForm
                        showCodeField={false}
                        showCurrentPassword
                        fieldsLayout='stack'
                        fieldGridSize={6}
                        showResetButton
                        buttonLabel='Save'
                        primaryButtonWidth={68}
                        successMessage='Password updated successfully'
                        onSubmit={handlePasswordSubmit}
                    />
                </Box>
            </SectionCard>
        </SettingRoot>
    );
};

export default Setting;
