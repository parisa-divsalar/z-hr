import React from 'react';

import { Stack, Typography } from '@mui/material';

import { AnswerText, QuestionBadge, QuestionCard as StyledQuestionCard, QuestionTexts } from '../styled';

interface QuestionCardProps {
  number: number;
  name?: string;
  question?: string;
  answer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, question = 'Question', answer }) => {
  return (
    <StyledQuestionCard>
      <Stack gap={1.5} width='100%' pb={2}>
        <Stack direction='row' alignItems='flex-start' gap={2} width='100%'>
          <QuestionBadge>{number}</QuestionBadge>
          <QuestionTexts>
            <Typography variant='subtitle2' fontWeight={500} color='text.primary' mt={0.5}>
              {question}
            </Typography>
            <AnswerText variant='subtitle2' fontWeight={400} color='text.primary'>
              Answer {answer}
            </AnswerText>
          </QuestionTexts>
        </Stack>
      </Stack>
    </StyledQuestionCard>
  );
};

export default QuestionCard;
