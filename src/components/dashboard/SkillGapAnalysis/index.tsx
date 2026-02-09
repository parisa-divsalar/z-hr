import React from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import ArrowRightIcon from '@/assets/images/dashboard/arrow-right.svg';
import HeadIcon from '@/assets/images/dashboard/comm.svg';
import PositionIcon from '@/assets/images/dashboard/position.svg';
import { SectionHeader, SuggestedJobCardItem, TagPill } from '@/components/dashboard/styled';
import MuiButton from '@/components/UI/MuiButton';

const SkillGapAnalysis = () => {
  return (
    <Stack gap={2}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Skill Gap Analysis
          </Typography>
        </Stack>
        <MuiButton text='More' color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
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
                    Zayd Al-Mansoori’s Resume
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <MuiButton
                text='Help'
                color='secondary'
                variant='text'
                sx={{ minWidth: 'auto', px: 1, textTransform: 'none' }}
              />
              <MuiButton text='Activate' color='secondary' sx={{ borderRadius: 2, px: 3, minWidth: 120, height: 40 }} />
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
          >
            <Stack alignItems='center' gap={1}>
              <Typography sx={{ fontSize: 44, color: '#4D49FC', lineHeight: 1 }}>+</Typography>
              <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                Activate Now
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default SkillGapAnalysis;
