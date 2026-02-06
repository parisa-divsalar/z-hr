'use client';

import { Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        component='img'
        src='/_designs/2.svg'
        alt='Dashboard design'
        sx={{
          width: '100%',
          maxWidth: '894px',
          height: 'auto',
          display: 'block',
        }}
      />
    </Box>
  );
};

export default DashboardPage;
