import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { useTranslatedSummary } from '@/components/Landing/Wizard/Step3/ResumeEditor/hooks/useTranslatedSummary';

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

type Locale = 'en' | 'fa';

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
  dir?: 'rtl' | 'ltr';
  noSuggestionsText?: string;
  coinLabel?: string;
  answerLabel?: string;
  locale?: Locale;
}

const ResumeTemplatesRight: FunctionComponent<ResumeTemplatesRightProps> = ({
  suggestions,
  getChecked,
  onToggle,
  dir = 'ltr',
  noSuggestionsText = 'No feature suggestions available.',
  coinLabel = 'Coin:',
  answerLabel = 'Answer:',
  locale = 'en',
}) => {
  const isRtl = dir === 'rtl';

  if (!suggestions || suggestions.length === 0) {
    return (
      <Typography variant='subtitle2' color='text.secondary' sx={{ textAlign: isRtl ? 'right' : 'left' }}>
        {noSuggestionsText}
      </Typography>
    );
  }

  return (
    <>
      {suggestions.map((suggestion) => (
        <RightSuggestionRow
          key={suggestion.id}
          suggestion={suggestion}
          getChecked={getChecked}
          onToggle={onToggle}
          dir={dir}
          isRtl={isRtl}
          coinLabel={coinLabel}
          answerLabel={answerLabel}
          locale={locale}
        />
      ))}
    </>
  );
};

interface RightSuggestionRowProps {
  suggestion: MoreFeatureSuggestion;
  getChecked?: (s: MoreFeatureSuggestion) => boolean;
  onToggle?: (s: MoreFeatureSuggestion, checked: boolean) => void;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  coinLabel: string;
  answerLabel: string;
  locale: Locale;
}

function RightSuggestionRow({
  suggestion,
  getChecked,
  onToggle,
  dir,
  isRtl,
  coinLabel,
  answerLabel,
  locale,
}: RightSuggestionRowProps) {
  const { displayText: titleText } = useTranslatedSummary(suggestion.title, locale);
  const { displayText: descriptionText } = useTranslatedSummary(suggestion.description, locale);
  return (
    <Box
      dir={dir}
      sx={{
        border: `1px solid`,
        borderColor: 'grey.100',
        borderRadius: '8px',
        mb: 2,
        direction: dir,
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      <JobSuggestionsContainer sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <JobSuggestionsLeft>
          <JobSuggestionsHeader sx={{ alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
            <MuiCheckbox
              checked={getChecked?.(suggestion)}
              onChange={(_, checked) => onToggle?.(suggestion, checked)}
              label={
                <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                  {titleText}
                </Typography>
              }
            />
            <Typography
              variant='subtitle2'
              color='text.primary'
              fontWeight='400'
              mt={2}
              sx={{ marginLeft: isRtl ? 0 : 0.7, marginRight: isRtl ? 0.7 : 0 }}
            >
              {descriptionText}
            </Typography>
          </JobSuggestionsHeader>
          <Typography variant='subtitle2' color='text.secondary' fontWeight='500'>
            {coinLabel} {suggestion.coin ?? 0}
          </Typography>
        </JobSuggestionsLeft>
        <JobSuggestionsRight>
          <CardsWrapper>
            {(suggestion.cards || []).map((card) => (
              <TranslatedCard key={card.id} card={card} dir={dir} isRtl={isRtl} answerLabel={answerLabel} locale={locale} />
            ))}
          </CardsWrapper>
        </JobSuggestionsRight>
      </JobSuggestionsContainer>
    </Box>
  );
}

function TranslatedCard({
  card,
  dir,
  isRtl,
  answerLabel,
  locale,
}: {
  card: MoreFeatureCard;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  answerLabel: string;
  locale: Locale;
}) {
  const { displayText: cardTitleText } = useTranslatedSummary(card.title, locale);
  const { displayText: cardAnswerText } = useTranslatedSummary(card.answer, locale);
  return (
    <SuggestionCard>
      <SuggestionCardHeader sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <NumberBadge>{card.number}</NumberBadge>
        <Box>
          <Typography variant='caption' fontWeight='500' color='text.primary'>
            {cardTitleText}
          </Typography>
        </Box>
      </SuggestionCardHeader>
      <Typography variant='caption' color='text.primary' fontWeight='500'>
        <Box component='span' sx={{ fontWeight: 400, color: 'text.primary' }}>
          {answerLabel}{' '}
        </Box>
        {cardAnswerText}
      </Typography>
    </SuggestionCard>
  );
}

export default ResumeTemplatesRight;
