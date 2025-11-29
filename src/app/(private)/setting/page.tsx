'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { SettingRoot } from '@/app/(private)/setting/styled';
import MuiSwichButton from '@/components/UI/MuiSwichButton';

const Setting = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <SettingRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Setting
      </Typography>
      <Stack spacing={3} mt={3}>
        <MuiSwichButton label='Notification' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
        <MuiSwichButton label='Alert' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
        <MuiSwichButton label='Message' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
        <MuiSwichButton label='Reminder' checked={isEnabled} onChange={(_, checked) => setIsEnabled(checked)} />
      </Stack>
    </SettingRoot>
  );
};

export default Setting;
