'use client';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import Layout from '@/components/Layout';
import AnimateTransition from '@/providers/transition';

const STANDALONE_PUBLIC_ROUTES = new Set<string>(['/pricing']);

export default function PublicLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Some public pages are designed as standalone centered cards and should not be wrapped
  // with the global app Layout (navbar/sidebar/footer + max-width container).
  if (pathname && STANDALONE_PUBLIC_ROUTES.has(pathname)) {
    return <AnimateTransition>{children}</AnimateTransition>;
  }

  return (
    <Layout>
      <AnimateTransition>{children}</AnimateTransition>
    </Layout>
  );
}



