import { ReactNode } from 'react';

import PublicLayoutShell from '@/app/(public)/public-layout-shell';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}
