'use client';

import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import PreviewEdite from './PreviewEdite';
import { HistoryEditeRoot, SectionCard } from './styled';

const HistoryEdite = () => {
  return (
    <HistoryEditeRoot>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <PreviewEdite />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <SectionCard>
            <Typography variant='h6' fontWeight='500' color='text.primary'>
              بخش دوم
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              این متن تستی برای بخش دوم است. محتوای این بخش را می‌توانید به دلخواه تغییر دهید.
            </Typography>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
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
    </HistoryEditeRoot>
  );
};

export default HistoryEdite;
