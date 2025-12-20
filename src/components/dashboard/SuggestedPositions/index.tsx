 'use client';

import { Stack, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import Box1Icon from '@/assets/images/dashboard/box1.svg';
import Box2Icon from '@/assets/images/dashboard/box2.svg';
import BoxIcon from '@/assets/images/dashboard/boxIcon.svg';
import Location from '@/assets/images/dashboard/location.svg';
import { SectionHeader, SectionJob, SuggestedJobCardItem } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

const SuggestedJobCard = () => {
  return (
    <SuggestedJobCardItem>
      <SectionJob bgcolor='gray.200'>
        <Typography variant='subtitle1' color='text.primary' fontWeight='400'>
          Front end Developer
        </Typography>
      </SectionJob>
      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} p={2}>
        <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
          09/09/2025 · Remote
        </Typography>
        <Stack direction='row'>
          <Location style={{ marginTop: 4 }} />
          <Typography variant='subtitle2' color='text.primary' fontWeight='400' pl={1}>
            Dubai
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: 'grey.100', marginX: '8px' }} />

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' px={2} pt={1}>
        Join a product-focused team to build modern, responsive web interfaces. You will work closely with designers and
        backend engineers to deliver pixel-perfect experiences and smooth user journeys.
      </Typography>

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' mt={1} px={2}>
        Tech stack: React, Next.js, TypeScript, TailwindCSS, REST APIs TypeScript, TailwindCSS, REST APIs
      </Typography>

      <Stack direction='row' gap={1} alignItems='center' px={2} mt={2}>
        <Box1Icon />
        <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
          98%{' '}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
          Fit with this Position
        </Typography>
      </Stack>
      <Stack direction='row' gap={1} alignItems='center' px={2} mt={2}>
        <Box2Icon />
        <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
          Zayd Al-Mansoori’s Resume
        </Typography>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} p={2}>
        <Stack direction='row' alignItems='center' justifyContent='center' ml={5}>
          <BoxIcon />
        </Stack>

        <MuiButton text='Apply' size='medium' color='secondary' sx={{ width: 247 }} />
      </Stack>
    </SuggestedJobCardItem>
  );
};

const SuggestedPositions = () => {
  const router = useRouter();

  const navigateToHistory = () => {
    router.push('/history');
  };
  return (
    <Stack gap={2} mt={5}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <Box2Icon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Suggested Positions
          </Typography>
        </Stack>
        <MuiButton
          text='more'
          color='secondary'
          variant='text'
          endIcon={<ArrowRightIcon />}
          onClick={navigateToHistory}
        />
      </SectionHeader>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SuggestedJobCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SuggestedJobCard />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SuggestedPositions;
