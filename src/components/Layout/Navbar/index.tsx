'use client';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { CardActionArea, IconButton, Stack, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import logo from '@/assets/images/nextjs.png';
import { AppImage } from '@/components/AppImage';
import classes from '@/components/Layout/layout.module.css';
import MuiButton from '@/components/UI/MuiButton';
import { typeMappingHandler } from '@/constant/keysMapping';
import { useThemeStore } from '@/store/common';

const Navbar = () => {
  const router = useRouter();
  const { mode, setMode } = useThemeStore();
  const pathname = usePathname();

  const title = typeMappingHandler(pathname)?.title || '';
  const subTitle = typeMappingHandler(pathname)?.subTitle || '';

  if (pathname === '/')
    return (
      <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
        <AppImage src={logo} width={100} height={40} />
        <MuiButton variant='outlined'>Login/Register</MuiButton>
      </Stack>
    );

  return (
    <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
      <IconButton disabled color='inherit' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
        {mode === 'dark' ? <Brightness7 fontSize='small' /> : <Brightness4 fontSize='small' />}
      </IconButton>

      <Stack direction='row' gap={1}>
        <CardActionArea className='cardActionArea' onClick={() => router.back()}>
          <Stack className={classes.backContainer} borderColor='divider'>
            <ArrowForwardRoundedIcon />
          </Stack>
        </CardActionArea>

        <Stack>
          <Typography variant='subtitle2' fontWeight='600' color='text.primary'>
            {title}
          </Typography>
          <Typography variant='caption' color='text.secondary' mt={0.25}>
            {subTitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Navbar;
