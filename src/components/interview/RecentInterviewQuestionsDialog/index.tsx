'use client';

import React from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import MuiButton from '@/components/UI/MuiButton';

import {
    ActionContainer,
    AnswerText,
    DialogContainer,
    HeaderContainer,
    QuestionBadge,
    QuestionCardInner,
    QuestionDivider,
    QuestionHeading,
    QuestionRow,
    QuestionTexts,
    QuestionTitle,
    StackContainer,
    StackContent,
    StyledQuestionCard,
} from './styled';

export interface RecentInterviewQuestionsDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

interface QuestionCardProps {
    number: number;
    name?: string;
    question?: string;
    answer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, name, question = 'Question', answer }) => {
    return (
        <StyledQuestionCard>
            <QuestionCardInner>
                <QuestionRow>
                    <QuestionBadge>{number}</QuestionBadge>
                    <QuestionTexts>
                        <QuestionHeading variant='subtitle2'>{question}</QuestionHeading>
                        {name && (
                            <QuestionTitle variant='caption'>{name}</QuestionTitle>
                        )}
                    </QuestionTexts>
                </QuestionRow>
                {answer && (
                    <AnswerText variant='body2'>
                        Answer: {answer}
                    </AnswerText>
                )}
            </QuestionCardInner>
            <QuestionDivider />
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

const RecentInterviewQuestionsDialog: React.FC<RecentInterviewQuestionsDialogProps> = ({ open, onClose, title }) => {
    return (
        <DialogContainer onClose={onClose} open={open} maxWidth='sm'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='subtitle1' fontWeight={500}>
                        Interview Questions
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </HeaderContainer>

                <StackContent>
                    <InterviewQuestionsTabContent />
                </StackContent>

                <ActionContainer direction='row'>
                    <MuiButton fullWidth color='secondary' variant='contained' onClick={onClose}>
                        Download
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
};

export default RecentInterviewQuestionsDialog;
