'use client';

import { Box, Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import HeadIcon from '@/assets/images/dashboard/head.svg';
import VideoIcon from '@/assets/images/dashboard/video.svg';
import { SectionHeader } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

const InterviewSection = () => {
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).dashboard as Record<string, string>;

  return (
    <Stack gap={2}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            {t.interview ?? 'Interview'}
          </Typography>
        </Stack>
        <MuiButton text={t.more ?? 'More'} color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
      </SectionHeader>

      <Box
        sx={{
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.grey[100]}`,
          boxShadow: 1,
          bgcolor: '#fff',
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent='space-between'
          gap={{ xs: 2, sm: 3 }}
        >
          <Stack direction='row' gap={2} alignItems='center' sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: 2,
                bgcolor: '#F7F7F7',
                display: 'grid',
                placeItems: 'center',
                flex: '0 0 auto',
              }}
            >
              <VideoIcon />
            </Box>

            <Stack gap={0.75} sx={{ minWidth: 0 }}>
              <Typography
                variant='subtitle1'
                color='text.primary'
                fontWeight='500'
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {t.prepareFirstInterview ?? 'Prepare for Your First Interview'}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {t.interviewMeta ?? '20 Questions • 5 mins'}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction='row'
            spacing={2}
            alignItems='center'
            justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          >
            <MuiButton
              text={t.help ?? 'Help'}
              color='secondary'
              variant='text'
              sx={{ minWidth: 'auto', px: 1, textTransform: 'none' }}
            />
            <MuiButton text={t.start ?? 'Start'} color='secondary' sx={{ borderRadius: 2, px: 3, minWidth: 100, height: 40 }} />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default InterviewSection;


