'use client';

import { useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { SectionCard, SettingRoot } from '@/app/(private)/setting/styled';
import NewPasswordForm, { NewPasswordFormValues } from '@/components/Auth/NewPasswordForm';
import MuiRadioButton from '@/components/UI/MuiRadioButton';
import MuiSwichButton from '@/components/UI/MuiSwichButton';
import { updatePassword } from '@/services/auth/update-password';
import { useAuthStore } from '@/store/auth';

const Setting = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('option1');
    const { accessToken } = useAuthStore();

    const handlePasswordSubmit = async ({ currentPassword, password, repeatPassword }: NewPasswordFormValues) => {
        if (!accessToken) {
            throw new Error('Session expired. Please login again.');
        }

        await updatePassword({
            userId: accessToken,
            currentPassword,
            password,
            confirmPassword: repeatPassword,
        });
    };

    const radioOptions = [
        { value: 'option1', label: 'English' },
        { value: 'option2', label: 'Arabic' },
        { value: 'option3', label: 'Spanish' },
        { value: 'option4', label: 'Chinese' },
        { value: 'option5', label: 'Hindi' },
    ];

    const notificationLabels = ['Notification', 'Alert', 'Message', 'Reminder'];

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
                        Assets
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Toggle the notifications you receive from the platform.
                    </Typography>
                </Stack>
                <Stack spacing={1.25} pt={1}>
                    {notificationLabels.map((label) => (
                        <MuiSwichButton
                            key={label}
                            label={label}
                            checked={isEnabled}
                            onChange={(_, checked) => setIsEnabled(checked)}
                        />
                    ))}
                </Stack>
            </SectionCard>

            <SectionCard>
                <Stack spacing={0.5}>
                    <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                        Language
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Select the dashboard language you prefer. This applies to the entire experience.
                    </Typography>
                </Stack>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    flexWrap='wrap'
                    gap={2}
                    pt={1}
                    alignItems='flex-start'
                >
                    {radioOptions.map((radio) => (
                        <MuiRadioButton
                            key={radio.value}
                            name='setting-radio'
                            value={radio.value}
                            checked={selectedRadio === radio.value}
                            onChange={(_, value) => value && setSelectedRadio(value)}
                            label={radio.label}
                            size='medium'
                        />
                    ))}
                </Stack>
            </SectionCard>

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
