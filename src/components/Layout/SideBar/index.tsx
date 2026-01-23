'use client';
import { useState } from 'react';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { List, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import LogoutDialog from '@/components/Layout/SideBar/LogoutDialog';
import { sidebarMenuItems, isSidebarMenuItemActive } from '@/components/Layout/SideBar/menu';
import { ItemButton, SidebarContainer, ItemIcon, SidebarItemText } from '@/components/Layout/SideBar/styled';
import { isSidebarVisible } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleConfirmLogout = async () => {
    await logout();
    setOpenLogoutDialog(false);
  };

  const isSideBarVisible = isSidebarVisible(pathname);

  if (!isSideBarVisible || isMobile) return null;

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
          {sidebarMenuItems.map((item) => {
            const isActive = isSidebarMenuItemActive(item, pathname);
            const MenuIcon = item.icon;

            return (
              <ItemButton
                key={item.route}
                active={isActive}
                onClick={() => router.push(item.route)}
              >
                <ItemIcon>
                  <MenuIcon />
                </ItemIcon>
                <SidebarItemText primary={item.label} />

                {isActive && (
                  <KeyboardArrowRightRoundedIcon
                    sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                  />
                )}
              </ItemButton>
            );
          })}
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
