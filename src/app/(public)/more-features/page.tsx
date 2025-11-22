'use client';

import { Typography, Grid, Box } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';
import ResumeTemplates from '@/components/ResumeTemplates';

import {
  JobSuggestionsContainer,
  JobSuggestionsLeft,
  JobSuggestionsHeader,
  MoreButton,
  JobSuggestionsRight,
  CardsWrapper,
  SuggestionCard,
  SuggestionCardHeader,
  NumberBadge,
  SoftSkillTag,
} from './styled';

const MoreFeaturesPage = () => {
  const jobSuggestions = [
    {
      id: 1,
      title: "Job Position Suggestions",
      description: "Get personalized job recommendations based on your skills and experience",
      cards: [
        {
          number: 1,
          title: "Questions",
          tag: "Soft skill",
          answer: "Communication is key. I excel at articulating ideas clearly and listening actively."
        },
        {
          number: 2,
          title: "Questions",
          tag: "Soft skill",
          answer: "I thrive in collaborative environments and enjoy working with diverse teams."
        },
        {
          number: 3,
          title: "Questions",
          tag: "Soft skill",
          answer: "Problem-solving is my strength. I approach challenges methodically."
        }
      ]
    },
    {
      id: 2,
      title: "Skill Assessment Tools",
      description: "Evaluate and improve your professional skills with our comprehensive tools",
      cards: [
        {
          number: 1,
          title: "Technical Skills",
          tag: "Hard skill",
          answer: "I have strong proficiency in React, TypeScript, and modern web development frameworks."
        },
        {
          number: 2,
          title: "Leadership",
          tag: "Soft skill",
          answer: "I excel at mentoring junior developers and leading cross-functional teams."
        },
        {
          number: 3,
          title: "Project Management",
          tag: "Soft skill",
          answer: "I use Agile methodologies to deliver projects on time and within budget."
        }
      ]
    },
    {
      id: 3,
      title: "Career Development",
      description: "Advance your career with personalized development plans and resources",
      cards: [
        {
          number: 1,
          title: "Goal Setting",
          tag: "Career planning",
          answer: "I set SMART goals and regularly review progress to ensure continuous growth."
        },
        {
          number: 2,
          title: "Networking",
          tag: "Professional development",
          answer: "I actively build and maintain professional relationships in my industry."
        },
        {
          number: 3,
          title: "Continuous Learning",
          tag: "Education",
          answer: "I dedicate time weekly to learning new technologies and industry trends."
        }
      ]
    }
  ];

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        {jobSuggestions.map((suggestion) => (
          <Box key={suggestion.id} sx={{ border: `1px solid`, borderColor: 'grey.200', borderRadius: '8px', mb: 2 }}>
            <JobSuggestionsContainer>
            <JobSuggestionsLeft>
              <JobSuggestionsHeader>
                <MuiCheckbox
                  label={
                    <Typography variant='h6' fontWeight='600' color='text.primary'>
                      {suggestion.title}xcvxcvxc
                    </Typography>
                  }
                  helperText={suggestion.description}
                />
              </JobSuggestionsHeader>
              <MoreButton>More</MoreButton>
            </JobSuggestionsLeft>
            <JobSuggestionsRight>
              <CardsWrapper>
                {suggestion.cards.map((card) => (
                  <SuggestionCard key={card.number}>
                    <SuggestionCardHeader>
                      <NumberBadge>{card.number}</NumberBadge>
                      <Box>
                        <Typography variant='body2' fontWeight='600' color='text.primary' sx={{ fontSize: '12px' }}>
                          {card.title}
                        </Typography>
                        <SoftSkillTag>{card.tag}</SoftSkillTag>
                      </Box>
                    </SuggestionCardHeader>
                    <Typography variant='body2' color='text.secondary' sx={{ fontSize: '11px', lineHeight: 1.2 }}>
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

      <Grid size={{ xs: 6 }}>
        <ResumeTemplates />
      </Grid>
    </Grid>
  );
};

export default MoreFeaturesPage;
