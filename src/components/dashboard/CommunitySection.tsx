import { Telegram, Instagram } from '@mui/icons-material';
import { Stack } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

import {
  CardBase,
  DASHBOARD_COLORS,
  MetaText,
  SectionHeader,
  SectionTitle,
  BodyText,
} from './styled';

const CommunityCard = ({
  icon,
  title,
  subtitle,
}: {
  icon: 'telegram' | 'instagram';
  title: string;
  subtitle: string;
}) => {
  const IconComponent = icon === 'telegram' ? Telegram : Instagram;

  return (
    <CardBase
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Stack direction='row' gap={2} alignItems='center'>
        <Stack
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            backgroundColor: '#F0F0F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent sx={{ fontSize: 22, color: DASHBOARD_COLORS.darkText }} />
        </Stack>

        <Stack gap={0.25}>
          <BodyText sx={{ fontWeight: 600 }}>{title}</BodyText>
          <MetaText>{subtitle}</MetaText>
        </Stack>
      </Stack>

      <MuiButton
        size='small'
        variant='outlined'
        sx={{
          borderRadius: 999,
          textTransform: 'none',
        }}
      >
        Join
      </MuiButton>
    </CardBase>
  );
};

const CommunitySection = () => {
  return (
    <Stack gap={2}>
      <SectionHeader>
        <SectionTitle>Community</SectionTitle>
      </SectionHeader>

      <Stack gap={2}>
        <CommunityCard
          icon='telegram'
          title='Front end channel!'
          subtitle='Telegram — 2,638 Members'
        />
        <CommunityCard
          icon='instagram'
          title='Front end Instagram'
          subtitle='Instagram — 2,337 Followers'
        />
      </Stack>
    </Stack>
  );
};

export default CommunitySection;