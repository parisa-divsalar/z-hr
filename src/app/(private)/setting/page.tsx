'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { SettingRoot } from '@/app/(private)/setting/styled';
import NewPasswordForm, { NewPasswordFormValues } from '@/components/Auth/NewPasswordForm';
import MuiRadioButton from '@/components/UI/MuiRadioButton';
import MuiSwichButton from '@/components/UI/MuiSwichButton';
import { updatePassword } from '@/services/auth/update-password';
import { useAuthStore } from '@/store/auth';

const Setting = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('option1');
    const { accessToken } = useAuthStore();

    const handlePasswordSubmit = async ({ password, repeatPassword }: NewPasswordFormValues) => {
        if (!accessToken) {
            throw new Error('Session expired. Please login again.');
        }

        await updatePassword({
            userId: accessToken,
            password,
            confirmPassword: repeatPassword,
        });
    };

    const radioOptions = [
        { value: 'option1', label: 'English' },
        { value: 'option2', label: ' Arabic' },
        { value: 'option3', label: 'Spanish ' },
        { value: 'option4', label: 'Chinese ' },
        { value: 'option5', label: ' Hindi' },
    ];

    return (
        <SettingRoot>
            <Stack spacing={2} className='settings-stack' px={3}>
                <Typography variant='h5' fontWeight='500' color='text.primary' py={2}>
                    Setting
                </Typography>
                <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                    Asset
                </Typography>
                <MuiSwichButton
                    label='Notification'
                    checked={isEnabled}
                    onChange={(_, checked) => setIsEnabled(checked)}
                />
                <MuiSwichButton label='Alert' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
                <MuiSwichButton label='Message' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
                <MuiSwichButton label='Reminder' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
            </Stack>
            <Stack gap={1} className='settings-stack' p={3} mt={3}>
                <Typography variant='h5' fontWeight='492' color='text.primary' mt={2}>
                    Language{' '}
                </Typography>
                <Stack direction='row' gap={6} flexWrap='wrap' mt={3} pb={3}>
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
            </Stack>

            <Stack gap={1} className='settings-stack' p={3} mt={3}>
                <Typography variant='h5' fontWeight='500' color='text.primary'>
                    Change password
                </Typography>
                <Typography variant='subtitle1' fontWeight='492' color='text.primary'>
                    Use the form below to update your password without leaving the dashboard.
                </Typography>

                <NewPasswordForm
                    showCodeField={false}
                    buttonLabel='Change password'
                    successMessage='Password updated successfully'
                    onSubmit={handlePasswordSubmit}
                />
            </Stack>
        </SettingRoot>
    );
};

export default Setting;
