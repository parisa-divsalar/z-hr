 'use client';

import { Stack, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import Box1Icon from '@/assets/images/dashboard/box1.svg';
import Box2Icon from '@/assets/images/dashboard/box2.svg';
import BoxIcon from '@/assets/images/dashboard/boxIcon.svg';
import HeadIcon from '@/assets/images/dashboard/head.svg';
import Location from '@/assets/images/dashboard/location.svg';
import { SectionHeader, SectionJob, SuggestedJobCardItem } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiAlert from '@/components/UI/MuiAlert';
import { useAuthStore } from '@/store/auth';

type SuggestedJob = {
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

function possessive(name: string) {
  const n = String(name ?? '').trim();
  if (!n) return 'Your Resume';
  const endsWithS = n.toLowerCase().endsWith('s');
  return `${n}${endsWithS ? '’' : '’s'} Resume`;
}

const SuggestedJobCard = ({ job }: { job: SuggestedJob }) => {
  const date = toMMDDYYYY(job.postedDate);
  const type = locationTypeLabel(job.locationType);
  const subtitle = [date, type].filter(Boolean).join(' · ');
  const resumeLabel = possessive(job.matchedResumeName);

  return (
    <SuggestedJobCardItem>
      <SectionJob bgcolor='gray.200'>
        <Typography variant='subtitle1' color='text.primary' fontWeight='400'>
          {job.title}
        </Typography>
      </SectionJob>
      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} p={2}>
        <Typography variant='subtitle2' color='text.primary' fontWeight='400'>
          {subtitle || '—'}
        </Typography>
        <Stack direction='row'>
          <Location style={{ marginTop: 4 }} />
          <Typography variant='subtitle2' color='text.primary' fontWeight='400' pl={1}>
            {job.location || '—'}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: 'grey.100', marginX: '8px' }} />

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' px={2} pt={1}>
        {job.description || '—'}
      </Typography>

      <Typography variant='subtitle2' color='text.primary' fontWeight='400' mt={1} px={2}>
        Tech stack:{' '}
        {Array.isArray(job.techStack) && job.techStack.length > 0 ? job.techStack.join(', ') : '—'}
      </Typography>

      <Stack direction='row' gap={1} alignItems='center' px={2} mt={2}>
        <Box1Icon />
        <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
          {Math.max(0, Math.min(100, Number(job.fitScore) || 0))}%{' '}
        </Typography>
        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
          Fit with this Position
        </Typography>
      </Stack>
      <Stack direction='row' gap={1} alignItems='center' px={2} mt={2}>
        <Box2Icon />
        <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
          {resumeLabel}
        </Typography>
      </Stack>

      <Stack direction='row' alignItems='center' justifyContent='space-between' px={2} p={2}>
        <Stack direction='row' alignItems='center' justifyContent='center' ml={5}>
          <BoxIcon />
        </Stack>

        <MuiButton
          text='Apply'
          size='medium'
          color='secondary'
          sx={{ width: 247 }}
          disabled={!job.applicationUrl}
          onClick={() => {
            if (!job.applicationUrl) return;
            window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
          }}
        />
      </Stack>
    </SuggestedJobCardItem>
  );
};

const SuggestedPositions = ({ suggestedJobs }: { suggestedJobs?: SuggestedJob[] | null }) => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [internalJobs, setInternalJobs] = useState<SuggestedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jobs = useMemo(() => {
    // If parent passes jobs (even empty array), trust it.
    if (Array.isArray(suggestedJobs)) return suggestedJobs;
    return internalJobs;
  }, [suggestedJobs, internalJobs]);

  useEffect(() => {
    if (Array.isArray(suggestedJobs)) return;
    setIsLoading(true);
    setError(null);
    fetch(`/api/positions/suggested?max=2`, {
      cache: 'no-store',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        const rows = Array.isArray(json?.data) ? (json.data as SuggestedJob[]) : [];
        setInternalJobs(rows);
      })
      .catch(() => {
        setInternalJobs([]);
        setError('Failed to load suggested positions.');
      })
      .finally(() => setIsLoading(false));
  }, [suggestedJobs, accessToken]);

  const navigateToHistory = () => {
    router.push('/history');
  };
  return (
    <Stack gap={2}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Suggested Positions
          </Typography>
        </Stack>
        <MuiButton
          text='More'
          color='secondary'
          variant='text'
          endIcon={<ArrowRightIcon />}
          onClick={navigateToHistory}
        />
      </SectionHeader>
      <Grid container spacing={2}>
        {error ? (
          <Grid size={{ xs: 12 }}>
            <MuiAlert severity='error' message={error} />
          </Grid>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Grid key={job.id} size={{ xs: 12, md: 6 }}>
              <SuggestedJobCard job={job} />
            </Grid>
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <SuggestedJobCardItem sx={{ p: 2, boxShadow: 1 }}>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {isLoading ? 'Loading suggested positions…' : 'No suggested positions yet.'}
              </Typography>
            </SuggestedJobCardItem>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default SuggestedPositions;
