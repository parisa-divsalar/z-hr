'use client';
import { useEffect, ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import Layout from '@/components/Layout';
import { PublicRoutes } from '@/config/routes';
import { useAuthSession } from '@/hooks/useAuthSession';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(PublicRoutes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>در حال بررسی ...</div>;
  }

  if (!isAuthenticated) return null;

  return <Layout>{children}</Layout>;
}
