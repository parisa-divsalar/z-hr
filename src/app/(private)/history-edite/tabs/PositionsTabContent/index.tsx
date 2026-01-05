'use client';

import { useMemo, useState } from 'react';

import { Divider, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import Box1Icon from '@/assets/images/dashboard/box1.svg';
import LocationIcon from '@/assets/images/dashboard/location.svg';
import { SectionJob, SuggestedJobCardItem } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

type SuggestedPosition = {
  id: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  description: string;
  techStack: string;
  fitPercent: number;
  isBookmarked: boolean;
};

const BookmarkSvg = ({ filled }: { filled: boolean }) => {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z' fill={filled ? '#111827' : '#9CA3AF'} />
    </svg>
  );
};

const PositionCard = ({
  position,
  onToggleBookmark,
}: {
  position: SuggestedPosition;
  onToggleBookmark: (id: string) => void;
}) => {
  return (
    <SuggestedJobCardItem>
      <SectionJob bgcolor='gray.200'>
        <Typography variant='subtitle1' color='text.primary' fontWeight='400'>
          {position.title}
        </Typography>
      </SectionJob>

      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} pt={2}>
        <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
          {position.dateLabel}
        </Typography>
        <Stack direction='row' alignItems='center' gap={1}>
          <LocationIcon />
          <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
            {position.locationLabel}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: 'grey.100', mx: 1 }} />

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' px={2} pt={1} sx={{ whiteSpace: 'pre-line' }}>
        {position.description}
      </Typography>

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' mt={1} px={2}>
        {position.techStack}
      </Typography>

      <Stack direction='row' gap={1} alignItems='center' px={2} mt={2}>
        <Box1Icon />
        <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
          {position.fitPercent}%
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
          Fit with this Position
        </Typography>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='flex-end' gap={1} px={2} py={2} mt='auto'>
        <IconButton
          aria-label={position.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          onClick={() => onToggleBookmark(position.id)}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.100',
            backgroundColor: 'common.white',
            '&:hover': { backgroundColor: 'grey.50' },
          }}
        >
          <BookmarkSvg filled={position.isBookmarked} />
        </IconButton>

        <MuiButton text='Apply' size='medium' color='secondary' sx={{ minWidth: 92, px: 2.5 }} />
      </Stack>
    </SuggestedJobCardItem>
  );
};

const PositionsTabContent = () => {
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [positions, setPositions] = useState<SuggestedPosition[]>([
    {
      id: 'pos-1',
      title: 'Front end Developer',
      dateLabel: '09/09/2025 · Remote',
      locationLabel: 'Dubai',
      description:
        'Build and maintain web applications using React.js.\nWork with designers and backend developers to implement features.\nEnsure apps are fast, scalable, and user-friendly.',
      techStack: 'React, Next, Vue, Nuxt, Angular, Ionic, Svelte, Sapper, Ember, Octane',
      fitPercent: 89,
      isBookmarked: false,
    },
    {
      id: 'pos-2',
      title: 'Front end Developer',
      dateLabel: '09/09/2025 · Remote',
      locationLabel: 'Dubai',
      description:
        'Build and maintain web applications using React.js.\nWork with designers and backend developers to implement features.\nEnsure apps are fast, scalable, and user-friendly.',
      techStack: 'React, Next, Vue, Nuxt, Angular, Ionic, Svelte, Sapper, Ember, Octane',
      fitPercent: 89,
      isBookmarked: true,
    },
  ]);

  const filteredPositions = useMemo(() => {
    if (!bookmarksOnly) return positions;
    return positions.filter((p) => p.isBookmarked);
  }, [bookmarksOnly, positions]);

  const handleToggleBookmark = (id: string) => {
    setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p)));
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Suggested Positions
          </Typography>

          <MuiCheckbox
            checked={bookmarksOnly}
            onChange={(_, checked) => setBookmarksOnly(checked)}
            label={
              <Typography variant='body2' fontWeight='400' color='text.primary'>
                Bookmarks
              </Typography>
            }
          />
        </Stack>

        <Stack gap={2}>
          {filteredPositions.map((position) => (
            <PositionCard key={position.id} position={position} onToggleBookmark={handleToggleBookmark} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PositionsTabContent;
