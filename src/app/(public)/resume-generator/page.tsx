'use client';

import React from 'react';

import { Stack, Typography } from '@mui/material';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';

import {
  Container,
  HeaderSection,
  HeaderLeft,
  PurplePill,
  MainContent,
  ResumePreview,
  InfoTable,
  InfoRow,
  FitScoreBadge,
  ActionButtons,
  FeatureGrid,
  FeatureCard,
  FeatureCardIcon,
} from './styled';

const ResumeGeneratorPage = () => {
  const resumeInfo = [
    { label: 'Created:', value: '09/09/2025' },
    { label: 'Size:', value: '2.85 MB' },
    { label: 'Fit score:', value: '89%', isBadge: true },
    { label: 'Skill group:', value: 'Front-end' },
    { label: 'Experience level:', value: 'Mid-senior' },
  ];

  const featureCards = [
    {
      title: 'Resume Template',
      description: 'Create professional, customizable resume templates with modern design and flexible layout options.',
    },
    {
      title: 'Job Position Suggestions',
      description: 'Get personalized job position recommendations based on your resume content and skills.',
    },
    {
      title: 'Learning Hub',
      description: 'Explore tailored learning paths, tutorials, and resources to improve required skills.',
    },
    {
      title: 'Interview Questions',
      description: 'Access common and position-specific interview questions to prepare effectively.',
    },
    {
      title: 'Text Interview Practice (Chatbot)',
      description: 'Simulate real interview scenarios with an AI chatbot and receive instant feedback.',
    },
    {
      title: 'Voice Interview Practice',
      description: 'Practice speaking and answering questions verbally with AI-based feedback on tone and fluency.',
    },
  ];

  return (
    <Container>
      <HeaderSection>
        <HeaderLeft>
          <Typography variant='h4' color='text.primary' fontWeight='700'>
            Zayd Al-Mansoori's Resume
          </Typography>
          <PurplePill>
            AI Generation
          </PurplePill>
        </HeaderLeft>
        <MuiButton variant='outlined' endIcon={<ArrowRightIcon />}>
          Go to panel →
        </MuiButton>
      </HeaderSection>

      <MainContent>
        <ResumePreview>
          <Typography variant='body1' color='text.secondary'>
            Resume Preview
          </Typography>
        </ResumePreview>

        <InfoTable>
          {resumeInfo.map((info, index) => (
            <InfoRow key={index}>
              <Typography variant='body1' color='text.secondary' fontWeight='500'>
                {info.label}
              </Typography>
              {info.isBadge ? (
                <FitScoreBadge>
                  {info.value}
                </FitScoreBadge>
              ) : (
                <Typography variant='body1' color='text.primary'>
                  {info.value}
                </Typography>
              )}
            </InfoRow>
          ))}

          <ActionButtons>
            <MuiButton variant='outlined' size='large'>
              Edit
            </MuiButton>
            <MuiButton variant='contained' size='large' color='primary'>
              Download
            </MuiButton>
          </ActionButtons>
        </InfoTable>
      </MainContent>

      <FeatureGrid>
        {featureCards.map((card, index) => (
          <FeatureCard key={index}>
            <FeatureCardIcon>
              <ArrowRightIcon style={{ transform: 'rotate(-45deg)' }} />
            </FeatureCardIcon>
            <Stack spacing={1}>
              <Typography variant='h6' color='text.primary' fontWeight='600'>
                {card.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {card.description}
              </Typography>
            </Stack>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Container>
  );
};

export default ResumeGeneratorPage;
