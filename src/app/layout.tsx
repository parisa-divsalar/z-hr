import { ReactNode, Suspense } from 'react';

import Loading from '@/app/loading';
import { interphasesFont, persianFont } from '@/config/fonts';
import { LocaleProvider } from '@/providers/LocaleProvider';
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

const localeDirScript = `
(function(){
  try {
    var raw = localStorage.getItem('locale');
    if (!raw) { document.documentElement.setAttribute('dir','ltr'); document.documentElement.setAttribute('lang','en'); return; }
    var data = JSON.parse(raw);
    var locale = data && data.state && data.state.locale;
    if (locale === 'fa') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'fa');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  } catch (e) {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${interphasesFont.variable} ${persianFont.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: localeDirScript }} />
        <Suspense fallback={<Loading />}>
          <LocaleProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
