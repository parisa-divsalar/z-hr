'use client';

import React, { ReactNode, useEffect, useMemo } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';

import { lightTheme, darkTheme } from '@/config/theme';
import { themeSelector } from '@/store/common/commonSelector';
import { setMode, ThemeMode } from '@/store/common/commonSlice';

const colorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

function getDefaultTheme(): ThemeMode {
  // return colorSchemeQuery?.matches ? 'dark' : 'light';
  return 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useSelector(themeSelector);
  const dispatch = useDispatch();

  const cacheRtl = createCache({
    key: 'mui-rtl',
    stylisPlugins: [rtlPlugin],
  });

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  useEffect(() => {
    dispatch(setMode(getDefaultTheme()));
    colorSchemeQuery.addEventListener('change', (ev) => dispatch(setMode(ev.matches ? 'dark' : 'light')));
  }, []);

  return (
    <CacheProvider value={cacheRtl}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
};
