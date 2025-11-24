'use client';
import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const DashboardPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace(PublicRoutes.landing);
  };

  return (
    <Stack height='100%' bgcolor='red' width='100%'>
      <MuiButton onClick={handleLogout} color='error'>
        خروج
      </MuiButton>
    </Stack>
  );
};

export default DashboardPage;
