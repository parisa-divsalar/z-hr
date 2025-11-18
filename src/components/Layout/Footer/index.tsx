'use client';
import { Stack, Typography } from '@mui/material';

import Instagram from '@/assets/images/icons/instagram.svg';
import SocialIcons from '@/assets/images/icons/social-icons.svg';
import SocialIcon from '@/assets/images/icons/social-in.svg';
import SocialZ from '@/assets/images/icons/social-z.svg';

import { VerticalDivider } from './styled';

const Footer = () => {
  return (
    <Stack justifyContent='space-between' width='100%' direction='row' py={3}>
      <Stack direction='row' gap={2}>
        <Typography variant='h5' color='text.primary' fontWeight='700'>
          Z-CV
        </Typography>
        <VerticalDivider orientation='vertical' />
        <Typography variant='subtitle1' color='text.secondry' fontWeight='400'>
          All rights reserved.
        </Typography>
        <Typography variant='subtitle1' color='text.secondry' fontWeight='400'>
          © 2025
        </Typography>
      </Stack>

      <Stack direction='row' gap={2}>
        <SocialIcon />
        <Instagram />
        <SocialIcons />
        <SocialZ />
      </Stack>
    </Stack>
  );
};

export default Footer;
