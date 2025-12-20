'use client';

import { type KeyboardEvent, useState } from 'react';

import { accordionData } from './mockData';
import SupportAccordionItem from './SupportAccordionItem';

const SupportAccordionList = () => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(
        () => new Set(accordionData.filter((item) => item.defaultExpanded).map((item) => item.id)),
    );

    const toggleItem = (id: string) => {
        setExpandedItems((previous) => {
            const updated = new Set(previous);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleItem(id);
        }
    };

    return (
        <>
            {accordionData.map((item) => (
                <SupportAccordionItem
                    key={item.id}
                    item={item}
                    isExpanded={expandedItems.has(item.id)}
                    onToggle={() => toggleItem(item.id)}
                    onKeyDown={(event) => handleKeyDown(event, item.id)}
                />
            ))}
        </>
    );
};

export default SupportAccordionList;


