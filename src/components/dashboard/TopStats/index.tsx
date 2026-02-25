'use client';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import Frame1Icon from '@/assets/images/dashboard/Frame1.svg';
import Frame2Icon from '@/assets/images/dashboard/Frame2.svg';
import Frame3Icon from '@/assets/images/dashboard/Frame3.svg';
import { SmallCardBase, StatValueRow } from '@/components/dashboard/styled';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

type TopStatsProps = {
  cvsCount: number;
  shouldShowResumesCreatedCard: boolean;
  creditsRemaining?: number;
  interviewPractices?: number;
};

export default function TopStats({
  cvsCount,
  shouldShowResumesCreatedCard,
  creditsRemaining = 0,
  interviewPractices = 0,
}: TopStatsProps) {
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).dashboard as Record<string, string>;
  const mdColSize = shouldShowResumesCreatedCard ? 4 : 6;

  return (
    <Grid container spacing={3} width='100%'>
      <Grid size={{ xs: 12, md: mdColSize }}>
        <SmallCardBase>
          <StatValueRow>
            <Frame1Icon />
            <Stack direction='column' spacing={0.5} ml={1}>
              <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                {t.creditsRemaining ?? 'Credits Remaining'}
              </Typography>
              <Typography variant='h5' fontWeight='500' color='text.primary'>
                {creditsRemaining}
              </Typography>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>

      {shouldShowResumesCreatedCard && (
        <Grid size={{ xs: 12, md: 4 }}>
          <SmallCardBase>
            <StatValueRow>
              <Frame2Icon />
              <Stack direction='column' spacing={0.5} ml={1}>
                <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                  {t.resumesCreated ?? 'Resumes Created'}
                </Typography>
                <Typography variant='h5' fontWeight='500' color='text.primary'>
                  {cvsCount}
                </Typography>
              </Stack>
            </StatValueRow>
          </SmallCardBase>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: mdColSize }}>
        <SmallCardBase>
          <StatValueRow>
            <Frame3Icon />
            <Stack direction='column' spacing={0.5} ml={1}>
              <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                {t.interviewPractices ?? 'Interview Practices'}
              </Typography>
              <StatValueRow>
                <Typography variant='h5' fontWeight='500' color='text.primary'>
                  {interviewPractices}
                </Typography>
              </StatValueRow>
            </Stack>
          </StatValueRow>
        </SmallCardBase>
      </Grid>
    </Grid>
  );
}
