'use client';

import { ReactNode, useEffect } from 'react';

import { useLocaleStore } from '@/store/common';

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    const root = document.documentElement;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const lang = locale === 'fa' ? 'fa' : 'en';
    root.setAttribute('dir', dir);
    root.setAttribute('lang', lang);
  }, [locale]);

  return <>{children}</>;
};
