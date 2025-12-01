'use client';

import React, { FunctionComponent } from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';

import {
  CardsWrapper,
  JobSuggestionsContainer,
  JobSuggestionsHeader,
  JobSuggestionsLeft,
  JobSuggestionsRight,
  NumberBadge,
  SuggestionCard,
  SuggestionCardHeader,
} from '@/app/(private)/resume-builder/more/styled';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

interface MoreFeaturesProps {
  onBack: () => void;
  onSubmit: () => void;
}

const jobSuggestions = [
  {
    id: 1,
    title: 'Job Position Suggestions',
    description:
      'Choose from our professionally designed resume templates to make your application stand out.\n' + '\n',
    cards: [
      {
        number: 1,
        title: 'Questions',
        tag: 'Soft skill',
        answer: 'Communication is key. I excel at articulating ideas clearly and listening actively.',
      },
      {
        number: 2,
        title: 'Questions',
        tag: 'Soft skill',
        answer: 'I thrive in collaborative environments and enjoy working with.',
      },
      {
        number: 3,
        title: 'Questions',
        tag: 'Soft skill',
        answer: 'Problem-solving is my strength. I approach challenges metho.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I use Agile methodologies to deliver projects on  budget.',
      },
    ],
  },

  {
    id: 2,
    title: 'Skill Assessment Tools',
    description:
      'Choose from our professionally designed resume templates to make your application stand out.\n' + '\n',

    cards: [
      {
        number: 1,
        title: 'Technical Skills',
        tag: 'Hard skill',
        answer: 'I have strong proficiency in React, TypeScript, and modern .',
      },
      {
        number: 2,
        title: 'Leadership',
        tag: 'Soft skill',
        answer: 'I excel at mentoring junior developers and leading  teams.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I use Agile methodologies to deliver projects on  budget.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I use Agile methodologies to deliver projects on  budget.',
      },
    ],
  },
  {
    id: 3,
    title: 'Career Development',
    description:
      'Choose from our professionally designed resume templates to make your application stand out.\n' + '\n',

    cards: [
      {
        number: 1,
        title: 'Goal Setting',
        tag: 'Career planning',
        answer: 'I set SMART goals and regularly review progress to ensure .',
      },
      {
        number: 2,
        title: 'Networking',
        tag: 'Professional development',
        answer: 'I actively build and maintain professional relationships .',
      },
      {
        number: 3,
        title: 'Continuous Learning',
        tag: 'Education  ',
        answer: 'I dedicate time weekly to learning new technologies and .',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I use Agile methodologies to deliver projects on  budget.',
      },
    ],
  },
];

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = ({ onBack, onSubmit }) => {
  return (
    <Stack>
      <Stack textAlign='center' mt={2}>
        <Typography variant='h5' color='text.primary' fontWeight='600' mt={0.5}>
          More Features
        </Typography>
        <Typography variant='h6' color='text.primary' mt={2}>
          You can utilize these features with your resume
        </Typography>
      </Stack>

      <Grid container spacing={2} mt={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.100',
                p: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} color='text.primary'>
                Resume templates
              </Typography>
              <Typography variant='body2' color='text.secondary' mt={1}>
                Choose from AI‑optimized resume layouts tailored to your role and experience.
              </Typography>
            </Box>

            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.100',
                p: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} color='text.primary'>
                Smart sections
              </Typography>
              <Typography variant='body2' color='text.secondary' mt={1}>
                Add or remove sections like projects, certifications, and languages with one click.
              </Typography>
            </Box>

            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.100',
                p: 2,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} color='text.primary'>
                Export & share
              </Typography>
              <Typography variant='body2' color='text.secondary' mt={1}>
                Download your resume as PDF or share it with a secure link.
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Right side (Grid 6 of 12) - job suggestions list */}
        <Grid size={{ xs: 12, md: 6 }}>
          {jobSuggestions.map((suggestion) => (
            <Box key={suggestion.id} sx={{ border: `1px solid`, borderColor: 'grey.200', borderRadius: '8px', mb: 2 }}>
              <JobSuggestionsContainer>
                <JobSuggestionsLeft>
                  <JobSuggestionsHeader>
                    <MuiCheckbox
                      label={
                        <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                          {suggestion.title}
                        </Typography>
                      }
                    />
                    <Typography variant='subtitle2' color='text.primary' fontWeight='400' mt={1.5} ml={0.7}>
                      {suggestion.description}
                    </Typography>
                  </JobSuggestionsHeader>
                  <MuiButton
                    text='More'
                    variant='contained'
                    color='secondary'
                    sx={{ backgroundColor: '#F0F0F2', color: 'secondary.main' }}
                  />
                </JobSuggestionsLeft>
                <JobSuggestionsRight>
                  <CardsWrapper>
                    {suggestion.cards.map((card) => (
                      <SuggestionCard key={generateFakeUUIDv4()}>
                        <SuggestionCardHeader>
                          <NumberBadge>{card.number}</NumberBadge>
                          <Box>
                            <Typography variant='body2' fontWeight='600' color='text.primary'>
                              {card.title}
                            </Typography>
                          </Box>
                        </SuggestionCardHeader>
                        <Typography variant='body2' color='text.secondary'>
                          <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Answer:{' '}
                          </Box>
                          {card.answer}
                        </Typography>
                      </SuggestionCard>
                    ))}
                  </CardsWrapper>
                </JobSuggestionsRight>
              </JobSuggestionsContainer>
            </Box>
          ))}
        </Grid>
      </Grid>

      <Stack direction='row' spacing={2} justifyContent='center' p={4}>
        <MuiButton
          text='Back'
          variant='outlined'
          color='secondary'
          startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
          onClick={onBack}
        />
        <MuiButton text='Submit' variant='contained' color='secondary' onClick={onSubmit} />
      </Stack>
    </Stack>
  );
};

export default MoreFeatures;
