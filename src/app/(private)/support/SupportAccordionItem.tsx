'use client';

import { type KeyboardEvent, type ReactNode } from 'react';

import { Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

import {
  AccordionHeader,
  AccordionItem,
  ChevronWrapper,
  ContentInner,
  ContentRegion,
  TitleWrapper,
} from './styled';

export interface AccordionItemData {
  id: string;
  title: string;
  description?: string;
  content?: ReactNode;
  defaultExpanded?: boolean;
}

interface SupportAccordionItemProps {
  item: AccordionItemData;
  isExpanded: boolean;
  onToggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

const SupportAccordionItem = ({ item, isExpanded, onToggle, onKeyDown }: SupportAccordionItemProps) => (
  <AccordionItem>
    <AccordionHeader
      expanded={isExpanded}
      onClick={onToggle}
      onKeyDown={onKeyDown}
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

export default SupportAccordionItem;

