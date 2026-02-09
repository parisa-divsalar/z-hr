'use client';

import React, { useEffect, useMemo, useState } from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import HeadIcon from '@/assets/images/dashboard/comm.svg';
import PositionIcon from '@/assets/images/dashboard/position.svg';
import { SectionHeader, SuggestedJobCardItem } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';
import MuiAlert from '@/components/UI/MuiAlert';
import { usePlanGate } from '@/hooks/usePlanGate';
import { useAuthStore } from '@/store/auth';

type ResumeListItem = {
  requestId: string;
  displayName: string;
  updatedAt?: string | null;
  createdAt?: string | null;
};

function possessive(name: string) {
  const n = String(name ?? '').trim();
  if (!n) return 'Your Resume';
  const endsWithS = n.toLowerCase().endsWith('s');
  return `${n}${endsWithS ? '’' : '’s'} Resume`;
}

const SkillGapAnalysis = () => {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const { guardAction, planDialog } = usePlanGate();

  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/cv/list?limit=50`, {
      cache: 'no-store',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        const rows = Array.isArray(json?.data) ? (json.data as any[]) : [];
        const mapped: ResumeListItem[] = rows
          .map((row) => ({
            requestId: String(row?.requestId ?? '').trim(),
            displayName: String(row?.displayName ?? '').trim(),
            updatedAt: row?.updatedAt ?? null,
            createdAt: row?.createdAt ?? null,
          }))
          .filter((r) => Boolean(r.requestId));
        setResumes(mapped);
      })
      .catch(() => {
        setResumes([]);
        setError('Failed to load your resumes.');
      })
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  const latestResume = useMemo(() => (resumes.length > 0 ? resumes[0] : null), [resumes]);
  const resumeLabel = possessive(latestResume?.displayName ?? '');

  const openSkillGap = () => {
    if (!latestResume?.requestId) return;
    router.push(`/history-edite?id=${encodeURIComponent(latestResume.requestId)}&tab=skill-gap`);
  };

  return (
    <Stack gap={2}>
      {planDialog}
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Skill Gap Analysis
          </Typography>
        </Stack>
        <MuiButton
          text='More'
          color='secondary'
          variant='text'
          endIcon={<ArrowRightIcon />}
          disabled={!latestResume?.requestId}
          onClick={() => guardAction(openSkillGap, 'skill_gap')}
        />
      </SectionHeader>

      <Grid container spacing={2} alignItems='stretch'>
        <Grid size={{ xs: 12, md: 4 }}>
          <SuggestedJobCardItem
            sx={{
              p: 2,
              boxShadow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack gap={1.5}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    bgcolor: '#F1F1FE',
                    display: 'grid',
                    placeItems: 'center',
                    position: 'relative',
                  }}
                >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: '#E9ECFF',
                  }}
                />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 6,
                      right: 30,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#4D49FC',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                    }}
                  >
                    <AddRoundedIcon fontSize='small' />
                  </Box>
                </Box>
              </Box>

              <Stack alignItems='center' gap={0.75}>
                <Typography variant='subtitle1' color='text.primary' fontWeight='500' textAlign='center'>
                  Identify Your Skill Gaps
                </Typography>
                <Stack direction='row' gap={1} alignItems='center'>
                  <PositionIcon />
                  <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                    {isLoading ? 'Loading…' : resumeLabel}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {error && <MuiAlert severity='error' message={error} />}

            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <MuiButton
                text='Help'
                color='secondary'
                variant='text'
                sx={{ minWidth: 'auto', px: 1, textTransform: 'none' }}
                onClick={() => router.push('/history')}
              />
              <MuiButton
                text='Activate'
                color='secondary'
                sx={{ borderRadius: 2, px: 3, minWidth: 120, height: 40 }}
                disabled={!latestResume?.requestId}
                onClick={() => guardAction(openSkillGap, 'skill_gap')}
              />
            </Stack>
          </SuggestedJobCardItem>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              height: '100%',
              minHeight: 240,
              borderRadius: 2,
              border: (t) => `2px dashed ${t.palette.grey[200]}`,
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#fff',
            }}
            onClick={() => guardAction(openSkillGap, 'skill_gap')}
          >
            <Stack alignItems='center' gap={1}>
              <Typography sx={{ fontSize: 44, color: '#4D49FC', lineHeight: 1 }}>+</Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                {latestResume?.requestId ? 'Activate Now' : 'Create a resume first'}
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SkillGapAnalysis;
