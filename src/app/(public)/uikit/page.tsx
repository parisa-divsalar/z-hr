'use client';

import { useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import AllAlert from '@/app/(public)/uikit/alert';
import AllButton from '@/app/(public)/uikit/Button';
import AllCheckbox from '@/app/(public)/uikit/Checkbox';
import AllChip from '@/app/(public)/uikit/chip';
import AllInput from '@/app/(public)/uikit/input';
import AllSwitch from '@/app/(public)/uikit/switch';
import ReserveIcon from '@/assets/images/icons/tabs/reserve.svg';
import { MuiBottomSheet } from '@/components/UI/MuiBottomSheet';
import MuiButton from '@/components/UI/MuiButton';
import MuiListItem from '@/components/UI/MuiListItem';
import MuiTabs from '@/components/UI/MuiTabs';

const UIKIT = () => {
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  return (
    <>
      <Stack p={2}>
        <Stack px={2}>
          <MuiListItem primary='Test text' secondary='Test text test text test text' icon={<ReserveIcon />} />
        </Stack>

        <MuiTabs />

        <Stack my={2}>
          <MuiButton fullWidth onClick={() => setOpenBottomSheet(true)}>
            Bottom sheet
          </MuiButton>
        </Stack>

        <AllButton />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllInput />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllCheckbox />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllChip />

        <Divider sx={{ marginTop: '2rem' }} />

        <AllSwitch />

        <Divider sx={{ marginTop: '1rem' }} />

        <AllAlert />

        <Divider sx={{ marginTop: '1rem' }} />
      </Stack>

      <MuiBottomSheet open={openBottomSheet} closeDrawer={() => setOpenBottomSheet(false)} title='Title'>
        <Typography variant='subtitle1' color='text.primary'>
          Test text
        </Typography>
      </MuiBottomSheet>
    </>
  );
};

export default UIKIT;
