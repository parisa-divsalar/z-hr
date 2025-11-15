import React from 'react';

import { Stack } from '@mui/material';

import classes from './layout.module.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack className={classes.mainLayout}>
      <Stack className={classes.layoutContainer} bgcolor='background.default'>
        <Stack className={classes.childrenContainer}>{children}</Stack>
      </Stack>
    </Stack>
  );
};

export default Layout;
