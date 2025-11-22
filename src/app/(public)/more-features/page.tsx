'use client';

import React, { useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import LinksIcon from '@/assets/images/icons/links.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';

import {
  Container,
  HeaderSection,
  FeatureCard,
  FeatureCardContent,
  NavigationListItem,
  NavigationListItemContent,
} from './styled';

const MoreFeaturesPage = () => {
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
      description: 'Practice speaking and answering questions verbally with AI-based feedback on   .',
    },
  ];
  const router = useRouter();

  return (
    <Container>
      <HeaderSection>
        <Typography variant='h5' color='text.primary' fontWeight='700' mt={0.5}>
          More Features
        </Typography>
        <Typography variant='h6' color='text.primary' mt={1}>
          You can utilize these features with your resume.{' '}
        </Typography>
      </HeaderSection>

      <Stack spacing={2} mt={2}>
        {featureCards.map((card) => (
          <FeatureCard key={card.id}>
            <FeatureCardContent>
              <MuiCheckbox
                size='medium'
                checked={selectedFeatures.includes(card.id)}
                onChange={() => handleFeatureToggle(card.id)}
                label={card.title}
              />
              <Typography variant='body2' color='text.secondary' ml={1}>
                {card.description}
              </Typography>
            </FeatureCardContent>
          </FeatureCard>
        ))}
      </Stack>

      <Stack spacing={2} mt={2}>
        {navigationItems.map((item, index) => (
          <NavigationListItem key={index}>
            <NavigationListItemContent>
              <Typography variant='subtitle1' color='text.primary' fontWeight={500}>
                {item.title}
              </Typography>
              <LinksIcon />
            </NavigationListItemContent>
            <Typography variant='body2' color='text.secondary' pl={-3}>
              {item.description}
            </Typography>
          </NavigationListItem>
        ))}
      </Stack>

      <Stack mt={4} alignItems='center'>
        <MuiButton variant='contained' size='large' onClick={() => router.push('/resume-generator')}>
          Generate Resume
        </MuiButton>
      </Stack>
    </Container>
  );
};

export default MoreFeaturesPage;
