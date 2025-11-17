import { ReactNode } from 'react';

import Layout from '@/components/Layout';
import AnimateTransition from '@/providers/transition';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <AnimateTransition>{children}</AnimateTransition>
    </Layout>
  );
}
