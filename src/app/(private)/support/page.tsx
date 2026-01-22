'use client';

import { type KeyboardEvent, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import { PageTitle } from '@/app/(private)/payment/styled';
import { GridContainer, ContentWrapper, SupportInfoCard, SupportRoot } from '@/app/(private)/support/styled';

import { accordionData } from './mockData';
import SupportAccordionItem from './SupportAccordionItem';

const contactDetails = [
    { label: 'Email', value: 'support@z-cv.com' },
    { label: 'Phone', value: '+1 (800) 123-4567' },
];

const Support = () => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(
        new Set(accordionData.filter((item) => item.defaultExpanded).map((item) => item.id)),
    );

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleKeyDown = (e: KeyboardEvent, id: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem(id);
        }
    };

    return (
        <SupportRoot>
            <PageTitle>
                <Typography component='h5' fontWeight='500' color='text.primary'>
                    FAQ
                </Typography>
                <Typography component='p' variant='body2' color='text.secondary'>
                    Answers to the questions we receive most often. Browse the topics below or reach out directly if you
                    need personalized help.
                </Typography>
            </PageTitle>
            <GridContainer>
                <ContentWrapper>
                    <SupportInfoCard>
                        <Typography variant='subtitle1' fontWeight='500'>
                            Still need help?
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            We respond within 24 hours and can walk you through any part of the platform.
                        </Typography>
                        <Stack direction='row' flexWrap='wrap' gap={3}>
                            {contactDetails.map((detail) => (
                                <Stack key={detail.label} spacing={0.5}>
                                    <Typography variant='caption' color='text.secondary'>
                                        {detail.label}
                                    </Typography>
                                    <Typography variant='subtitle2' color='text.primary'>
                                        {detail.value}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </SupportInfoCard>

                    {accordionData.map((item) => {
                        const isExpanded = expandedItems.has(item.id);

                        return (
                            <SupportAccordionItem
                                key={item.id}
                                item={item}
                                isExpanded={isExpanded}
                                onToggle={() => toggleItem(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                            />
                        );
                    })}
                </ContentWrapper>
            </GridContainer>
        </SupportRoot>
    );
};

export default Support;
