'use client';
import { useState } from 'react';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { List, Stack, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import DashboardRoundedIcon from '@/assets/images/menu/Icon1.svg';
import ArticleRoundedIcon from '@/assets/images/menu/Icon2.svg';
import HistoryRoundedIcon from '@/assets/images/menu/Icon3.svg';
import CreditCardRoundedIcon from '@/assets/images/menu/Icon4.svg';
import SchoolRoundedIcon from '@/assets/images/menu/Icon5.svg';
import SettingsRoundedIcon from '@/assets/images/menu/Icon6.svg';
import HeadphonesRoundedIcon from '@/assets/images/menu/Icon7.svg';
import MicRoundedIcon from '@/assets/images/menu/Icon8.svg';
import LogoutDialog from '@/components/Layout/SideBar/LogoutDialog';
import { ItemButton, SidebarContainer, ItemIcon, SidebarItemText } from '@/components/Layout/SideBar/styled';
import { PrivateRoutes, VisibilitySideBar } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleConfirmLogout = async () => {
    await logout();
    setOpenLogoutDialog(false);
  };

  const isSideBarVisible = VisibilitySideBar.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isHistoryActive =
    pathname === PrivateRoutes.history ||
    pathname === PrivateRoutes.historyEdite ||
    pathname.startsWith(`${PrivateRoutes.history}/`) ||
    pathname.startsWith(`${PrivateRoutes.historyEdite}/`);

  if (!isSideBarVisible) return null;

  return (
    <SidebarContainer>
      <Stack>
        <Typography
          color='grey.300'
          variant='caption'
          px={3}
          pt={3}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          Menu
        </Typography>
        <List>
          <ItemButton
            active={pathname === PrivateRoutes.dashboard}
            onClick={() => router.push(PrivateRoutes.dashboard)}
          >
            <ItemIcon>
              <DashboardRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Dashboard' />

            {pathname === PrivateRoutes.dashboard && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.resumeBuilder}
            onClick={() => router.push(PrivateRoutes.resumeBuilder)}
          >
            <ItemIcon>
              <ArticleRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Resume Builder' />

            {pathname === PrivateRoutes.resumeBuilder && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton active={isHistoryActive} onClick={() => router.push(PrivateRoutes.history)}>
            <ItemIcon>
              <HistoryRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='History' />
            {isHistoryActive && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.payment} onClick={() => router.push(PrivateRoutes.payment)}>
            <ItemIcon>
              <CreditCardRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Payment' />
            {pathname === PrivateRoutes.payment && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.learningHub}
            onClick={() => router.push(PrivateRoutes.learningHub)}
          >
            <ItemIcon>
              <SchoolRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Learning Hub' />

            {pathname === PrivateRoutes.learningHub && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.interView}
            onClick={() => router.push(PrivateRoutes.interView)}
          >
            <ItemIcon>
              <MicRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Interview' />
            {pathname === PrivateRoutes.interView && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.setting} onClick={() => router.push(PrivateRoutes.setting)}>
            <ItemIcon>
              <SettingsRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Setting' />
            {pathname === PrivateRoutes.setting && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.support} onClick={() => router.push(PrivateRoutes.support)}>
            <ItemIcon>
              <HeadphonesRoundedIcon fontSize='small' />
            </ItemIcon>
            <SidebarItemText primary='Support' />
            {pathname === PrivateRoutes.support && (
              <KeyboardArrowRightRoundedIcon sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
            )}
          </ItemButton>
        </List>
      </Stack>

      <Stack>
        <ItemButton onClick={() => setOpenLogoutDialog(true)}>
          <SidebarItemText primary='Log out' sx={{ color: '#F77A79' }} />

          <LogoutRoundedIcon sx={{ color: '#F77A79' }} fontSize='small' />
        </ItemButton>

        <Typography
          color='grey.300'
          variant='caption'
          px={3}
          pb={3}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          Version 1.3.23
        </Typography>
      </Stack>

      <LogoutDialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </SidebarContainer>
  );
};

export default SideBar;
