'use client';

import React, { FunctionComponent } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import RectangleImage from '@/assets/images/design/RectangleImage.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import FeatureRow from '@/components/MoreFeature/FeatureRow';
import {
    BookmarkIcon,
    CardContent,
    CardImage,
    JobTitle,
    PriceTag,
    ResumeCard,
    ResumeCardGrid,
} from '@/components/MoreFeature/ResumeTemplates/styled';
import SuggestionPreview from '@/components/MoreFeature/SuggestionPreview';
import MuiButton from '@/components/UI/MuiButton';

interface MoreFeaturesProps {
    onBack: () => void;
    onSubmit: () => void;
}

const RIGHT_PREVIEW_WIDTH_PX = 126 * 2 + 12; // matches ResumeCardGrid (2 cols + gap)

const learningHubTemplates = [
    { id: '1', title: 'Front-end', level: 'Mid-senior', price: '$20', isBookmarked: false },
    { id: '2', title: 'Front-end', level: 'Mid-senior', price: '$20', isBookmarked: false },
    { id: '3', title: 'Front-end', level: 'Mid-senior', price: '$20', isBookmarked: false },
    { id: '4', title: 'Front-end', level: 'Mid-senior', price: '$20', isBookmarked: false },
];

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = ({ onBack, onSubmit }) => {
    return (
        <>
            <Stack textAlign='center' mt={2} mb={2}>
                <Typography variant='h5' color='text.primary' fontWeight='500' mt={0.5}>
                    More Features
                </Typography>
                <Typography variant='h6' color='text.primary' mt={2} fontWeight='400'>
                    You can utilize these features with your resume
                </Typography>
            </Stack>

            <Stack spacing={2.5} mt={2}>
                <FeatureRow
                    title='Job Position Suggestions'
                    description='Get personalized job position recommendations based on your resume content and skills.'
                    coinText='5 Coin'
                    rightWidth={RIGHT_PREVIEW_WIDTH_PX}
                    right={
                        <SuggestionPreview
                            cards={[
                                { number: 1, title: 'Questions', answer: 'Find common and role-specific questions' },
                                { number: 2, title: 'Questions', answer: 'Find common and role-specific questions' },
                                { number: 3, title: 'Questions', answer: 'Find common and role-specific questions' },
                            ]}
                        />
                    }
                />

                <FeatureRow
                    title='Learning Hub'
                    description="Explore tailored learning paths, tutorials, and resources to boost your skills. Whether you're diving into a new tool or deepening your knowledge."
                    coinText='5 Coin'
                    rightWidth={RIGHT_PREVIEW_WIDTH_PX}
                    right={
                        <ResumeCardGrid>
                            {learningHubTemplates.map((template) => (
                                <ResumeCard key={template.id}>
                                    <CardImage>
                                        <RectangleImage />
                                    </CardImage>
                                    <CardContent>
                                        <Box display='flex' justifyContent='space-between' alignItems='flex-start'>
                                            <Box flex={1}>
                                                <JobTitle>
                                                    <Typography variant='caption' fontWeight='400' color='text.primary'>
                                                        {template.title}
                                                    </Typography>
                                                </JobTitle>

                                                <Typography variant='caption' fontWeight='400' color='text.secondary'>
                                                    {template.level}
                                                </Typography>
                                            </Box>
                                            <BookmarkIcon>
                                                <svg
                                                    width='20'
                                                    height='20'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path
                                                        d='M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z'
                                                        fill={template.isBookmarked ? '#3b82f6' : '#d1d5db'}
                                                    />
                                                </svg>
                                            </BookmarkIcon>
                                        </Box>

                                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                                            <PriceTag>
                                                <Typography variant='caption' fontWeight='600' color='primary.main'>
                                                    {template.price}
                                                </Typography>
                                            </PriceTag>
                                            <MuiButton text='More' variant='outlined' size='small' />
                                        </Box>
                                    </CardContent>
                                </ResumeCard>
                            ))}
                        </ResumeCardGrid>
                    }
                />

                <FeatureRow
                    title='Interview Questions'
                    description='Review common and role-specific interview questions to boost your confidence and improve your chances of success.'
                    coinText='5 Coin'
                    rightWidth={RIGHT_PREVIEW_WIDTH_PX}
                    right={
                        <SuggestionPreview
                            cards={[
                                { number: 1, title: 'Questions', answer: 'Find common and role-specific questions' },
                                { number: 2, title: 'Questions', answer: 'Find common and role-specific questions' },
                                { number: 3, title: 'Questions', answer: 'Find common and role-specific questions' },
                            ]}
                        />
                    }
                />
            </Stack>

            <Stack direction='row' gap={3} justifyContent='center' p={5}>
                <MuiButton
                    text='Back'
                    variant='outlined'
                    color='secondary'
                    size='large'
                    startIcon={<ArrowBackIcon style={{ color: '#111113' }} />}
                    onClick={onBack}
                />
                <MuiButton text='Submit' variant='contained' color='secondary' size='large' onClick={onSubmit} />
            </Stack>
        </>
    );
};

export default MoreFeatures;
