'use client';

import { Typography, Grid, Box } from '@mui/material';



import MuiCheckbox from '@/components/UI/MuiCheckbox';

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
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }} sx={{ border: `1px solid`, borderColor: 'grey.200', borderRadius: '8px' }}>
        <JobSuggestionsContainer>
          <JobSuggestionsLeft>
            <JobSuggestionsHeader>
              <MuiCheckbox
                label={
                  <Typography variant='h6' fontWeight='600' color='text.primary'>
                    Job Position Suggestions
                  </Typography>
                }
                helperText="Get personalized job recommendations based on your skills and experience"
              />
            </JobSuggestionsHeader>
            <MoreButton>More</MoreButton>
          </JobSuggestionsLeft>
          <JobSuggestionsRight>
            <CardsWrapper>
              <SuggestionCard>
                <SuggestionCardHeader>
                  <NumberBadge>1</NumberBadge>
                  <Box>
                    <Typography variant='body2' fontWeight='600' color='text.primary' sx={{ fontSize: '12px' }}>
                      Questions
                    </Typography>
                    <SoftSkillTag>Soft skill</SoftSkillTag>
                  </Box>
                </SuggestionCardHeader>
                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '11px', lineHeight: 1.2 }}>
                  <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Answer:
                  </Box>
                  Communication is key. I excel at articulating ideas clearly and listening actively.
                </Typography>
              </SuggestionCard>

              <SuggestionCard>
                <SuggestionCardHeader>
                  <NumberBadge>2</NumberBadge>
                  <Box>
                    <Typography variant='body2' fontWeight='600' color='text.primary' sx={{ fontSize: '12px' }}>
                      Questions
                    </Typography>
                    <SoftSkillTag>Soft skill</SoftSkillTag>
                  </Box>
                </SuggestionCardHeader>
                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '11px', lineHeight: 1.2 }}>
                  <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Answer:{' '}
                  </Box>
                  I thrive in collaborative environments and enjoy working with diverse teams.
                </Typography>
              </SuggestionCard>
              <SuggestionCard>
                <SuggestionCardHeader>
                  <NumberBadge>3</NumberBadge>
                  <Box>
                    <Typography variant='body2' fontWeight='600' color='text.primary' sx={{ fontSize: '12px' }}>
                      Questions
                    </Typography>
                    <SoftSkillTag>Soft skill</SoftSkillTag>
                  </Box>
                </SuggestionCardHeader>
                <Typography variant='body2' color='text.secondary' sx={{ fontSize: '11px', lineHeight: 1.2 }}>
                  <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Answer:{' '}
                  </Box>
                  Problem-solving is my strength. I approach challenges methodically.
                </Typography>
              </SuggestionCard>
            </CardsWrapper>
          </JobSuggestionsRight>
        </JobSuggestionsContainer>
      </Grid>

      <Grid size={{ xs: 6 }} sx={{ border: `1px solid`, borderColor: 'grey.200', borderRadius: '8px' }}>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography>متن تستی چهارم</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MoreFeaturesPage;
