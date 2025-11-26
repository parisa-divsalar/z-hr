'use client';

import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { SectionCard } from './styled';

const HistoryEditeSection = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SectionCard>
          <Typography variant='h6' fontWeight='500' color='text.primary'>
            بخش اول
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            این متن تستی برای بخش اول است. در اینجا می‌توانید محتوای دلخواه خود را قرار دهید.
          </Typography>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SectionCard>
          <Typography variant='h6' fontWeight='500' color='text.primary'>
            بخش دوم
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            این متن تستی برای بخش دوم است. محتوای این بخش را می‌توانید به دلخواه تغییر دهید.
          </Typography>
        </SectionCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <SectionCard>
          <Typography variant='h6' fontWeight='500' color='text.primary'>
            بخش سوم
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            این متن تستی برای بخش سوم است. شما می‌توانید هر نوع کامپوننتی را در این بخش قرار دهید.
          </Typography>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default HistoryEditeSection;
