'use client';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { List, ListItemText, Stack, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import DashboardRoundedIcon from '@/assets/images/menu/Icon1.svg';
import ArticleRoundedIcon from '@/assets/images/menu/Icon2.svg';
import HistoryRoundedIcon from '@/assets/images/menu/Icon3.svg';
import CreditCardRoundedIcon from '@/assets/images/menu/Icon4.svg';
import SchoolRoundedIcon from '@/assets/images/menu/Icon5.svg';
import SettingsRoundedIcon from '@/assets/images/menu/Icon6.svg';
import HeadphonesRoundedIcon from '@/assets/images/menu/Icon7.svg';
import MicRoundedIcon from '@/assets/images/menu/Icon8.svg';
import { ItemButton, SidebarContainer, ItemIcon } from '@/components/Layout/SideBar/styled';
import { PrivateRoutes, PublicRoutes, VisibilitySideBar } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace(PublicRoutes.landing);
  };

  if (!VisibilitySideBar.includes(pathname)) return null;

  return (
    <SidebarContainer>
      <Stack>
        <Typography color='grey.300' variant='caption' px={3} pt={3}>
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
            <ListItemText primary='Dashboard' />

            {pathname === PrivateRoutes.dashboard && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.resumeBuilder}
            onClick={() => router.push(PrivateRoutes.resumeBuilder)}
          >
            <ItemIcon>
              <ArticleRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Resume Builder' />

            {pathname === PrivateRoutes.resumeBuilder && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.history} onClick={() => router.push(PrivateRoutes.history)}>
            <ItemIcon>
              <HistoryRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='History' />
            {pathname === PrivateRoutes.history && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.payment} onClick={() => router.push(PrivateRoutes.payment)}>
            <ItemIcon>
              <CreditCardRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Payment' />
            {pathname === PrivateRoutes.payment && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.learningHub}
            onClick={() => router.push(PrivateRoutes.learningHub)}
          >
            <ItemIcon>
              <SchoolRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Learning Hub' />

            {pathname === PrivateRoutes.learningHub && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton
            active={pathname === PrivateRoutes.interView}
            onClick={() => router.push(PrivateRoutes.interView)}
          >
            <ItemIcon>
              <MicRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Interview' />
            {pathname === PrivateRoutes.interView && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.setting} onClick={() => router.push(PrivateRoutes.setting)}>
            <ItemIcon>
              <SettingsRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Setting' />
            {pathname === PrivateRoutes.setting && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>

          <ItemButton active={pathname === PrivateRoutes.support} onClick={() => router.push(PrivateRoutes.support)}>
            <ItemIcon>
              <HeadphonesRoundedIcon fontSize='small' />
            </ItemIcon>
            <ListItemText primary='Support' />
            {pathname === PrivateRoutes.support && <KeyboardArrowRightRoundedIcon />}
          </ItemButton>
        </List>
      </Stack>

      <Stack>
        <ItemButton onClick={handleLogout}>
          <ListItemText primary='Log out' sx={{ color: '#F77A79' }} />

          <LogoutRoundedIcon sx={{ color: '#F77A79' }} fontSize='small' />
        </ItemButton>

        <Typography color='grey.300' variant='caption' px={3} pb={3}>
          Version 1.3.23
        </Typography>
      </Stack>
    </SidebarContainer>
  );
};

export default SideBar;
