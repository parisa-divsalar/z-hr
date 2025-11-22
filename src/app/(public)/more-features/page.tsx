'use client';

import { Typography, Grid } from '@mui/material';

const MoreFeaturesPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
      </Grid>

      <Grid size={{ xs: 6 }}>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MoreFeaturesPage;
