import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { generateFakeUUIDv4 } from '@/utils/generateUUID';

import {
  CardsWrapper,
  JobSuggestionsContainer,
  JobSuggestionsHeader,
  JobSuggestionsLeft,
  JobSuggestionsRight,
  NumberBadge,
  SuggestionCard,
  SuggestionCardHeader,
} from '../styled';

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
        answer: 'I thrive in and  working with.',
      },
      {
        number: 2,
        title: 'Questions',
        tag: 'Soft skill',
        answer: 'I thrive in and  working with.',
      },
      {
        number: 3,
        title: 'Questions',
        tag: 'Soft skill',
        answer: 'I thrive in and  working with.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I thrive in and  working with.',
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
        answer: 'I thrive in and  working with.',
      },
      {
        number: 2,
        title: 'Leadership',
        tag: 'Soft skill',
        answer: 'I thrive in and  working with.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I thrive in and enjoy  with.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I thrive in and enjoy  with.',
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
        answer: 'I thrive in and enjoy  with.',
      },
      {
        number: 2,
        title: 'Networking',
        tag: 'Professional development',
        answer: 'I thrive in and enjoy  with.',
      },
      {
        number: 3,
        title: 'Continuous Learning',
        tag: 'Education  ',
        answer: 'I thrive in and enjoy  with.',
      },
      {
        number: 3,
        title: 'Project Management',
        tag: 'Soft skill',
        answer: 'I thrive in and enjoy  with.',
      },
    ],
  },
];

const ResumeTemplatesRight: FunctionComponent = () => {
  return (
    <>
      {jobSuggestions.map((suggestion) => (
        <Box key={suggestion.id} sx={{ border: `1px solid`, borderColor: 'grey.100', borderRadius: '8px', mb: 2 }}>
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
                <Typography variant='subtitle2' color='text.primary' fontWeight='400' mt={2} ml={0.7}>
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
                        <Typography variant='caption' fontWeight='500' color='text.primary'>
                          {card.title}
                        </Typography>
                        {/*<SoftSkillTag>{card.tag}</SoftSkillTag>*/}
                      </Box>
                    </SuggestionCardHeader>
                    <Typography variant='caption' color='text.primary' fontWeight='500'>
                      <Box component='span' sx={{ fontWeight: 400, color: 'text.primary' }}>
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
    </>
  );
};

export default ResumeTemplatesRight;
