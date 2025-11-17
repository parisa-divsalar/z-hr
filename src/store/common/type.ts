import { IThemeMode } from '@/type/common';

export interface useThemeStoreProps {
  mode: IThemeMode | null;
  setMode: (mode: IThemeMode) => void;
}

export interface useInstallAppProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
