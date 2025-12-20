import { Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import CoinIcon from '@/assets/images/design/coin.svg';
import MoonIcon from '@/assets/images/icons/moon.svg';
import NotifyIcon from '@/assets/images/icons/notify.svg';
import SunIcon from '@/assets/images/icons/sun.svg';
import UserPlusIcon from '@/assets/images/icons/user-plus.svg';
import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import classes from '@/components/Layout/layout.module.css';
import { MainNavbarContainer, MainNavbarContent } from '@/components/Layout/Navbar/styled';
import MuiAvatar from '@/components/UI/MuiAvatar';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes, isLayoutVisible } from '@/config/routes';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/common';

const Navbar = () => {
  const { mode, setMode } = useThemeStore();
  const { accessToken } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isHomeActive = pathname === '/' || pathname === '/(public)';

  if (!isLayoutVisible(pathname)) return null;

  return (
    <MainNavbarContainer>
      <MainNavbarContent direction='row'>
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
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Typography
              variant='subtitle1'
              fontWeight={isHomeActive ? '600' : '400'}
              color={isHomeActive ? 'text.primary' : 'grey.500'}
            >
              Home
            </Typography>
          </Link>

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

        {accessToken ? (
          <Stack direction='row' gap={3}>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <CoinIcon />
              <Typography color='secondary.main' variant='subtitle2'>
                85 Credit
              </Typography>
            </Stack>
            <MuiButton color='secondary'>Create New</MuiButton>

            <Divider orientation='vertical' variant='middle' flexItem sx={{ backgroundColor: '#D8D8DA' }} />

            <Stack className={classes.themeContainer}>
              <NotifyIcon />
            </Stack>

            <Stack className={classes.themeContainer}>
              <IconButton disabled color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Stack>

            <MuiAvatar size='medium' color='primary'>
              <Typography variant='subtitle2' fontWeight='bold'>
                ZA
              </Typography>
            </MuiAvatar>
          </Stack>
        ) : (
          <Stack direction='row' gap={3}>
            <MuiButton color='secondary' variant='outlined' onClick={() => router.push(PublicRoutes.login)}>
              Login
            </MuiButton>

            <MuiButton
              color='secondary'
              startIcon={<UserPlusIcon />}
              onClick={() => router.push(PublicRoutes.register)}
            >
              Sign Up
            </MuiButton>

            <Divider orientation='vertical' variant='middle' flexItem sx={{ backgroundColor: '#D8D8DA' }} />

            <Stack className={classes.themeContainer}>
              <IconButton disabled color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Stack>
          </Stack>
        )}
      </MainNavbarContent>
    </MainNavbarContainer>
  );
};

export default Navbar;
