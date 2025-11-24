'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import ArrowIcon from '@/assets/images/icons/Icon.svg';
import LinkDarkIcon from '@/assets/images/icons/link-dark.svg';
import ArrowRightIcon from '@/assets/images/icons/links.svg';
import MuiButton from '@/components/UI/MuiButton';

import {
  Container,
  HeaderSection,
  ResumePreview,
  InfoTable,
  InfoRow,
  FitScoreBadge,
  ActionButtons,
  FeatureCard,
  FeatureCardIcon,
  HeaderLeft,
  PurplePill,
  StyledDivider,
} from './styled';

const ResumeGeneratorPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const resumeInfo = [
    { label: 'Created:', value: '09/09/2025' },
    { label: 'Size:', value: '2.85 MB' },
    { label: 'Fit score:', value: '89%', isBadge: true },
    { label: 'Skill group:', value: 'Front-end' },
    { label: 'Experience level:', value: 'Mid-senior' },
  ];

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const featureCards = [
    {
      title: 'Resume Template',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
    {
      title: 'Job Position Suggestions',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
    {
      title: 'Learning Hub',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
    {
      title: 'Interview Questions',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
    {
      title: 'Text Interview Practice (Chatbot)',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
    {
      title: 'Voice Interview Practice',
      description: 'Create professional, templates with modern design and flexible layout options.',
    },
  ];

  return (
    <Container>
      <Grid container spacing={{ xs: 3, sm: 4 }}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <ResumePreview>
            <Typography variant='body1' color='text.secondary'>
              Resume Preview
            </Typography>
          </ResumePreview>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <InfoTable>
            <HeaderSection>
              <HeaderLeft>
                <Typography
                  variant='h4'
                  color='text.primary'
                  fontWeight='700'
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2.125rem' },
                  }}
                >
                  Zayd Al-Mansoori's Resume
                </Typography>
                <PurplePill>AI Generation</PurplePill>
              </HeaderLeft>
              <MuiButton size='small' variant='outlined' endIcon={<ArrowIcon />} color='secondary'>
                Go to panel
              </MuiButton>
            </HeaderSection>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                {resumeInfo.map((info, index) => (
                  <InfoRow key={index}>
                    <Typography variant='body1' color='text.secondary' fontWeight='500'>
                      {info.label}
                    </Typography>
                    {info.isBadge ? (
                      <FitScoreBadge>{info.value}</FitScoreBadge>
                    ) : (
                      <Typography variant='body1' color='text.primary'>
                        {info.value}
                      </Typography>
                    )}
                  </InfoRow>
                ))}
                <Grid size={{ xs: 12, sm: 4, lg: 4 }} mt={6}>
                  <ActionButtons>
                    <MuiButton variant='outlined' size='large' color='secondary'>
                      Edit
                    </MuiButton>
                    <MuiButton variant='contained' size='large' color='secondary' sx={{ width: '200px' }}>
                      Download
                    </MuiButton>
                  </ActionButtons>
                </Grid>
              </Grid>
            </Grid>
          </InfoTable>
        </Grid>
      </Grid>

      <StyledDivider />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {featureCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <FeatureCard onMouseEnter={() => setHoveredCard(index)} onMouseLeave={() => setHoveredCard(null)}>
              <FeatureCardIcon>{hoveredCard === index ? <LinkDarkIcon /> : <ArrowRightIcon />}</FeatureCardIcon>
              <Stack spacing={2}>
                <Typography
                  variant='h6'
                  color='text.primary'
                  fontWeight='600'
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.25rem' },
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  {truncateText(card.description, 110)}
                </Typography>
              </Stack>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResumeGeneratorPage;
