import React from 'react';

import { Divider, Stack, Typography } from '@mui/material';

import CheckCircleIcon from '@/assets/images/icons/check-circle.svg';

import {
    VoiceAnswerText,
    VoiceQuestionBadge,
    VoiceQuestionCard as StyledQuestionCard,
    VoiceQuestionTexts,
    VoiceQuestionTitle,
} from './styled';

export interface InterviewQuestionItem {
    number: number;
    name?: string;
    question: string;
    answer?: string;
    meta?: Array<{ title: string; label: string }>;
    status?: { label: string; value: string };
    audioBase64?: string;
}

interface InterviewQuestionsListProps {
    items?: InterviewQuestionItem[];
}

const QuestionCard: React.FC<InterviewQuestionItem> = ({ number, name, question, answer, meta, status, audioBase64 }) => {
    const metaEntries = meta ?? [];
    const audioSrc = audioBase64 ? `data:audio/mp3;base64,${audioBase64}` : null;

    return (
        <StyledQuestionCard>
            <Stack gap={1.5} width='100%' pb={2}>
                <Stack direction='row' alignItems='flex-start' gap={1} width='100%'>
                    <VoiceQuestionBadge>{number}</VoiceQuestionBadge>
                    <VoiceQuestionTexts>
                        <Typography variant='subtitle2' fontWeight={492} color='text.primary' mt={1}>
                            {question}
                        </Typography>
                        {name && (
                            <VoiceQuestionTitle variant='caption' fontWeight={400} color='text.secondary'>
                                {name}
                            </VoiceQuestionTitle>
                        )}
                    </VoiceQuestionTexts>
                </Stack>
                {answer && (
                    <VoiceAnswerText variant='body2' fontWeight={400} color='text.primary' ml={1}>
                        Answer: {answer}
                    </VoiceAnswerText>
                )}
                {audioSrc && (
                    <audio controls preload='none' style={{ width: '100%' }}>
                        <source src={audioSrc} type='audio/mp3' />
                    </audio>
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

const VoiceQuestionsList: React.FC<InterviewQuestionsListProps> = ({ items = DEFAULT_ITEMS }) => {
    return (
        <>
            {items.map((item) => (
                <QuestionCard key={item.number} {...item} />
            ))}
        </>
    );
};

export default VoiceQuestionsList;

