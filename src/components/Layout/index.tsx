import { ReactNode } from 'react';

import { Stack } from '@mui/material';

import Footer from '@/components/Layout/Footer';
// @ts-ignore
import classes from '@/components/Layout/layout.module.css';
import Navbar from '@/components/Layout/Navbar';
import SideBar from '@/components/Layout/SideBar';
import AddToHomeScreen from '@/components/Other/AddToHomeScreen';
// import SplashScreen from '@/components/Other/SplashScreen';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack className={classes.mainLayout}>
      <Stack className={classes.layoutContainer} bgcolor='background.default'>
        <Navbar />
        <Stack direction='row' flex={1} overflow='hidden'>
          <SideBar />
          <Stack className={classes.childrenContainer}>{children}</Stack>
        </Stack>
        <Footer />
      </Stack>

      {/*<SplashScreen />*/}

      <AddToHomeScreen />
    </Stack>
  );
};

export default Layout;
