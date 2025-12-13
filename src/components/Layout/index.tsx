'use client';
import { ReactNode } from 'react';

import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';

import Footer from '@/components/Layout/Footer';
import classes from '@/components/Layout/layout.module.css';
import Navbar from '@/components/Layout/Navbar';
import SideBar from '@/components/Layout/SideBar';
import AddToHomeScreen from '@/components/Other/AddToHomeScreen';
// import SplashScreen from '@/components/Other/SplashScreen';

const Layout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();

    const isHome = pathname === '/';

    return (
        <Stack className={classes.mainLayout}>
            <Stack className={classes.layoutContainer} bgcolor='background.default'>
                <Navbar />
                <Stack className={`${classes.childrenContainer} ${isHome ? classes.homeChildren : ''}`}>
                    <Stack direction='row' className={classes.childrenInner}>
                        <SideBar />
                        <Stack className={classes.children}>{children}</Stack>
                    </Stack>
                </Stack>
                <Footer />
            </Stack>

            {/*<SplashScreen />*/}

            <AddToHomeScreen />
        </Stack>
    );
};

export default Layout;
