'use client';

import { useEffect, useMemo, useState } from 'react';

import { CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'next/navigation';

import Box1Icon from '@/assets/images/dashboard/box1.svg';
import LocationIcon from '@/assets/images/dashboard/location.svg';
import { SectionJob, SuggestedJobCardItem } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import MuiAlert from '@/components/UI/MuiAlert';
import { useAuthStore } from '@/store/auth';

type SuggestedPosition = {
  id: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  description: string;
  techStack: string;
  fitPercent: number;
  isBookmarked: boolean;
  applicationUrl?: string;
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

        <MuiButton
          text='Apply'
          size='medium'
          color='secondary'
          sx={{ minWidth: 92, px: 2.5 }}
          disabled={!position.applicationUrl}
          onClick={() => {
            if (!position.applicationUrl) return;
            window.open(position.applicationUrl, '_blank', 'noopener,noreferrer');
          }}
        />
      </Stack>
    </SuggestedJobCardItem>
  );
};

type ApiSuggestedJob = {
  id: string;
  title: string;
  company?: string;
  location?: string;
  locationType?: string;
  postedDate?: string;
  description?: string;
  techStack?: string[];
  applicationUrl?: string;
  fitScore: number;
  matchedResumeName: string;
};

function toMMDDYYYY(value: string | undefined) {
  const d = new Date(String(value ?? ''));
  if (Number.isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function locationTypeLabel(locationType?: string) {
  const s = String(locationType ?? '').trim().toLowerCase();
  if (!s) return '';
  if (s === 'remote') return 'Remote';
  if (s === 'hybrid') return 'Hybrid';
  if (s === 'onsite' || s === 'on-site' || s === 'on site') return 'Onsite';
  return s;
}

const PositionsTabContent = () => {
  const searchParams = useSearchParams();
  const requestId = useMemo(() => String(searchParams.get('id') ?? '').trim(), [searchParams]);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [positions, setPositions] = useState<SuggestedPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setPositions([]);
      setError('Missing resume id.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const qs = new URLSearchParams();
    qs.set('requestId', requestId);
    qs.set('max', '20');

    fetch(`/api/positions/suggested?${qs.toString()}`, {
      cache: 'no-store',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        const jobs = Array.isArray(json?.data) ? (json.data as ApiSuggestedJob[]) : [];
        const mapped: SuggestedPosition[] = jobs.map((job) => {
          const date = toMMDDYYYY(job.postedDate);
          const type = locationTypeLabel(job.locationType);
          const dateLabel = [date, type].filter(Boolean).join(' · ') || '—';

          return {
            id: String(job.id),
            title: String(job.title ?? '').trim() || 'Untitled position',
            dateLabel,
            locationLabel: String(job.location ?? '').trim() || '—',
            description: String(job.description ?? '').trim() || '—',
            techStack:
              Array.isArray(job.techStack) && job.techStack.length > 0
                ? `Tech stack: ${job.techStack.join(', ')}`
                : 'Tech stack: —',
            fitPercent: Math.max(0, Math.min(100, Number(job.fitScore) || 0)),
            isBookmarked: false,
            applicationUrl: String(job.applicationUrl ?? '').trim() || undefined,
          };
        });
        setPositions(mapped);
      })
      .catch(() => {
        setPositions([]);
        setError('Failed to load suggested positions.');
      })
      .finally(() => setIsLoading(false));
  }, [requestId, accessToken]);

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
          {error && <MuiAlert severity='error' message={error} />}
          {isLoading ? (
            <Stack direction='row' justifyContent='center' sx={{ py: 2 }}>
              <CircularProgress size={24} />
            </Stack>
          ) : filteredPositions.length > 0 ? (
            filteredPositions.map((position) => (
              <PositionCard key={position.id} position={position} onToggleBookmark={handleToggleBookmark} />
            ))
          ) : (
            <SuggestedJobCardItem sx={{ p: 2, boxShadow: 1 }}>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                No suggested positions yet.
              </Typography>
            </SuggestedJobCardItem>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default PositionsTabContent;
