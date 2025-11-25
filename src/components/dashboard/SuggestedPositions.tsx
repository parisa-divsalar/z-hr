import { Stack, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import MuiAvatar from '@/components/UI/MuiAvatar';
import MuiButton from '@/components/UI/MuiButton';

import {
  CardBase,
  DASHBOARD_COLORS,
  GreenDot,
  JobTitle,
  MetaText,
  SectionHeader,
  SectionTitle,
  BodyText,
  SubText,
  AvatarGlowWrapper,
  AvatarGlow,
  AvatarInnerWrapper,
} from './styled';

const SuggestedJobCard = () => {
  return (
    <CardBase
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <MetaText>09/09/2025 · Remote · Dubai</MetaText>

      <JobTitle>Front end Developer</JobTitle>

      <BodyText>
        Join a product-focused team to build modern, responsive web interfaces. You will work closely with designers and
        backend engineers to deliver pixel-perfect experiences and smooth user journeys.
      </BodyText>

      <SubText sx={{ mt: 0.5 }}>Tech stack: React, Next.js, TypeScript, TailwindCSS, REST APIs</SubText>

      <Stack direction='row' gap={1} alignItems='center' mt={1}>
        <GreenDot />
        <SubText sx={{ fontWeight: 600 }}>99% Fit with this Position</SubText>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={2}>
        <Stack direction='row' gap={1.5}>
          <MuiButton
            variant='outlined'
            size='small'
            sx={{
              borderRadius: 999,
              borderColor: '#000',
              color: DASHBOARD_COLORS.darkText,
              textTransform: 'none',
            }}
          >
            Zayd Al-Mansoori&apos;s Resume
          </MuiButton>

          <MuiButton
            size='small'
            sx={{
              borderRadius: 999,
              backgroundColor: '#000',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#111',
              },
            }}
          >
            Apply
          </MuiButton>
        </Stack>

        <AvatarGlowWrapper>
          <AvatarGlow />
          <AvatarInnerWrapper>
            <MuiAvatar size='small' color='primary' sx={{ border: `2px solid ${DASHBOARD_COLORS.cardBackground}` }}>
              Z
            </MuiAvatar>
          </AvatarInnerWrapper>
        </AvatarGlowWrapper>
      </Stack>
    </CardBase>
  );
};

const SuggestedPositions = () => {
  return (
    <Stack gap={2}>
      <SectionHeader>
        <SectionTitle>Suggested Positions</SectionTitle>
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
