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
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

interface MoreFeaturesProps {
    onBack: () => void;
    onSubmit: () => void;
}

const RIGHT_PREVIEW_WIDTH_PX = 126 * 2 + 12; // matches ResumeCardGrid (2 cols + gap)

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = ({ onBack, onSubmit }) => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).moreFeatures;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';

    const learningHubTemplates = [
        {
            id: '1',
            title: t.learningHub.templateTitle,
            level: t.learningHub.level,
            price: t.learningHub.price,
            isBookmarked: false,
        },
        {
            id: '2',
            title: t.learningHub.templateTitle,
            level: t.learningHub.level,
            price: t.learningHub.price,
            isBookmarked: false,
        },
        {
            id: '3',
            title: t.learningHub.templateTitle,
            level: t.learningHub.level,
            price: t.learningHub.price,
            isBookmarked: false,
        },
        {
            id: '4',
            title: t.learningHub.templateTitle,
            level: t.learningHub.level,
            price: t.learningHub.price,
            isBookmarked: false,
        },
    ];

    const suggestionCards = [
        { number: 1, title: t.interviewQuestions.questions, answer: t.interviewQuestions.answer },
        { number: 2, title: t.interviewQuestions.questions, answer: t.interviewQuestions.answer },
        { number: 3, title: t.interviewQuestions.questions, answer: t.interviewQuestions.answer },
    ];

    return (
        <Box dir={dir} sx={{ width: '100%' }}>
            <Stack textAlign='center' mt={2} mb={2} sx={{ px: { xs: 2, md: 0 } }}>
                <Typography variant='h5' color='text.primary' fontWeight='500' mt={0.5}>
                    {t.title}
                </Typography>
                <Typography variant='h6' color='text.primary' mt={2} fontWeight='400'>
                    {t.subtitle}
                </Typography>
            </Stack>

            <Stack spacing={2.5} mt={2}>
                <FeatureRow
                    title={t.jobPositionSuggestions.title}
                    description={t.jobPositionSuggestions.description}
                    coinText={t.jobPositionSuggestions.coinText}
                    moreLabel={t.more}
                    rightWidth={RIGHT_PREVIEW_WIDTH_PX}
                    right={
                        <SuggestionPreview cards={suggestionCards} answerLabel={t.answerLabel} />
                    }
                />

                <FeatureRow
                    title={t.learningHub.title}
                    description={t.learningHub.description}
                    coinText={t.learningHub.coinText}
                    moreLabel={t.more}
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
                                            <MuiButton text={t.learningHub.more} variant='outlined' size='small' />
                                        </Box>
                                    </CardContent>
                                </ResumeCard>
                            ))}
                        </ResumeCardGrid>
                    }
                />

                <FeatureRow
                    title={t.interviewQuestions.title}
                    description={t.interviewQuestions.description}
                    coinText={t.interviewQuestions.coinText}
                    moreLabel={t.more}
                    rightWidth={RIGHT_PREVIEW_WIDTH_PX}
                    right={
                        <SuggestionPreview cards={suggestionCards} answerLabel={t.answerLabel} />
                    }
                />
            </Stack>

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                gap={{ xs: 2, md: 3 }}
                justifyContent='center'
                alignItems={{ xs: 'stretch', md: 'center' }}
                p={{ xs: 3, md: 5 }}
                sx={{ width: '100%' }}
            >
                <MuiButton
                    text={t.back}
                    variant='outlined'
                    color='secondary'
                    size='large'
                    startIcon={dir === 'ltr' ? <ArrowBackIcon style={{ color: '#111113' }} /> : undefined}
                    endIcon={dir === 'rtl' ? <ArrowBackIcon style={{ color: '#111113' }} /> : undefined}
                    onClick={onBack}
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                />
                <MuiButton
                    text={t.submit}
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={onSubmit}
                    sx={{ width: { xs: '100%', md: 'auto' } }}
                />
            </Stack>
        </Box>
    );
};

export default MoreFeatures;
