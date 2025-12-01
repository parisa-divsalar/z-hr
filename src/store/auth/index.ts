import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAuthStoreProps } from '@/store/auth/type';

export const useAuthStore = create<useAuthStoreProps>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      loginStart: () => set({ status: 'loading' }),
      loginFailure: () => set({ status: 'unauthenticated' }),
      loginSuccess: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken: refreshToken, status: 'authenticated' }),
      logout: () => {
        set({ accessToken: null, refreshToken: null, status: 'unauthenticated' });
        localStorage.removeItem('auth');
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
