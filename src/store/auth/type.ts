export type TStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface useAuthStoreProps {
  accessToken: string | null;
  refreshToken: string | null;
  status: TStatus;
  loginStart: () => void;
  loginFailure: () => void;
  loginSuccess: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}
