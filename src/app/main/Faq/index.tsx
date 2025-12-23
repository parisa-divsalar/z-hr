'use client';

import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { faqSx } from './Faq.styles';

type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'what-do-you-build',
        question: 'What types of projects do you work on?',
        answer: 'I build modern web experiences: design systems, landing pages, dashboards, and full product UIs—optimized for performance, accessibility, and maintainability.',
    },
    {
        id: 'timeline',
        question: 'What does a typical timeline look like?',
        answer: 'Most small-to-mid scope UI projects take 1–3 weeks depending on the number of screens, integrations, and revisions. I’ll share a clear plan and milestones up front.',
    },
    {
        id: 'process',
        question: 'How do you approach UI implementation?',
        answer: 'I start with layout/grid and typography hierarchy, then implement components with consistent spacing, border radii, and states. Final pass focuses on polish: motion, responsiveness, and edge cases.',
    },
    {
        id: 'handoff',
        question: 'Can you match a Figma design pixel-perfect?',
        answer: 'Yes. I use a strict spacing system, consistent component styling, and careful alignment checks to match designs as closely as possible across breakpoints.',
    },
    {
        id: 'support',
        question: 'Do you offer post-launch support?',
        answer: 'Absolutely. I can help with iterations, new sections, bug fixes, and improvements as your product evolves.',
    },
];

const Sparkle = (props: { size?: number }) => {
    const size = props.size ?? 18;
    const gradientId = React.useId();
    return (
        <Box
            component='svg'
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='none'
            aria-hidden='true'
            sx={faqSx.sparkleSvg}
        >
            <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='24' y2='24'>
                    <stop offset='0' stopColor='#8B5CF6' />
                    <stop offset='0.55' stopColor='#22C55E' />
                    <stop offset='1' stopColor='#06B6D4' />
                </linearGradient>
            </defs>
            <path
                d='M12 1.75l1.55 6.1 6.1 1.55-6.1 1.55L12 17.05l-1.55-6.1-6.1-1.55 6.1-1.55L12 1.75z'
                fill={`url(#${gradientId})`}
            />
            <path
                d='M18.75 13.2l.9 3.55 3.55.9-3.55.9-.9 3.55-.9-3.55-3.55-.9 3.55-.9.9-3.55z'
                fill={`url(#${gradientId})`}
            />
        </Box>
    );
};

const Faq = () => {
    const [expanded, setExpanded] = React.useState<string | false>(FAQ_ITEMS[0]?.id ?? false);

    return (
        <Box
            component='section'
            sx={faqSx.section}
        >
            <Container maxWidth='lg' sx={faqSx.container}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems='flex-start'>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box
                            sx={faqSx.stickyCol}
                        >
                            <Typography
                                variant='h3'
                                sx={faqSx.heading}
                            >
                                FAQ
                            </Typography>

                            <Typography
                                variant='body1'
                                sx={faqSx.lead}
                            >
                                Find quick answers to common questions. If you don’t see what you’re looking for, ask
                                away.
                            </Typography>

                            <Box sx={faqSx.ctaWrap}>
                                <Button
                                    variant='contained'
                                    disableElevation
                                    sx={faqSx.ctaButton}
                                >
                                    Ask Your Question
                                </Button>

                                <Box
                                    sx={faqSx.sparkleCtaFloat}
                                >
                                    <Sparkle size={22} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack spacing={2}>
                            {FAQ_ITEMS.map((item) => {
                                const isExpanded = expanded === item.id;
                                return (
                                    <Accordion
                                        key={item.id}
                                        disableGutters
                                        elevation={0}
                                        expanded={isExpanded}
                                        onChange={(_, next) => setExpanded(next ? item.id : false)}
                                        sx={faqSx.accordion}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <Box
                                                    sx={faqSx.expandIconWrap}
                                                >
                                                    {isExpanded ? (
                                                        <CloseIcon sx={faqSx.expandIcon} />
                                                    ) : (
                                                        <AddIcon sx={faqSx.expandIcon} />
                                                    )}
                                                </Box>
                                            }
                                            sx={faqSx.summary}
                                        >
                                            <Typography
                                                variant='h6'
                                                sx={faqSx.question}
                                            >
                                                {item.question}
                                            </Typography>
                                        </AccordionSummary>

                                        <AccordionDetails
                                            sx={faqSx.details}
                                        >
                                            <Typography
                                                variant='body2'
                                                sx={faqSx.answer}
                                            >
                                                {item.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            <Box
                sx={faqSx.sparkleTopLeftFloat}
            >
                <Sparkle size={22} />
            </Box>

            <Box
                sx={faqSx.sparkleCenterFloat}
            >
                <Sparkle size={22} />
            </Box>
        </Box>
    );
};

export default Faq;
