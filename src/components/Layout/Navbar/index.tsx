'use client';
import { Divider, IconButton, Stack, Typography } from '@mui/material';

import MoonIcon from '@/assets/images/icons/moon.svg';
import SunIcon from '@/assets/images/icons/sun.svg';
import UserPlusIcon from '@/assets/images/icons/user-plus.svg';
import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import classes from '@/components/Layout/layout.module.css';
import MuiButton from '@/components/UI/MuiButton';
import { useThemeStore } from '@/store/common';

const Navbar = () => {
  const { mode, setMode } = useThemeStore();

  return (
    <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
      <Stack direction='row' alignItems='center' gap={2}>
        <AppImage src={logo} width={24} height={34} />

        <Typography variant='h4' fontWeight='700' color='text.primary'>
          Z-CV
        </Typography>

        <Typography variant='subtitle2' color='text.secondary'>
          AI Resume Maker
        </Typography>
      </Stack>

      <Stack direction='row' gap={2}>
        <Typography variant='subtitle1' fontWeight='700' color='text.primary'>
          Home
        </Typography>

        <Typography variant='subtitle1' color='grey.500'>
          About Us
        </Typography>

        <Typography variant='subtitle1' color='grey.500'>
          Our Plans
        </Typography>

        <Typography variant='subtitle1' color='grey.500'>
          Contact Us
        </Typography>
      </Stack>

      <Stack direction='row' gap={3}>
        <MuiButton color='secondary' variant='outlined'>
          Login
        </MuiButton>

        <MuiButton color='secondary' startIcon={<UserPlusIcon />}>
          Sign Up
        </MuiButton>

        <Divider orientation='vertical' variant='middle' flexItem sx={{ backgroundColor: '#D8D8DA' }} />

        <Stack className={classes.themeContainer}>
          <IconButton disabled color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Navbar;
