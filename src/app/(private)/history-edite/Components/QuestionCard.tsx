import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import { AnswerText, QuestionBadge, QuestionCard as StyledQuestionCard, QuestionTexts, QuestionTitle } from '../styled';

interface QuestionCardProps {
  number: number;
  name?: string;
  question?: string;
  answer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, name, question = 'Question', answer }) => {
  return (
    <StyledQuestionCard>
      <Stack gap={1.5} width='100%' pb={2}>
        <Stack direction='row' alignItems='flex-start' gap={2} width='100%'>
          <QuestionBadge>{number}</QuestionBadge>
          <QuestionTexts>
            <Typography variant='subtitle2' fontWeight={500} color='text.primary'>
              {question}
            </Typography>
            {name && (
              <QuestionTitle variant='caption' fontWeight={400} color='text.secondary'>
                {name}
              </QuestionTitle>
            )}
          </QuestionTexts>
        </Stack>
        {answer && (
          <AnswerText variant='body2' fontWeight={500} color='text.primary'>
            Answer: {answer}
          </AnswerText>
        )}
      </Stack>
      <Divider sx={{ borderColor: 'grey.100', width: '100%' }} />
    </StyledQuestionCard>
  );
};

export default QuestionCard;
