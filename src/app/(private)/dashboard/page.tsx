'use client';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const DashboardPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace(PublicRoutes.login);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Welcome 👋</h2>
      <MuiButton onClick={handleLogout} color='error'>
        خروج
      </MuiButton>
    </div>
  );
};

export default DashboardPage;
