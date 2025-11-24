'use client';
import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';

import { VisibilitySideBar } from '@/config/routes';

const SideBar = () => {
  const pathname = usePathname();

  if (!VisibilitySideBar.includes(pathname)) return null;

  return (
    <Stack width='282px' bgcolor='#222' height='100%'>
      SideBar
    </Stack>
  );
};

export default SideBar;
