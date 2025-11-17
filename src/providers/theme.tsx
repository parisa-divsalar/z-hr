'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

import { lightTheme, darkTheme } from '@/config/theme';
import { useThemeStore } from '@/store/common';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { mode, setMode } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const cacheRtl = createCache({
    key: 'mui-rtl',
  });

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
    <CacheProvider value={cacheRtl}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
};
