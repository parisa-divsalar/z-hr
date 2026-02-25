'use client';
import { useState } from 'react';

import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
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
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import { useAuthStore } from '@/store/auth';

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const theme = useTheme();
  const locale = useLocaleStore((s) => s.locale);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { access, isLoading: isAccessLoading } = useMoreFeaturesAccess({ enabled: true });
  const sidebarT = getMainTranslations(locale).sidebar as Record<string, string>;
  const isRtl = locale === 'fa';

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
      return { locked: !enabled.has('learning_hub'), label: sidebarT.learningHub ?? 'Learning Hub' };
    }
    if (route === PrivateRoutes.interView || route === PrivateRoutes.chatInterView || route === PrivateRoutes.voiceInterView) {
      const ok = enabled.has('question_interview') || enabled.has('text_interview') || enabled.has('voice_interview');
      return { locked: !ok, label: sidebarT.interview ?? 'Interview' };
    }
    return { locked: false };
  };

  const dashboardT = getMainTranslations(locale).dashboard as Record<string, string>;

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
          {sidebarT.menu ?? 'Menu'}
        </Typography>
        <List>
          {sidebarMenuItems.map((item) => {
            const isActive = isSidebarMenuItemActive(item, pathname);
            const MenuIcon = item.icon;
            const lock = isRouteLocked(item.route);
            const locked = lock.locked;
            const label = sidebarT[item.translationKey] ?? item.label;

            return (
              <ItemButton
                key={item.route}
                active={isActive}
                locked={locked}
                aria-disabled={locked}
                onClick={() => {
                  if (locked) {
                    setLockedDialogFeature(lock.label || label);
                    setLockedDialogOpen(true);
                    return;
                  }
                  router.push(item.route);
                }}
              >
                <ItemIcon>
                  <MenuIcon />
                </ItemIcon>
                <SidebarItemText primary={label} />

                {isActive &&
                  (isRtl ? (
                    <KeyboardArrowLeftRoundedIcon
                      sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                    />
                  ) : (
                    <KeyboardArrowRightRoundedIcon
                      sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                    />
                  ))}
              </ItemButton>
            );
          })}
        </List>
      </Stack>

      <Stack>
        <ItemButton onClick={() => setOpenLogoutDialog(true)}>
          <SidebarItemText primary={sidebarT.logOut ?? 'Log out'} sx={{ color: '#F77A79' }} />

          <LogoutRoundedIcon sx={{ color: '#F77A79' }} fontSize='small' />
        </ItemButton>

        <Typography
          color='grey.300'
          variant='caption'
          px={3}
          pb={3}
          sx={{ display: { xs: 'none', md: 'block' } }}
        >
          {sidebarT.version ?? 'Version'} 1.3.23
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
        title={dashboardT.featureLocked ?? 'Feature locked'}
        headline={(dashboardT.featureLockedHeadline ?? '"{{name}}" is disabled for your account.').replace('{{name}}', lockedDialogFeature)}
        bodyText={dashboardT.featureLockedBody ?? 'Enable it in More Features (Step 3) to unlock it for your dashboard.'}
        primaryLabel={dashboardT.enableInMoreFeatures ?? 'Enable in More Features'}
        primaryHref='/resume-builder?step=3'
      />
    </SidebarContainer>
  );
};

export default SideBar;
