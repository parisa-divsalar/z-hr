import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  useInstallAppProps,
  useLocaleStoreProps,
  useThemeStoreProps,
} from '@/store/common/type';

export type { Locale } from '@/store/common/type';
import { IThemeMode } from '@/type/common';

export const useThemeStore = create<useThemeStoreProps>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (mode: IThemeMode) => set({ mode }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useLocaleStore = create<useLocaleStoreProps>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale: useLocaleStoreProps['locale']) => set({ locale }),
    }),
    {
      name: 'locale',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useInstallApp = create<useInstallAppProps>()(
  persist(
    (set) => ({
      open: false,
      setOpen: (open: boolean) => set({ open }),
    }),
    {
      name: 'installApp',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
