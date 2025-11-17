'use client';

import { useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import AllAlert from '@/app/(public)/uikit/alert';
import AllAvatar from '@/app/(public)/uikit/Avatar';
import AllButton from '@/app/(public)/uikit/Button';
import AllCheckbox from '@/app/(public)/uikit/Checkbox';
import AllInput from '@/app/(public)/uikit/input';
import AllRadiobutton from '@/app/(public)/uikit/Radiobutton';
import { MuiBottomSheet } from '@/components/UI/MuiBottomSheet';

const UIKIT = () => {
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  return (
    <>
      <Stack p={2}>
        <AllButton />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllInput />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllAlert />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllAvatar />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllRadiobutton />

        <Divider sx={{ marginTop: '1rem' }} />

        <AllCheckbox />
      </Stack>

      <MuiBottomSheet open={openBottomSheet} closeDrawer={() => setOpenBottomSheet(false)} title='title'>
        <Typography variant='subtitle1' color='text.primary'>
          Content
        </Typography>
      </MuiBottomSheet>
    </>
  );
};

export default UIKIT;
