'use client';

import type { ReactNode } from 'react';

import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import { Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

type StatCardModel = {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  meta: string;
};

type ListCardModel = {
  title: string;
  subtitle: string;
  action: string;
};

function SectionHeader({
  icon,
  title,
  actionLabel = 'View all',
}: {
  icon: ReactNode;
  title: string;
  actionLabel?: string;
}) {
  return (
    <Stack direction='row' alignItems='center' justifyContent='space-between'>
      <Stack direction='row' alignItems='center' gap={1.5} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            bgcolor: '#F1F1FE',
            color: '#4D49FC',
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 auto',
          }}
        >
          {icon}
        </Box>
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 600,
            color: '#111113',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
      </Stack>

      <Button
        variant='text'
        endIcon={<ArrowForwardRoundedIcon fontSize='small' />}
        sx={{
          color: '#111113',
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 'auto',
          px: 1,
          flex: '0 0 auto',
        }}
      >
        {actionLabel}
      </Button>
    </Stack>
  );
}

function StatCard({ model }: { model: StatCardModel }) {
  return (
    <Paper
      variant='outlined'
      sx={{
        borderColor: '#D8D8DA',
        borderRadius: 2,
        p: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <Stack direction='row' gap={2} sx={{ width: '100%' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2,
            bgcolor: model.iconBg,
            color: model.iconColor,
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 auto',
          }}
        >
          {model.icon}
        </Box>

        <Stack sx={{ minWidth: 0 }}>
          <Typography variant='body2' sx={{ color: '#8A8A91', fontWeight: 500 }}>
            {model.title}
          </Typography>
          <Typography
            variant='h6'
            sx={{
              color: '#111113',
              fontWeight: 700,
              lineHeight: 1.2,
              mt: 0.25,
            }}
          >
            {model.value}
          </Typography>
          <Typography variant='caption' sx={{ color: '#8A8A91', mt: 0.5 }}>
            {model.meta}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function ListCard({ model }: { model: ListCardModel }) {
  return (
    <Paper
      variant='outlined'
      sx={{
        borderColor: '#D8D8DA',
        borderRadius: 2,
        p: { xs: 1.75, sm: 2 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 1.5, sm: 2 }}
      >
        <Stack direction='row' gap={2} alignItems='center' sx={{ minWidth: 0, width: '100%' }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#EAEEF9',
              color: '#245BFF',
              flex: '0 0 auto',
              fontWeight: 700,
            }}
          >
            {model.title.slice(0, 1).toUpperCase()}
          </Avatar>

          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 700,
                color: '#111113',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {model.title}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#8A8A91',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {model.subtitle}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant='contained'
          sx={{
            bgcolor: '#111113',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 2,
            height: 34,
            px: 2,
            alignSelf: { xs: 'stretch', sm: 'center' },
            minWidth: { xs: '100%', sm: 120 },
            '&:hover': { bgcolor: '#111113' },
          }}
        >
          {model.action}
        </Button>
      </Stack>
    </Paper>
  );
}

function DashedPlaceholderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Paper
      variant='outlined'
      sx={{
        borderColor: '#D8D8DA',
        borderRadius: 2,
        p: 2,
        borderStyle: 'dashed',
        borderWidth: 2,
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        bgcolor: 'transparent',
      }}
    >
      <Stack gap={0.75} sx={{ maxWidth: 360 }}>
        <Typography sx={{ fontWeight: 700, color: '#111113' }}>{title}</Typography>
        <Typography variant='body2' sx={{ color: '#8A8A91' }}>
          {subtitle}
        </Typography>
      </Stack>
    </Paper>
  );
}

function CtaCard({ title, subtitle, action }: { title: string; subtitle: string; action: string }) {
  return (
    <Paper
      variant='outlined'
      sx={{
        borderColor: '#D8D8DA',
        borderRadius: 2,
        p: { xs: 1.75, sm: 2 },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 1.5, sm: 2 }}
      >
        <Stack direction='row' gap={2} alignItems='center' sx={{ minWidth: 0, width: '100%' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: '#F5F7FF',
              color: '#245BFF',
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
            }}
          >
            <AutoGraphRoundedIcon />
          </Box>
          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 700,
                color: '#111113',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: '#8A8A91',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant='contained'
          sx={{
            bgcolor: '#111113',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 2,
            height: 34,
            px: 2,
            alignSelf: { xs: 'stretch', sm: 'center' },
            minWidth: { xs: '100%', sm: 140 },
            '&:hover': { bgcolor: '#111113' },
          }}
        >
          {action}
        </Button>
      </Stack>
    </Paper>
  );
}

const DashboardPage = () => {
  const stats: StatCardModel[] = [
    {
      icon: <StorageRoundedIcon />,
      iconBg: 'rgba(255, 170, 0, 0.08)',
      iconColor: '#FE8A15',
      title: 'Data processed',
      value: '1,284',
      meta: 'Updated just now',
    },
    {
      icon: <ChecklistRoundedIcon />,
      iconBg: '#F4FEF4',
      iconColor: '#25BC2D',
      title: 'Tasks completed',
      value: '86%',
      meta: 'This week',
    },
    {
      icon: <MicRoundedIcon />,
      iconBg: '#F5F7FF',
      iconColor: '#245BFF',
      title: 'Interviews',
      value: '12',
      meta: 'Last 30 days',
    },
  ];

  const items: ListCardModel[] = [
    {
      title: 'Resume review',
      subtitle: 'A quick review of your latest changes',
      action: 'Open',
    },
    {
      title: 'Cover letter draft',
      subtitle: 'Continue where you left off',
      action: 'Resume',
    },
    {
      title: 'Interview prep',
      subtitle: 'Practice questions based on your role',
      action: 'Start',
    },
  ];

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
      <Paper
        variant='outlined'
        sx={{
          width: '100%',
          maxWidth: '894px',
          borderColor: '#D8D8DA',
          borderRadius: 2,
          bgcolor: '#fff',
          overflow: 'hidden',
        }}
      >
        <Stack gap={{ xs: 2.5, sm: 3 }} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant='h6' sx={{ fontWeight: 800, color: '#171717' }}>
            Dashboard
          </Typography>

          <Grid container spacing={2}>
            {stats.map((s) => (
              <Grid key={s.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <StatCard model={s} />
              </Grid>
            ))}
          </Grid>

          <Stack gap={2}>
            <SectionHeader icon={<FormatListBulletedRoundedIcon fontSize='small' />} title='Your workspace' />
            <Stack gap={2}>
              {items.map((it) => (
                <ListCard key={it.title} model={it} />
              ))}
            </Stack>
          </Stack>

          <Stack gap={2}>
            <SectionHeader icon={<AutoGraphRoundedIcon fontSize='small' />} title='Analytics' actionLabel='Details' />
            <Grid container spacing={2} alignItems='stretch'>
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  variant='outlined'
                  sx={{ borderColor: '#D8D8DA', borderRadius: 2, p: 2, height: '100%' }}
                >
                  <Stack gap={1.5}>
                    <Typography sx={{ fontWeight: 700, color: '#111113' }}>Overview</Typography>
                    <Typography variant='body2' sx={{ color: '#8A8A91' }}>
                      Quick snapshot of your recent activity.
                    </Typography>

                    <Stack direction='row' gap={2} sx={{ flexWrap: 'wrap' }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: '#F1F1FE' }} />
                      <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: '#F1F1FE' }} />
                      <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: '#F1F1FE' }} />
                    </Stack>

                    <Typography variant='caption' sx={{ color: '#8A8A91' }}>
                      Tip: Keep your profile updated to get better suggestions.
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <DashedPlaceholderCard
                  title='Chart area'
                  subtitle='Replace this placeholder with a real chart component when the data is ready.'
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack gap={2}>
            <SectionHeader icon={<AutoGraphRoundedIcon fontSize='small' />} title='Next steps' actionLabel='See more' />
            <Stack gap={2}>
              <CtaCard title='Boost your profile' subtitle='Complete the missing sections to improve results.' action='Continue' />
              <CtaCard title='Generate a new resume' subtitle='Start from a template and customize in minutes.' action='Create' />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DashboardPage;
