import React, { useEffect, useRef, useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Dotsvertical from '@/assets/images/dashboard/dots-vertical.svg';
import FrameFaw from '@/assets/images/dashboard/FrameFaw.svg';
import ImageIcon from '@/assets/images/dashboard/image.svg';
import Position from '@/assets/images/dashboard/position.svg';
import ResumeIcon from '@/assets/images/dashboard/resume.svg?url';
import TrashIcon from '@/assets/images/dashboard/trash-01.svg';
import VideoIcon from '@/assets/images/dashboard/video.svg';
import VoiceIcon from '@/assets/images/dashboard/voice.svg';
import {
  HistoryImage,
  MenuContentStack,
  MenuItemStack,
  MoreButton,
  PopupMenu,
  RelativeStack,
  StyledDivider,
} from '@/components/history/styled';
import MuiButton from '@/components/UI/MuiButton';

import { PreviewEditeRoot } from '../styled';

interface PreviewEditeProps {
  setActiveStep?: (step: number) => void;
}

const PreviewEdite: React.FC<PreviewEditeProps> = ({ setActiveStep }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditResume = () => {
    if (setActiveStep) {
      setActiveStep(3);
    } else {
      router.push('/?step=3');
    }
  };

  const handleFavorite = () => {
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    setIsMenuOpen(false);
  };

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
    <PreviewEditeRoot>
      <Grid container spacing={2} alignItems='center'>
        <Grid size={{ xs: 12, sm: 12, md: 2 }}>
          <HistoryImage p={2}>
            <Image src={ResumeIcon} alt='Resume preview' fill />
          </HistoryImage>
        </Grid>

        <Grid size={{ xs: 12, sm: 5, md: 7 }} p={2}>
          <Stack direction='row' gap={1}>
            <Typography variant='h6' fontWeight='500' color='text.primary'>
              Resume Name
            </Typography>
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary' mt={0.5}>
              85%
            </Typography>
          </Stack>

          <Stack direction='row' gap={2} alignItems='center'>
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
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                Voice
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <ImageIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                Photo
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <VideoIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                Video
              </Typography>
            </Stack>
          </Stack>

          <Stack direction='row' gap={1} mt={2}>
            <Position />

            <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
              3 Suggested Position{' '}
            </Typography>
          </Stack>

          <Stack direction='row' gap={1} mt={2} alignItems='center'>
            <FrameFaw />
            <Divider orientation='vertical' flexItem sx={{ bgcolor: 'grey.100' }} />
            <TrashIcon />
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
              <MuiButton variant='outlined' color='secondary' onClick={handleEditResume}>
                Edit
              </MuiButton>
              <MuiButton variant='contained' color='secondary' onClick={handleEditResume}>
                Download
              </MuiButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </PreviewEditeRoot>
  );
};

export default PreviewEdite;
