'use client';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

import classes from '@/components/Layout/layout.module.css';
import MuiButton from '@/components/UI/MuiButton';
import { useThemeStore } from '@/store/common';

const Navbar = () => {
  const { mode, setMode } = useThemeStore();

  return (
    <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
      <Stack>
        <Typography variant='subtitle2' fontWeight='600' color='text.primary'>
          Z-CV
        </Typography>
      </Stack>
      <Stack>
        <Typography variant='subtitle2' fontWeight='600' color='text.primary'>
          Home
        </Typography>
      </Stack>
      <Stack direction='row'>
        <IconButton disabled color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
          {mode === 'dark' ? <Brightness7 fontSize='small' /> : <Brightness4 fontSize='small' />}
        </IconButton>
        <MuiButton color='secondary'>Sign Up</MuiButton>
      </Stack>
    </Stack>
  );
};

export default Navbar;
