'use client';

import { Typography } from '@mui/material';

import { SettingRoot } from '@/app/(private)/setting/styled';

const Setting = () => {
  return (
    <SettingRoot>
      <Typography variant='h5' fontWeight='500' color='text.primary'>
        Setting
      </Typography>
    </SettingRoot>
  );
};

export default Setting;
