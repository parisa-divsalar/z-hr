import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import {
    CardsWrapper,
    NumberBadge,
    SuggestionCard,
    SuggestionCardHeader,
} from '@/components/Landing/Wizard/Step3/MoreFeatures/styled';

type SuggestionPreviewCard = {
    number: number;
    title: string;
    answer: string;
};

interface SuggestionPreviewProps {
    cards: SuggestionPreviewCard[];
}

const SuggestionPreview: FunctionComponent<SuggestionPreviewProps> = ({ cards }) => {
    return (
        <Box sx={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
            <CardsWrapper>
                {cards.map((card, idx) => (
                    <SuggestionCard key={`${card.number}-${idx}`}>
                        <SuggestionCardHeader>
                            <NumberBadge>{card.number}</NumberBadge>
                            <Box>
                                <Typography variant='caption' fontWeight='500' color='text.primary'>
                                    {card.title}
                                </Typography>
                            </Box>
                        </SuggestionCardHeader>
                        <Typography variant='caption' color='text.primary' fontWeight='500'>
                            <Box component='span' sx={{ fontWeight: 400, color: 'text.primary' }}>
                                Answer:{' '}
                            </Box>
                            {card.answer}
                        </Typography>
                    </SuggestionCard>
                ))}
            </CardsWrapper>
        </Box>
    );
};

export default SuggestionPreview;


