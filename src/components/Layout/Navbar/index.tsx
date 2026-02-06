import { useCallback, useMemo, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
import {
  sidebarMenuItems,
  isSidebarMenuItemActive,
} from '@/components/Layout/SideBar/menu';
import MuiAvatar from '@/components/UI/MuiAvatar';
import MuiButton from '@/components/UI/MuiButton';
import {
  isLayoutVisible,
  isSidebarVisible,
  PublicRoutes,
} from '@/config/routes';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useThemeStore } from '@/store/common';

const Navbar = () => {
  const { mode, setMode } = useThemeStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthSession();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If we have a cookie-based session but no accessToken in store, we still consider the user logged in.
  const showAuthedUI = isAuthenticated && !isAuthLoading;

  const isHomeActive = pathname === '/' || pathname === '/(public)';
  const showSidebarItems = isSidebarVisible(pathname);

  const isLayoutActive = isLayoutVisible(pathname);

  const navItems = useMemo(() => {
    if (showAuthedUI) {
      return [
        { label: 'Home', href: '/' },
        // TODO: Wire these up to real routes/anchors when available.
        { label: 'About Us', href: '/#about' },
        { label: 'Our Plans', href: '/#plans' },
        { label: 'Contact Us', href: '/#contact' },
      ];
    }

    // Public/unauthenticated navbar (matches the marketing top nav).
    return [
      { label: 'Home', href: '/' },
      { label: 'CV/Resume Builder', href: PublicRoutes.resumeGenerator },
      { label: 'Pricing', href:  PublicRoutes.pricing },
      { label: 'Blog', href: PublicRoutes.blog },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact Us', href: '/#contact' },
    ];
  }, [showAuthedUI]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  if (!isLayoutActive) return null;

  return (
    <MainNavbarContainer>
      <MainNavbarContent direction='row'>
        <Stack direction='row' alignItems='center' gap={{ xs: 1.25, sm: 2 }}>
          <AppImage src={logo} width={24} height={34} />

          <Typography variant='h4' fontWeight='700' color='text.primary'>
            Z-CV
          </Typography>

          <Typography
            variant='subtitle2'
            color='text.secondary'
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            AI Resume Maker
          </Typography>
        </Stack>

        {isMobile ? (
          <IconButton
            aria-label='Open menu'
            onClick={openMenu}
            sx={{
              width: 44,
              height: 44,
              border: '1px solid #F0F0F2',
              borderRadius: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Stack direction='row' gap={2}>
              {navItems.map((item) => {
                const isActive = item.href === '/' ? isHomeActive : pathname === item.href;

                return (
                  <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant='subtitle1'
                      fontWeight={isActive ? '600' : '400'}
                      color={isActive ? 'text.primary' : 'grey.500'}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                );
              })}
            </Stack>

            {showAuthedUI ? (
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
                  <IconButton color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                    {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
                  </IconButton>
                </Stack>

                <MuiAvatar size='medium' color='primary'>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    ZA
                  </Typography>
                </MuiAvatar>
              </Stack>
            ) : isAuthLoading ? null : (
              <Stack direction='row' gap={3}>
                <MuiButton
                  component={Link}
                  href={PublicRoutes.login}
                  color='secondary'
                  variant='outlined'
                  sx={{ textDecoration: 'none' }}
                >
                  Login
                </MuiButton>

                <MuiButton
                  component={Link}
                  href={PublicRoutes.register}
                  color='secondary'
                  startIcon={<UserPlusIcon />}
                  sx={{ textDecoration: 'none' }}
                >
                  Sign Up
                </MuiButton>

                <Divider orientation='vertical' variant='middle' flexItem sx={{ backgroundColor: '#D8D8DA' }} />

                {/*<Stack className={classes.themeContainer}>*/}
                {/*  <IconButton color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>*/}
                {/*    {mode === 'dark' ? <SunIcon /> : <MoonIcon />}*/}
                {/*  </IconButton>*/}
                {/*</Stack>*/}
              </Stack>
            )}
          </>
        )}
      </MainNavbarContent>

      <Drawer
        anchor='right'
        open={isMenuOpen}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            width: 'min(92vw, 360px)',
            p: 2,
          },
        }}
      >
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={1}>
          <Stack direction='row' alignItems='center' gap={1.25}>
            <AppImage src={logo} width={22} height={30} />
            <Typography variant='subtitle1' fontWeight={700}>
              Z-CV
            </Typography>
          </Stack>
          <IconButton aria-label='Close menu' onClick={closeMenu}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        <List disablePadding>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.href);
                  closeMenu();
                }}
                sx={{ borderRadius: 2 }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: item.href === '/' && isHomeActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {showSidebarItems && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Stack gap={1}>
              <Typography variant='subtitle2' color='text.secondary'>
                Dashboard
              </Typography>
              <List disablePadding>
                {sidebarMenuItems.map((item) => {
                  const isActiveItem = isSidebarMenuItemActive(item, pathname);
                  const MenuIconComponent = item.icon;

                  return (
                    <ListItem key={item.route} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          router.push(item.route);
                          closeMenu();
                        }}
                        sx={{
                          borderRadius: 2,
                          px: 1.5,
                          bgcolor: isActiveItem ? 'action.selected' : 'transparent',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <MenuIconComponent />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontWeight: isActiveItem ? 700 : 500,
                            color: isActiveItem ? 'text.primary' : 'text.secondary',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          </>
        )}

        <Divider sx={{ my: 1.5 }} />

        {showAuthedUI ? (
          <Stack gap={1.25}>
            <Stack direction='row' gap={0.75} alignItems='center' sx={{ px: 1 }}>
              <CoinIcon />
              <Typography color='secondary.main' variant='subtitle2'>
                85 Credit
              </Typography>
            </Stack>

            <MuiButton color='secondary' fullWidth>
              Create New
            </MuiButton>

            <Stack direction='row' gap={1}>
              <Box className={classes.themeContainer} sx={{ flex: '0 0 auto' }}>
                <NotifyIcon />
              </Box>
              <Box className={classes.themeContainer} sx={{ flex: '0 0 auto' }}>
                <IconButton color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                  {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
                </IconButton>
              </Box>
              <MuiAvatar size='medium' color='primary'>
                <Typography variant='subtitle2' fontWeight='bold'>
                  ZA
                </Typography>
              </MuiAvatar>
            </Stack>
          </Stack>
        ) : isAuthLoading ? null : (
          <Stack gap={1.25}>
            <MuiButton
              component={Link}
              href={PublicRoutes.login}
              color='secondary'
              variant='outlined'
              fullWidth
              onClick={closeMenu}
              sx={{ textDecoration: 'none' }}
            >
              Login
            </MuiButton>

            <MuiButton
              component={Link}
              href={PublicRoutes.register}
              color='secondary'
              startIcon={<UserPlusIcon />}
              fullWidth
              onClick={closeMenu}
              sx={{ textDecoration: 'none' }}
            >
              Sign Up
            </MuiButton>

            <Box className={classes.themeContainer} sx={{ width: '100%' }}>
              <IconButton color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Box>
          </Stack>
        )}
      </Drawer>
    </MainNavbarContainer>
  );
};

export default Navbar;
