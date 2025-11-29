'use client';

import { useState } from 'react';

import { Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

import { PageTitle } from '@/app/(private)/payment/styled';
import {
  AccordionHeader,
  AccordionItem,
  ChevronWrapper,
  ContentInner,
  ContentRegion,
  ContentWrapper,
  GridContainer,
  SupportRoot,
  TitleWrapper,
} from '@/app/(private)/support/styled';

interface AccordionItemData {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
  defaultExpanded?: boolean;
}

const accordionData: AccordionItemData[] = [
  {
    id: 'questions',
    title: 'Questions',
    description: 'Access common and position-specific interview questions to prepare effectively.',
    defaultExpanded: true,
  },
  {
    id: 'tips',
    title: 'Tips',
    description: 'Access common and position-specific interview questions to prepare effectively.',
    defaultExpanded: true,
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Access common and position-specific interview questions to prepare effectively.',
    defaultExpanded: true,
  },
  {
    id: 'mock-interviews',
    title: 'Mock Interviews',
    description: 'Access common and position-specific interview questions to prepare effectively.',
    defaultExpanded: true,
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Access common and position-specific interview questions to prepare effectively.',
    defaultExpanded: true,
  },
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

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
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
              <AccordionItem key={item.id}>
                <AccordionHeader
                  expanded={isExpanded}
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`content-${item.id}`}
                  id={`header-${item.id}`}
                >
                  <TitleWrapper>
                    <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                      {item.title}
                    </Typography>
                  </TitleWrapper>

                  <ChevronWrapper expanded={isExpanded}>
                    <ChevronDown size={20} />
                  </ChevronWrapper>
                </AccordionHeader>

                <ContentRegion
                  expanded={isExpanded}
                  role='region'
                  aria-labelledby={`header-${item.id}`}
                  id={`content-${item.id}`}
                >
                  <ContentInner>
                    {item.content || (
                      <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                        {item.description}
                      </Typography>
                    )}
                  </ContentInner>
                </ContentRegion>
              </AccordionItem>
            );
          })}
        </ContentWrapper>
      </GridContainer>
    </SupportRoot>
  );
};

export default Support;
