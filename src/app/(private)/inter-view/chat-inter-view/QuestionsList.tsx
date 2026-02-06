import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';

import { AnswerText, QuestionBadge, QuestionCard as StyledQuestionCard, QuestionTexts, QuestionTitle } from './styled';

export interface InterviewQuestionItem {
    number: number;
    name?: string;
    question: string;
    answer?: string;
    meta?: Array<{ title: string; label: string }>;
    status?: { label: string; value: string };
}

interface InterviewQuestionsListProps {
    items?: InterviewQuestionItem[];
}

const QuestionCard: React.FC<InterviewQuestionItem> = ({ number, name, question, answer, meta, status }) => {
    const metaEntries = meta ?? [];

    return (
        <StyledQuestionCard>
            <Stack gap={1.5} width='100%' pb={2}>
                <Stack direction='row' alignItems='flex-start' gap={1} width='100%'>
                    <QuestionBadge>{number}</QuestionBadge>
                    <QuestionTexts>
                        <Typography variant='subtitle2' fontWeight={492} color='text.primary' mt={1}>
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
                {(metaEntries.length > 0 || status) && (
                    <Stack direction='row' width='100%' justifyContent='space-between' alignItems='center'>
                        {metaEntries.length > 0 && (
                            <Stack direction='row' gap={1} justifyContent='flex-start' alignItems='center'>
                                {metaEntries.map((entry, index) => (
                                    <React.Fragment key={`${entry.title}-${entry.label}-${index}`}>
                                        {index > 0 && (
                                            <Divider
                                                orientation='vertical'
                                                flexItem
                                                sx={{ borderColor: 'grey.100', mx: 1, height: 16, alignSelf: 'center', mt: 1 }}
                                            />
                                        )}
                                        <Typography variant='subtitle2' fontWeight={400} color='text.secondary' mt={1}>
                                            {entry.title}
                                        </Typography>
                                        <Typography variant='subtitle2' fontWeight={492} color='text.primary' mt={1}>
                                            {entry.label}
                                        </Typography>
                                    </React.Fragment>
                                ))}
                            </Stack>
                        )}

                        {status && (
                            <Stack justifyContent='flex-end' alignItems='center' direction='row' gap={1}>
                                <CheckCircleIcon sx={{ alignSelf: 'center' }} />
                                <Typography variant='subtitle2' fontWeight={400} color='text.secondary'>
                                    {status.label}
                                </Typography>
                                <Typography variant='subtitle2' fontWeight={492} color='text.primary'>
                                    {status.value}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                )}
                <Divider sx={{ borderColor: 'grey.100', width: '100%' }} />
            </Stack>
        </StyledQuestionCard>
    );
};

const DEFAULT_ITEMS: InterviewQuestionItem[] = [1, 2, 3, 4, 5].map((num) => ({
    number: num,
    name: 'Soft skill',
    question: 'Questions',
    meta: [{ title: 'Completeness', label: '5' }],
    status: { label: 'Score', value: '5' },
    answer: 'Access common and position-specific interview questions to prepare effectively.',
}));

const QuestionsList: React.FC<InterviewQuestionsListProps> = ({ items = DEFAULT_ITEMS }) => {
    return (
        <>
            {items.map((item) => (
                <QuestionCard key={item.number} {...item} />
            ))}
        </>
    );
};

export default QuestionsList;
