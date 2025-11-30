'use client';
import { Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

import Instagram from '@/assets/images/icons/instagram.svg';
import SocialIcons from '@/assets/images/icons/social-icons.svg';
import SocialIcon from '@/assets/images/icons/social-in.svg';
import SocialZ from '@/assets/images/icons/social-z.svg';
import { MainFooterContainer, VerticalDivider, MainFooterContent } from '@/components/Layout/Footer/styled';
import { VisibilityLayout } from '@/config/routes';

const Footer = () => {
  const pathname = usePathname();

  if (!VisibilityLayout.includes(pathname)) return null;

  return (
    <MainFooterContainer>
      <MainFooterContent direction='row'>
        <Stack direction='row' gap={2}>
          <Typography variant='h5' color='text.primary' fontWeight='700'>
            Z-CV
          </Typography>
          <VerticalDivider orientation='vertical' />
          <Typography variant='subtitle1' color='grey.300'>
            All rights reserved.
          </Typography>
          <Typography variant='subtitle1' color='grey.300'>
            © 2025
          </Typography>
        </Stack>

        <Stack direction='row' gap={2}>
          <SocialIcons />
          <SocialIcon />
          <Instagram />
          <SocialZ />
        </Stack>
      </MainFooterContent>
    </MainFooterContainer>
  );
};

export default Footer;
