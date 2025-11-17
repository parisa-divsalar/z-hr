'use client';

import { useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import AllButton from '@/app/(public)/uikit/Button';
import { MuiBottomSheet } from '@/components/UI/MuiBottomSheet';

const UIKIT = () => {
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  return (
    <>
      <Stack p={2}>
        <AllButton />

        <Divider sx={{ marginTop: '2rem' }} />
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
