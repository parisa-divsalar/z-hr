'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

import { getDarkTheme, getLightTheme } from '@/config/theme';
import { useLocaleStore, useThemeStore } from '@/store/common';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useThemeStore();
  const locale = useLocaleStore((s) => s.locale);
  const [isMounted, setIsMounted] = useState(false);

  const direction = locale === 'fa' ? 'rtl' : 'ltr';
  const theme = useMemo(
    () => (mode === 'dark' ? getDarkTheme(direction) : getLightTheme(direction)),
    [mode, direction],
  );
  const cache = useMemo(
    () =>
      createCache({
        key: direction === 'rtl' ? 'mui-rtl' : 'mui-ltr',
        ...(direction === 'rtl' ? { rtl: true } : {}),
      }),
    [direction],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (ev: MediaQueryListEvent) => setMode(ev.matches ? 'dark' : 'light');

    colorSchemeQuery.addEventListener('change', handleChange);
    setIsMounted(true);

    return () => colorSchemeQuery.removeEventListener('change', handleChange);
  }, [setMode]);

  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
};
