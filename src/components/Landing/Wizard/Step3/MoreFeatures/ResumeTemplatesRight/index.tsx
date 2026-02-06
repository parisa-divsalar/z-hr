import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';

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

export type MoreFeatureCard = {
  id: number | string;
  number: number;
  title: string;
  tag?: string;
  answer: string;
};

export type MoreFeatureSuggestion = {
  id: number | string;
  title: string;
  description: string;
  coin?: number;
  cards: MoreFeatureCard[];
};

interface ResumeTemplatesRightProps {
  suggestions: MoreFeatureSuggestion[];
  getChecked?: (suggestion: MoreFeatureSuggestion) => boolean;
  onToggle?: (suggestion: MoreFeatureSuggestion, checked: boolean) => void;
}

const ResumeTemplatesRight: FunctionComponent<ResumeTemplatesRightProps> = ({ suggestions, getChecked, onToggle }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Typography variant='subtitle2' color='text.secondary'>
        No feature suggestions available.
      </Typography>
    );
  }

  return (
    <>
      {suggestions.map((suggestion) => (
        <Box key={suggestion.id} sx={{ border: `1px solid`, borderColor: 'grey.100', borderRadius: '8px', mb: 2 }}>
          <JobSuggestionsContainer>
            <JobSuggestionsLeft>
              <JobSuggestionsHeader>
                <MuiCheckbox
                  checked={getChecked?.(suggestion)}
                  onChange={(_, checked) => onToggle?.(suggestion, checked)}
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
              <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
                Coin: {suggestion.coin ?? 0}
              </Typography>
            </JobSuggestionsLeft>
            <JobSuggestionsRight>
              <CardsWrapper>
                {(suggestion.cards || []).map((card) => (
                  <SuggestionCard key={card.id}>
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
