'use client';
import { useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import Layout from '@/components/Layout';
import { PublicRoutes } from '@/config/routes';
import { useAuthStore } from '@/store/auth';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { accessToken, status } = useAuthStore();

  useEffect(() => {
    if (!accessToken && status !== 'loading') {
      router.replace(PublicRoutes.login);
    }
  }, [accessToken, status, router]);

  if (status == 'loading') {
    return <div style={{ padding: 40, textAlign: 'center' }}>در حال بررسی ...</div>;
  }

  if (!accessToken) return null;

  return <Layout isAuth={!!accessToken}>{children}</Layout>;
}
