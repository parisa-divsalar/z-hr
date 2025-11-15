import React, { ReactNode, Suspense } from 'react';

import Loading from '@/app/loading';
import Layout from '@/components/Layout';
import { yekanBakh } from '@/config/fonts';
import { ReduxProvider } from '@/providers/redux';
import { ThemeProvider } from '@/providers/theme';
import '@/config/configAxios';

import '@/assets/styles/globals.css';

export const metadata = {
  title: 'NextJs',
  description: 'description',
  themeColor: '#028386',
  icons: {
    icon: '/icons/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='fa' dir='rtl' className={`${yekanBakh.variable}`}>
      <body>
        <ReduxProvider>
          <Suspense fallback={<Loading />}>
            <ThemeProvider>
              <Layout>{children}</Layout>
            </ThemeProvider>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
