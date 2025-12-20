'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { SettingRoot } from '@/app/(private)/setting/styled';
import MuiRadioButton from '@/components/UI/MuiRadioButton';
import MuiSwichButton from '@/components/UI/MuiSwichButton';

const Setting = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('option1');

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
        </SettingRoot>
    );
};

export default Setting;
