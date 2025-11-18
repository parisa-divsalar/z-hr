import { ReactNode } from 'react';

import { Stack } from '@mui/material';

import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import AddToHomeScreen from '@/components/Other/AddToHomeScreen';
import SplashScreen from '@/components/Other/SplashScreen';

import classes from './layout.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack className={classes.mainLayout}>
      <Stack className={classes.layoutContainer} bgcolor='background.default'>
        <Navbar />
        <Stack className={classes.childrenContainer}>{children}</Stack>
        <Footer />
      </Stack>

      <SplashScreen />

      <AddToHomeScreen />
    </Stack>
  );
};

export default Layout;
