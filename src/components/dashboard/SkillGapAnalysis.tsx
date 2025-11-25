import React from 'react';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import HeadIcon from '@/assets/images/dashboard/head.svg';
import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import { SectionHeader, SuggestedJobCardItem, TagPill } from './styled';

type SkillInfoItem = {
  title: string;
  value: string;
};

type SkillCardProps = {
  items: SkillInfoItem[];
  suggestion: string;
  actionLabel: string;
};

const SkillCard = ({ items }: SkillCardProps) => {
  return (
    <SuggestedJobCardItem>
      <Stack gap={1.5} px={2} pt={2} p={2}>
        {items.map(({ title, value }, index) => (
          <Stack key={title} direction='row' alignItems='center' gap={1} pt={1}>
            {index === 0 ? (
              <>
                <Typography variant='body1' color='text.primary' fontWeight='400'>
                  {title}:
                </Typography>
                <TagPill>{value}</TagPill>
              </>
            ) : (
              <>
                <Typography variant='body2' color='text.secondary' fontWeight='400'>
                  {title}:
                </Typography>
                <Typography variant='body2' color='text.primary' fontWeight='400'>
                  {value}
                </Typography>
              </>
            )}
          </Stack>
        ))}
        <Stack direction='row' alignItems='center' justifyContent='cnter'>
          <MuiButton color='secondary' fullWidth variant='text'>
            View{' '}
          </MuiButton>

          <MuiButton fullWidth color='secondary'>
            add
          </MuiButton>
        </Stack>
      </Stack>
    </SuggestedJobCardItem>
  );
};

const SkillGapAnalysis = () => {
  const cardsData: SkillCardProps[] = [
    {
      items: [
        { title: 'React.js', value: 'Needs Improvement' },
        { title: 'Current Level', value: 'Intermediate' },
        { title: 'Suggested Level', value: 'Advanced' },
      ],
      suggestion: 'Focus on React best practices',
      actionLabel: 'View resources',
    },
    {
      items: [
        { title: 'React.js', value: 'Needs Improvement' },
        { title: 'Current Level', value: 'Intermediate' },

        { title: 'Suggested Level', value: 'Advanced' },
      ],
      suggestion: 'High priority to improve',
      actionLabel: 'Add',
    },
  ];

  return (
    <Stack gap={2}>
      <SectionHeader>
        <Stack direction='row' gap={1} alignItems='center'>
          <HeadIcon />
          <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
            Skill Gap Analysis
          </Typography>
        </Stack>
        <MuiButton text='more' color='secondary' variant='text' endIcon={<ArrowRightIcon />} />
      </SectionHeader>

      <Grid container spacing={2}>
        {cardsData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <SkillCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default SkillGapAnalysis;
