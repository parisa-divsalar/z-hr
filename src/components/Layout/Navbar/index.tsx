'use client';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { CardActionArea, Stack, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import classes from '@/components/Layout/layout.module.css';
import MuiButton from '@/components/UI/MuiButton';
import { typeMappingHandler } from '@/constant/keysMapping';

const Navbar = () => {
  const router = useRouter();

  const pathname = usePathname();

  const title = typeMappingHandler(pathname)?.title || '';
  const subTitle = typeMappingHandler(pathname)?.subTitle || '';

  if (pathname === '/')
    return (
      <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
        <AppImage src={logo} width={48} height={48} />
        <MuiButton variant='outlined'>Login/Signup</MuiButton>
      </Stack>
    );

  return (
    <Stack direction='row' className={classes.mainNavbar} borderColor='divider'>
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
