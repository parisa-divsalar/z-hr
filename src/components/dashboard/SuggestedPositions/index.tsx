import { Stack, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';

import Box1Icon from '@/assets/images/dashboard/box1.svg';
import Box2Icon from '@/assets/images/dashboard/box2.svg';
import BoxIcon from '@/assets/images/dashboard/boxIcon.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import { SectionHeader, SubText, SuggestedJobCardItem } from '@/components/Dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

const SuggestedJobCard = () => {
  return (
    <SuggestedJobCardItem>
      <Typography variant='h6' color='text.primary' fontWeight='400'>
        Front end Developer
      </Typography>

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' p={2}>
        09/09/2025 · Remote · Dubai
      </Typography>

      <Divider sx={{ borderColor: 'grey.100', marginX: '10px' }} />

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' px={2}>
        Join a product-focused team to build modern, responsive web interfaces. You will work closely with designers and
        backend engineers to deliver pixel-perfect experiences and smooth user journeys.
      </Typography>

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' px={2}>
        Tech stack: React, Next.js, TypeScript, TailwindCSS, REST APIs TypeScript, TailwindCSS, REST APIs
      </Typography>

      <Stack direction='row' gap={1} alignItems='center' px={2} mt={1}>
        <Box1Icon />
        <SubText sx={{ fontWeight: 600 }}>98% Fit with this Position</SubText>
      </Stack>
      <Stack direction='row' gap={1} alignItems='center' px={2} mt={1}>
        <Box2Icon />
        <SubText sx={{ fontWeight: 600 }}>Zayd Al-Mansoori’s Resume</SubText>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} p={2}>
        <Stack direction='row' gap={1.5}>
          <BoxIcon />
        </Stack>

        <MuiButton text='Apply' color='secondary' />
      </Stack>
    </SuggestedJobCardItem>
  );
};

const SuggestedPositions = () => {
  return (
    <Stack gap={2} mt={5}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <Box2Icon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Suggested Positions
          </Typography>
        </Stack>
        <MuiButton text='more' color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
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
