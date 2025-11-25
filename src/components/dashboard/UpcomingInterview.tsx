import { AccessTime, PlayArrow } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import MuiAvatar from '@/components/UI/MuiAvatar';
import MuiButton from '@/components/UI/MuiButton';

import {
  CardBase,
  DASHBOARD_COLORS,
  MetaText,
  OrangeBadge,
  SectionHeader,
  SectionTitle,
  TagPill,
  AvatarGlowWrapper,
  AvatarGlow,
  AvatarInnerWrapper,
} from './styled';

const UpcomingInterview = () => {
  return (
    <CardBase
      sx={{
        borderRadius: 20,
        border: `1px solid ${DASHBOARD_COLORS.orangeTag}`,
        padding: 22,
      }}
    >
      <SectionHeader sx={{ mb: 10 }}>
        <SectionTitle>Interview</SectionTitle>
        <OrangeBadge>Upcoming</OrangeBadge>
      </SectionHeader>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent='space-between'
        gap={3}
      >
        <Stack gap={1.5}>
          <Stack direction='row' gap={1.5} alignItems='center'>
            <TagPill>Chat Interview</TagPill>
            <MetaText>09/09/2025</MetaText>
          </Stack>

          <Stack direction='row' gap={1.5} alignItems='center'>
            <Stack direction='row' gap={1} alignItems='center'>
              <OrangeBadge
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  backgroundColor: '#FFE4CC',
                  color: DASHBOARD_COLORS.darkText,
                }}
              >
                <AccessTime sx={{ fontSize: 14 }} />
                <Typography component='span' sx={{ fontSize: 11, fontWeight: 600 }}>
                  2 / 9
                </Typography>
              </OrangeBadge>
              <MetaText>steps completed</MetaText>
            </Stack>

            <MetaText>7 steps left</MetaText>
          </Stack>

          <MetaText>
            Continue where you left off and complete the practice interview session.
          </MetaText>

          <MuiButton
            size='small'
            text='Continue'
            endIcon={<PlayArrow />}
            sx={{
              mt: 1,
              borderRadius: 999,
              paddingInline: 2.5,
            }}
          />
        </Stack>

        <AvatarGlowWrapper>
          <AvatarGlow />
          <AvatarInnerWrapper>
            <MuiAvatar
              size='large'
              color='primary'
              sx={{ border: `2px solid ${DASHBOARD_COLORS.cardBackground}` }}
            >
              AI
            </MuiAvatar>
          </AvatarInnerWrapper>
        </AvatarGlowWrapper>
      </Stack>
    </CardBase>
  );
};

export default UpcomingInterview;


