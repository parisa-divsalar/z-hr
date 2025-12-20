'use client';

import { type KeyboardEvent, useState } from 'react';

import { Typography } from '@mui/material';

import { PageTitle } from '@/app/(private)/payment/styled';
import { GridContainer, ContentWrapper, SupportRoot } from '@/app/(private)/support/styled';

import { accordionData } from './mockData';
import SupportAccordionItem from './SupportAccordionItem';

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
            </PageTitle>
            <GridContainer>
                <ContentWrapper>
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
