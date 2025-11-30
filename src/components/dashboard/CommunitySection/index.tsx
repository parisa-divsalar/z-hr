import React from 'react';

import { Stack, Typography } from '@mui/material';

import HeadIcon from '@/assets/images/dashboard/comm.svg';
import InstaIcon from '@/assets/images/dashboard/insta.svg';
import TelIcon from '@/assets/images/dashboard/tel.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import {
  CommunityCardRoot,
  CommunityIconCircle,
  CommunityIconWrapper,
  SectionHeader,
} from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

const CommunityCard = ({ icon, title, subtitle }: { icon: 'tel' | 'insta'; title: string; subtitle: string }) => {
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
          View{' '}
        </MuiButton>

        <MuiButton color='secondary'>Join </MuiButton>
      </Stack>
    </CommunityCardRoot>
  );
};

const CommunitySection = () => {
  return (
    <Stack gap={2} mt={5}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Community
          </Typography>
        </Stack>
        <MuiButton text='more' color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
      </SectionHeader>
      <Stack gap={2}>
        <CommunityCard icon='tel' title='Front end channel!' subtitle='Telegram — 2,638 Members' />
        <CommunityCard icon='insta' title='Front end Instagram' subtitle='Instagram — 2,337 Followers' />
      </Stack>
    </Stack>
  );
};

export default CommunitySection;
