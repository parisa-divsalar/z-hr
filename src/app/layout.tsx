import { ReactNode, Suspense } from 'react';

import Loading from '@/app/loading';
import { interphasesFont } from '@/config/fonts';
import { ThemeProvider } from '@/providers/theme';
import '@/config/configAxios';

import '@/assets/styles/globals.css';

export const metadata = {
  title: 'z-cv',
  description: 'description',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4D49FC',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' dir='ltr' className={`${interphasesFont.variable}`}>
      <body>
        <Suspense fallback={<Loading />}>
          <ThemeProvider>{children}</ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
