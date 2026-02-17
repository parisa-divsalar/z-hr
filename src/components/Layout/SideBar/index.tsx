'use client';
import { useState } from 'react';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { List, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import LogoutDialog from '@/components/Layout/SideBar/LogoutDialog';
import { sidebarMenuItems, isSidebarMenuItemActive } from '@/components/Layout/SideBar/menu';
import { ItemButton, SidebarContainer, ItemIcon, SidebarItemText } from '@/components/Layout/SideBar/styled';
import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { isSidebarVisible, PrivateRoutes } from '@/config/routes';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';
import { useAuthStore } from '@/store/auth';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [lockedDialogFeature, setLockedDialogFeature] = useState<string>('this feature');

  const handleConfirmLogout = async () => {
    await logout();
    setOpenLogoutDialog(false);
  };

  const isSideBarVisible = isSidebarVisible(pathname);

  if (!isSideBarVisible || isMobile) return null;

  const enabled = new Set((access?.enabledKeys ?? []).filter(Boolean));
  const isRouteLocked = (route: string): { locked: boolean; label?: string } => {
    // Avoid flashing "locked" while access is still loading.
    if (isAccessLoading) return { locked: false };
    // Lock specific dashboard areas based on MoreFeatures selection.
    // (These keys are derived from pricing `feature_name` via `featureKeyFromTitle`.)
    if (route === PrivateRoutes.learningHub) {
      return { locked: !enabled.has('learning_hub'), label: 'Learning Hub' };
    }
    if (route === PrivateRoutes.interView || route === PrivateRoutes.chatInterView || route === PrivateRoutes.voiceInterView) {
      const ok = enabled.has('question_interview') || enabled.has('voice_interview');
      return { locked: !ok, label: 'Interview' };
    }
    return { locked: false };
  };

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
            const lock = isRouteLocked(item.route);
            const locked = lock.locked;

            return (
              <ItemButton
                key={item.route}
                active={isActive}
                locked={locked}
                aria-disabled={locked}
                onClick={() => {
                  if (locked) {
                    setLockedDialogFeature(lock.label || item.label);
                    setLockedDialogOpen(true);
                    return;
                  }
                  router.push(item.route);
                }}
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

      <PlanRequiredDialog
        open={lockedDialogOpen}
        onClose={() => setLockedDialogOpen(false)}
        title='Feature locked'
        headline={`"${lockedDialogFeature}" is disabled for your account.`}
        bodyText='Enable it in More Features (Step 3) to unlock it for your dashboard.'
        primaryLabel='Enable in More Features'
        primaryHref='/resume-builder?step=3'
      />
    </SidebarContainer>
  );
};

export default SideBar;
