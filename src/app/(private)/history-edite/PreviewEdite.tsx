'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

import Dotsvertical from '@/assets/images/dashboard/dots-vertical.svg';
import FrameFaw from '@/assets/images/dashboard/FrameFaw.svg';
import ImageIcon from '@/assets/images/dashboard/image.svg';
import Position from '@/assets/images/dashboard/position.svg';
import ResumeIcon from '@/assets/images/dashboard/resume.svg?url';
import TrashIcon from '@/assets/images/dashboard/trash-01.svg';
import VideoIcon from '@/assets/images/dashboard/video.svg';
import VoiceIcon from '@/assets/images/dashboard/voice.svg';
import MuiButton from '@/components/UI/MuiButton';

import {
  HistoryCommunityCardRoot,
  HistoryImage,
  MenuContentStack,
  MenuItemStack,
  MoreButton,
  PopupMenu,
  RelativeStack,
  StyledDivider,
} from '@/components/history/styled';

const PreviewEdite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFavorite = () => {
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        moreButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <HistoryCommunityCardRoot>
      <Grid container spacing={2} alignItems='center'>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <HistoryImage m={1}>
            <Image src={ResumeIcon} alt='Resume preview' fill />
          </HistoryImage>
        </Grid>

        <Grid size={{ xs: 12, sm: 5, md: 7 }} p={2}>
          <Stack direction='row' gap={2}>
            <Typography variant='h6' fontWeight='500' color='text.primary'>
              Resume Name
            </Typography>
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary' mt={1}>
              85%
            </Typography>
          </Stack>

          <Stack direction='row' gap={2} mt={1} alignItems='center'>
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              Nov 26, 2024
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              2.5MB
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              Software Engineer
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              Senior
            </Typography>
          </Stack>

          <Stack direction='row' gap={3} alignItems='center' mt={2}>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <VoiceIcon />
              <Typography variant='body1' fontWeight='400' color='text.primary'>
                0
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <ImageIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                1
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <VideoIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                0
              </Typography>
            </Stack>
          </Stack>

          <Stack direction='row' gap={1} mt={3}>
            <Position />

            <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
              This is a sample description for the resume
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <Stack gap={11} alignItems='flex-end'>
            <RelativeStack direction='row' gap={3}>
              <MoreButton ref={moreButtonRef} onClick={handleMoreClick} aria-label='More options'>
                <Dotsvertical />
              </MoreButton>

              <PopupMenu ref={menuRef} isOpen={isMenuOpen}>
                <MenuContentStack>
                  <MenuItemStack direction='row' alignItems='center' gap={1} onClick={handleFavorite}>
                    <FrameFaw />
                    <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                      Favorite
                    </Typography>
                  </MenuItemStack>
                  <MenuItemStack direction='row' alignItems='center' gap={1} onClick={handleDelete}>
                    <TrashIcon />
                    <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                      Delete
                    </Typography>
                  </MenuItemStack>
                </MenuContentStack>
              </PopupMenu>
            </RelativeStack>
            <Stack direction='row' gap={2}>
              <MuiButton variant='outlined' color='secondary'>
                Edit
              </MuiButton>
              <MuiButton variant='contained' color='secondary'>
                Download
              </MuiButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </HistoryCommunityCardRoot>
  );
};

export default PreviewEdite;

