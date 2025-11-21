'use client';

import React, { useState } from 'react';

import { Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowRightIcon from '@/assets/images/icons/arrow-right.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { PublicRoutes } from '@/config/routes';

import {
  Container,
  HeaderSection,
  FeatureCard,
  FeatureCardContent,
  NavigationListItem,
  NavigationListItemLeft,
  NavigationListItemRight,
} from './styled';

const MoreFeaturesPage = () => {
  const router = useRouter();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    );
  };

  const featureCards = [
    {
      id: 'resume-template',
      title: 'Resume Template',
      description: 'Create professional, customizable resume templates with modern design and flexible layout options.',
    },
    {
      id: 'job-suggestions',
      title: 'Job Position Suggestions',
      description: 'Get personalized job position recommendations based on your resume content and skills.',
    },
    {
      id: 'learning-hub',
      title: 'Learning Hub',
      description: 'Explore tailored learning paths, tutorials, and resources to improve required skills.',
    },
  ];

  const navigationItems = [
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
        <Typography variant='h5' color='text.primary' fontWeight='700'>
          More Features
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          You can utilize these features with your resume.
        </Typography>
      </HeaderSection>

      <Stack spacing={2} mt={2}>
        {featureCards.map((card) => (
          <FeatureCard key={card.id}>
            <MuiCheckbox
              size='medium'
              checked={selectedFeatures.includes(card.id)}
              onChange={() => handleFeatureToggle(card.id)}
            />
            <FeatureCardContent>
              <Typography variant='subtitle1' color='text.primary' fontWeight={500}>
                {card.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {card.description}
              </Typography>
            </FeatureCardContent>
          </FeatureCard>
        ))}
      </Stack>

      <Stack spacing={2} mt={2}>
        {navigationItems.map((item, index) => (
          <NavigationListItem key={index}>
            <NavigationListItemLeft>
              <Typography variant='subtitle1' color='text.primary' fontWeight={500}>
                {item.title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {item.description}
              </Typography>
            </NavigationListItemLeft>
            <NavigationListItemRight>
              <ArrowRightIcon />
            </NavigationListItemRight>
          </NavigationListItem>
        ))}
      </Stack>

      <Box mt={4} textAlign='center'>
        <MuiButton variant='contained' size='large' onClick={() => router.push(PublicRoutes.resumeGenerator)}>
          Resume Generator
        </MuiButton>
      </Box>
    </Container>
  );
};

export default MoreFeaturesPage;
