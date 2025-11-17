import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useInstallAppProps, useThemeStoreProps } from '@/store/common/type';
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
