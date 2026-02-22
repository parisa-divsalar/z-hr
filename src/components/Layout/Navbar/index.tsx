import { useCallback, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  ButtonBase,
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
  Popover,
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
import CoinPricingCard from '@/components/Layout/Navbar/CoinPricingCard';
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
  PrivateRoutes,
  PublicRoutes,
} from '@/config/routes';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getMainTranslations } from '@/locales/main';
import { type Locale, useLocaleStore, useThemeStore } from '@/store/common';

function getInitials(nameOrEmail: string): string {
  const value = (nameOrEmail ?? '').trim();
  if (!value) return 'U';

  const local = value.includes('@') ? value.split('@')[0] : value;
  const parts = local
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return local.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const Navbar = () => {
  const { mode, setMode } = useThemeStore();
  const { locale, setLocale } = useLocaleStore();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthSession();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [coinAnchorEl, setCoinAnchorEl] = useState<HTMLElement | null>(null);

  const showAuthedUI = isAuthenticated && !isAuthLoading;
  const { profile, isLoading: isProfileLoading } = useUserProfile({ enabled: showAuthedUI });

  const isHomeActive = pathname === '/' || pathname === '/(public)';
  const showSidebarItems = isSidebarVisible(pathname);

  const isLayoutActive = isLayoutVisible(pathname);

  const navLabels = getMainTranslations(locale).nav;
  const navItems = useMemo(() => {
    const items = [
      { label: navLabels.home, href: '/' },
      { label: navLabels.cvResumeBuilder, href: PublicRoutes.landing },
      { label: navLabels.pricing, href: PublicRoutes.pricing },
      { label: navLabels.blog, href: PublicRoutes.blog },
      { label: navLabels.faq, href: PublicRoutes.faq },
      { label: navLabels.contactUs, href: PublicRoutes.contactUs },
    ];
    return items;
  }, [navLabels]);

  const userInitials = useMemo(() => {
    if (profile?.name?.trim()) return getInitials(profile.name);
    if (profile?.email?.trim()) return getInitials(profile.email);
    return 'U';
  }, [profile?.email, profile?.name]);

  const appT = getMainTranslations(locale).app;
  const creditsText = useMemo(() => {
    if (!showAuthedUI) return '';
    if (isProfileLoading) return '...';
    const credits = Number(profile?.coin ?? 0);
    return `${Number.isFinite(credits) ? credits : 0} ${appT.coin} `;
  }, [appT.coin, isProfileLoading, profile?.coin, showAuthedUI]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  const isCoinPopoverOpen = Boolean(coinAnchorEl);
  const coinPopoverId = isCoinPopoverOpen ? 'coin-pricing-popover' : undefined;

  const handleCoinTriggerClick = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    setCoinAnchorEl((prev) => (prev ? null : target));
  }, []);

  const handleCloseCoinPopover = useCallback(() => {
    setCoinAnchorEl(null);
  }, []);

  const handleGoToPayment = useCallback(() => {
    handleCloseCoinPopover();
  }, [handleCloseCoinPopover]);

  const handleGoToPlans = useCallback(() => {
    handleCloseCoinPopover();
    router.push(PublicRoutes.pricing);
  }, [handleCloseCoinPopover, router]);

  if (!isLayoutActive) return null;

  return (
    <MainNavbarContainer>
      <MainNavbarContent direction='row'>
        <Stack direction='row' alignItems='center' gap={{ xs: 1.25, sm: 2 }}>
          <Link
            href='/'
            aria-label='Go to home'
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Stack direction='row' alignItems='center' gap={{ xs: 1.25, sm: 2 }}>
              <AppImage src={logo} width={24} height={34} />
              <Typography variant='h4' fontWeight='700' color='text.primary'>
                Z-CV
              </Typography>
            </Stack>
          </Link>

          <Typography
            variant='subtitle2'
            color='text.secondary'
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {appT.aiResumeMaker}
          </Typography>
        </Stack>

        {isMobile ? (
          <>
            <ButtonBase
              onClick={() => setLocale((locale === 'fa' ? 'en' : 'fa') as Locale)}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                bgcolor: 'primary.light',
                '&:hover': { bgcolor: 'primary.light', opacity: 0.9 },
              }}
            >
              <Typography variant='caption' fontWeight={700}>
                {locale === 'fa' ? 'فارسی' : 'EN'}
              </Typography>
            </ButtonBase>
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
          </>
        ) : (
          <>
            <Stack direction='row' alignItems='center' gap={2}>
              <ButtonBase
                onClick={() => setLocale((locale === 'fa' ? 'en' : 'fa') as Locale)}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.light', opacity: 0.9 },
                }}
              >
                <Typography variant='subtitle2' fontWeight={700}>
                  {locale === 'fa' ? 'فارسی' : 'English'}
                </Typography>
              </ButtonBase>
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
            </Stack>

            {showAuthedUI ? (
              <Stack direction='row' gap={3}>
                <ButtonBase
                  onClick={handleCoinTriggerClick}
                  aria-describedby={coinPopoverId}
                  sx={{
                    borderRadius: 2,
                    px: 0.75,
                    py: 0.5,
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <Stack direction='row' gap={0.5} alignItems='center'>
                    <CoinIcon />
                    <Typography color='secondary.main' variant='subtitle2'>
                      {creditsText}
                    </Typography>
                  </Stack>
                </ButtonBase>


                <Divider orientation='vertical' variant='middle' flexItem sx={{ backgroundColor: '#D8D8DA' }} />

                <Stack className={classes.themeContainer}>
                  <NotifyIcon />
                </Stack>

                {/*<Stack className={classes.themeContainer}>*/}
                {/*  <IconButton color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>*/}
                {/*    {mode === 'dark' ? <SunIcon /> : <MoonIcon />}*/}
                {/*  </IconButton>*/}
                {/*</Stack>*/}

                <MuiAvatar size='medium' color='primary'>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {userInitials}
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
            <Link
              href='/'
              aria-label='Go to home'
              onClick={closeMenu}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Stack direction='row' alignItems='center' gap={1.25}>
                <AppImage src={logo} width={22} height={30} />
                <Typography variant='subtitle1' fontWeight={700}>
                  Z-CV
                </Typography>
              </Stack>
            </Link>
          </Stack>
          <IconButton aria-label='Close menu' onClick={closeMenu}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <ButtonBase
          onClick={() => setLocale((locale === 'fa' ? 'en' : 'fa') as Locale)}
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
            bgcolor: 'primary.light',
            mb: 1.5,
            '&:hover': { bgcolor: 'primary.light', opacity: 0.9 },
          }}
        >
          <Typography variant='subtitle2' fontWeight={700}>
            {locale === 'fa' ? 'فارسی' : 'English'}
          </Typography>
        </ButtonBase>

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
            <ButtonBase
              onClick={handleCoinTriggerClick}
              aria-describedby={coinPopoverId}
              sx={{
                borderRadius: 2,
                px: 1,
                py: 0.75,
                display: 'flex',
                justifyContent: 'flex-start',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Stack direction='row' gap={0.75} alignItems='center'>
                <CoinIcon />
                <Typography color='secondary.main' variant='subtitle2'>
                  {creditsText}
                </Typography>
              </Stack>
            </ButtonBase>

            <MuiButton
              color='secondary'
              fullWidth
              onClick={() => {
                router.push(`${PublicRoutes.landing}?new=1`);
                closeMenu();
              }}
            >
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
                  {userInitials}
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

      <Popover
        id={coinPopoverId}
        open={isCoinPopoverOpen}
        anchorEl={coinAnchorEl}
        onClose={handleCloseCoinPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        marginThreshold={16}
        PaperProps={{
          sx: {
            width: { xs: 'min(92vw, 360px)', sm: 360 },
            p: 2,
            borderRadius: 3,
            border: '1px solid #F0F0F2',
            boxShadow: {
              xs: '0 10px 28px rgba(15, 23, 42, 0.12)',
              sm: '0 18px 60px rgba(15, 23, 42, 0.14)',
            },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          },
        }}
      >
        <CoinPricingCard
          coinCount={Number(profile?.coin ?? 0)}
          onPayment={handleGoToPayment}
          onOurPlans={handleGoToPlans}
        />
      </Popover>
    </MainNavbarContainer>
  );
};

export default Navbar;
