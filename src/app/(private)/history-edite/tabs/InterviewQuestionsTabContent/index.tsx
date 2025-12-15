import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import {
    AnswerText,
    QuestionBadge,
    QuestionCard as StyledQuestionCard,
    QuestionTexts,
    QuestionTitle,
} from '../../styled';

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
                <Stack direction='row' alignItems='flex-start' gap={1} width='100%'>
                    <QuestionBadge>{number}</QuestionBadge>
                    <QuestionTexts>
                        <Typography variant='subtitle2' fontWeight={500} color='text.primary' mt={1}>
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
                    <AnswerText variant='body2' fontWeight={400} color='text.primary' ml={1}>
                        Answer: {answer}
                    </AnswerText>
                )}
            </Stack>
            <Divider sx={{ borderColor: 'grey.100', width: '100%', marginBottom: '3px' }} />
        </StyledQuestionCard>
    );
};

const InterviewQuestionsTabContent = () => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <QuestionCard
                        key={num}
                        number={num}
                        name='Soft skill'
                        question='Questions'
                        answer='Access common and position-specific interview questions to prepare effectively.'
                    />
                ))}
            </Grid>
        </Grid>
    );
};

export default InterviewQuestionsTabContent;
