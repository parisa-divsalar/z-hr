import { IThemeMode } from '@/type/common';

export type Locale = 'fa' | 'en';

export interface useThemeStoreProps {
  mode: IThemeMode | null;
  setMode: (mode: IThemeMode) => void;
}

export interface useLocaleStoreProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export interface useInstallAppProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
