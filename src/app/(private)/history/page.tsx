'use client';
import { useRouter } from 'next/navigation';

import { PublicRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

const HistoryPage = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace(PublicRoutes.landing);
  };

  return <div style={{ padding: 24 }}>این یک متن تستی برای صفحه History است.</div>;
};

export default HistoryPage;
