'use client';

import React from 'react';

import { IconButton, Typography } from '@mui/material';

import AvatarSrc from '@/assets/images/bg/avatar.png';
import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';
import MuiAvatar from '@/components/UI/MuiAvatar';

import { ProfileHeaderContainer, ProfileInfo, ActionButtons, AvatarContainer } from './styled';

const ProfileHeader = () => {
  return (
    <ProfileHeaderContainer>
      <AvatarContainer>
        <MuiAvatar size='large' src={AvatarSrc.src} />
        <ProfileInfo>
          <Typography variant='h4' fontWeight='bold' gutterBottom>
            Zayd Al-Mansoori
          </Typography>
          <Typography variant='body1' color='text.secondary' gutterBottom>
            Dubai
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Front-end Developer • Visa status • 12 Years of experience
          </Typography>
        </ProfileInfo>
      </AvatarContainer>

      <ActionButtons>
        <IconButton size='small'>
          <EditIcon />
        </IconButton>
        <IconButton size='small'>
          <RefreshIcon />
        </IconButton>
        <IconButton size='small'>
          <StarIcon />
        </IconButton>
      </ActionButtons>
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
