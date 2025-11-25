'use client';
import { useRouter } from 'next/navigation';

import { PublicRoutes } from '@/config/routes';
import DashboardModule from '@/modules/dashboard';
import { useAuthStore } from '@/store/auth';

const DashboardPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace(PublicRoutes.landing);
  };

  return <DashboardModule onLogout={handleLogout} />;
};

export default DashboardPage;
