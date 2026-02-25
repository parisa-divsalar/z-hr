'use client';

import { Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import ResumeIcon from '@/assets/images/dashboard/resume.svg';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

export default function CreditsDepletedBanner() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).dashboard as Record<string, string>;

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        border: `1px solid ${theme.palette.error.light}`,
        backgroundColor: theme.palette.error.contrastText,
        boxShadow: theme.shadows[0],
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.25, sm: 1.5 },
      })}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 1.25, sm: 2 }}
      >
        <Stack direction='row' gap={1.25} alignItems='center' sx={{ minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 42,
              height: 42,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[50],
              border: `1px solid ${theme.palette.grey[100]}`,
              flex: '0 0 auto',
              '& svg': { width: 22, height: 22 },
            })}
          >
            <ResumeIcon />
          </Box>

          <Stack gap={0.25} sx={{ minWidth: 0 }}>
            <Typography variant='subtitle2' color='text.primary' fontWeight={500} noWrap>
              {t.creditsDepletedTitle ?? 'Looks like your current credits have wrapped up!'}
            </Typography>
            <Typography variant='body2' color='text.secondary' fontWeight={400} sx={{ whiteSpace: 'nowrap' }}>
              {t.creditsDepletedDesc ?? 'Recharge now to continue your resume.'}
            </Typography>
          </Stack>
        </Stack>

        <MuiButton
          text={t.seeOurPlans ?? 'See Our Plans'}
          color='secondary'
          sx={{
            height: 36,
            px: 2.25,
            borderRadius: 2,
            alignSelf: { xs: 'stretch', sm: 'center' },
            minWidth: { xs: '100%', sm: 140 },
            flex: '0 0 auto',
          }}
          onClick={() => router.push(PublicRoutes.pricing)}
        />
      </Stack>
    </Box>
  );
}



