'use client';

import React from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import HeadIcon from '@/assets/images/dashboard/comm.svg';
import InstaIcon from '@/assets/images/dashboard/insta.svg';
import TelIcon from '@/assets/images/dashboard/tel.svg';
import {
  CommunityCardRoot,
  CommunityIconCircle,
  CommunityIconWrapper,
  SectionHeader,
} from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

const CommunityCard = ({ icon, title, subtitle, viewLabel, joinLabel }: { icon: 'tel' | 'insta'; title: string; subtitle: string; viewLabel: string; joinLabel: string }) => {
  const IconComponent = icon === 'tel' ? TelIcon : InstaIcon;

  return (
    <CommunityCardRoot>
      <Stack direction='row' gap={2} alignItems='center'>
        <CommunityIconCircle>
          <CommunityIconWrapper>
            <IconComponent />
          </CommunityIconWrapper>
        </CommunityIconCircle>

        <Stack gap={0.25}>
          <Typography variant='body1' fontWeight='400' color='text.primary'>
            {title}
          </Typography>
          <Typography variant='subtitle2' fontWeight='400' color='text.secondary' mt={1}>
            {subtitle}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction='row' spacing={2} justifyContent='center'>
        <MuiButton color='secondary' variant='text'>
          {viewLabel}
        </MuiButton>

        <MuiButton color='secondary'>{joinLabel}</MuiButton>
      </Stack>
    </CommunityCardRoot>
  );
};

const CommunitySection = () => {
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).dashboard as Record<string, string>;

  return (
    <Stack gap={2}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            {t.community ?? 'Community'}
          </Typography>
        </Stack>
        <MuiButton text={t.more ?? 'More'} color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
      </SectionHeader>
      <Stack gap={2}>
        <CommunityCard icon='tel' title='Front end channel!' subtitle='Telegram — 2,638 Members' viewLabel={t.view ?? 'View'} joinLabel={t.join ?? 'Join'} />
        <CommunityCard icon='insta' title='Front end Instagram' subtitle='Instagram — 2,337 Followers' viewLabel={t.view ?? 'View'} joinLabel={t.join ?? 'Join'} />
      </Stack>
    </Stack>
  );
};

export default CommunitySection;
