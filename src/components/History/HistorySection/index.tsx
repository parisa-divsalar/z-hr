import React, { useCallback, useEffect, useRef, useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { CircularProgress, Stack, Typography } from '@mui/material';
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
import { SectionHeader } from '@/components/Dashboard/styled';
import { communityChannels } from '@/components/History/mockData';
import {
  HeaderDivider,
  HistoryCommunityCardRoot,
  HistoryImage,
  MenuContentStack,
  MenuItemStack,
  MoreButton,
  PopupMenu,
  RelativeStack,
  SortMenuContentStack,
  StyledDivider,
} from '@/components/History/styled';
import { THistoryChannel } from '@/components/History/type';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

const HistoryCard = ({
  name,
  date,
  Percentage,
  position,
  level,
  size,
  Voice,
  Photo,
  Video,
  description,
}: THistoryChannel) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditClick = () => {
    router.push('/history-edite');
  };

  const handleFavorite = () => {
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
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
    <HistoryCommunityCardRoot>
      <Grid container spacing={2} alignItems='center'>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <HistoryImage m={1}>
            <Image src={ResumeIcon} alt='Resume preview' fill />
          </HistoryImage>
        </Grid>

        <Grid size={{ xs: 12, sm: 5, md: 7 }} p={2} pl={3}>
          <Stack direction='row' gap={2}>
            <Typography variant='h6' fontWeight='500' color='text.primary'>
              {name}
            </Typography>
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary' mt={1}>
              {Percentage}
            </Typography>
          </Stack>

          <Stack direction='row' gap={2} mt={1} alignItems='center'>
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              {date}
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              {size}
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              {position}
            </Typography>
            <StyledDivider orientation='vertical' flexItem />
            <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
              {level}
            </Typography>
          </Stack>

          <Stack direction='row' gap={3} alignItems='center' mt={2}>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <VoiceIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                {Voice}
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <ImageIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                {Photo}
              </Typography>
            </Stack>
            <Stack direction='row' gap={0.5} alignItems='center'>
              <VideoIcon />
              <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                {Video}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction='row' gap={1} mt={4}>
            <Position />

            <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
              {description}
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
              <MuiButton variant='outlined' color='secondary' onClick={handleEditClick}>
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

const HistorySection = () => {
  const [displayedItems, setDisplayedItems] = useState<THistoryChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(communityChannels[0]?.id ?? null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 3;
  const selectedResume = communityChannels.find((channel) => channel.id === selectedResumeId) ?? null;

  const handleSortClick = () => {
    setIsSortMenuOpen((prev) => !prev);
  };

  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setIsSortMenuOpen(false);
  };

  const loadMoreItems = useCallback(() => {
    if (isLoading || currentIndex >= communityChannels.length) return;

    setIsLoading(true);

    setTimeout(() => {
      const nextItems = communityChannels.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

      setDisplayedItems((prev) => [...prev, ...nextItems]);
      setCurrentIndex((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  }, [currentIndex, isLoading]);

  useEffect(() => {
    loadMoreItems();
  }, [loadMoreItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSortMenuOpen &&
        sortMenuRef.current &&
        sortButtonRef.current &&
        !sortMenuRef.current.contains(event.target as Node) &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortMenuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && currentIndex < communityChannels.length) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoading, currentIndex, loadMoreItems]);

  return (
    <Stack gap={1}>
      <SectionHeader>
        <Typography variant='h5' fontWeight='500' color='text.primary'>
          History{' '}
        </Typography>
        <Stack direction='row' alignItems='center'>
          <MuiCheckbox
            label={
              <Typography variant='body2' fontWeight='400' color='text.primary'>
                Bookmarks{' '}
              </Typography>
            }
          />

          <HeaderDivider orientation='vertical' flexItem sx={{ ml: 2 }} />

          <RelativeStack ref={sortButtonRef}>
            <MuiButton
              text={selectedResume?.name ?? 'Select resume'}
              color='secondary'
              variant='text'
              sx={{
                gap: '0.4rem',
                backgroundColor: 'transparent',
                '&:hover': { backgroundColor: 'transparent' },
              }}
              onClick={handleSortClick}
              endIcon={<KeyboardArrowDownRoundedIcon fontSize='small' />}
            />

            <PopupMenu ref={sortMenuRef} isOpen={isSortMenuOpen}>
              <SortMenuContentStack>
                {communityChannels.map((channel) => {
                  const isSelected = selectedResumeId === channel.id;
                  return (
                    <MenuItemStack
                      key={channel.id}
                      direction='column'
                      alignItems='flex-start'
                      gap={0.5}
                      onClick={() => handleResumeSelect(channel.id)}
                      sx={{
                        px: 1,
                        py: 0.75,
                        borderRadius: 1,
                        width: '100%',
                        backgroundColor: isSelected ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Typography variant='subtitle2' fontWeight={isSelected ? 600 : 400} color='text.primary'>
                        {channel.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {channel.date}
                      </Typography>
                    </MenuItemStack>
                  );
                })}
              </SortMenuContentStack>
            </PopupMenu>
          </RelativeStack>
        </Stack>
      </SectionHeader>
      <Grid container>
        {displayedItems.map((channel) => (
          <Grid key={channel.id} size={{ xs: 12 }}>
            <HistoryCard {...channel} />
          </Grid>
        ))}
      </Grid>

      <Stack ref={observerTarget} alignItems='center' justifyContent='center' py={2}>
        {isLoading && <CircularProgress size={30} />}
        {currentIndex >= communityChannels.length && displayedItems.length > 0 && (
          <Typography variant='body2' color='text.secondary'>
            No more items to load
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default HistorySection;
