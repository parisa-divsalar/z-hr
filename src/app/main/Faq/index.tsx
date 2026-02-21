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
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { faqSx } from './Faq.styles';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

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
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).faq;
    const FAQ_ITEMS: FaqItem[] = React.useMemo(
        () =>
            t.items.map((item, i) => ({
                id: `faq-${i}`,
                question: item.question,
                answer: item.answer,
            })),
        [t.items],
    );
    const [expanded, setExpanded] = React.useState<string | false>(FAQ_ITEMS[0]?.id ?? false);
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: {},
        show: {
            transition: {},
        },
    };

    const itemVariants: Variants = shouldReduceMotion
        ? {
              hidden: { opacity: 0 },
              show: (idx: number) => ({
                  opacity: 1,
                  transition: { duration: 0.2, delay: idx * 0.06 },
              }),
          }
        : {
              hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
              show: (idx: number) => ({
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                      duration: 0.6,
                      delay: idx * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                  },
              }),
          };

    return (
        <Box component='section' sx={faqSx.section}>
            <Container maxWidth='lg' sx={faqSx.container}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems='flex-start'>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={faqSx.stickyCol}>
                            <Typography variant='h2' fontWeight='700' sx={faqSx.heading}>
                                {t.title}
                            </Typography>

                            <Typography variant='subtitle1' fontWeight='492' color='text.primary' mt={4}>
                                {t.intro}
                            </Typography>

                            <Box sx={faqSx.ctaWrap} mt={4}>
                                <Button variant='contained' disableElevation sx={faqSx.ctaButton}>
                                    {t.askQuestion}
                                </Button>

                                <Box sx={faqSx.sparkleCtaFloat}>
                                    <Sparkle size={22} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <motion.div
                            variants={containerVariants}
                            initial='hidden'
                            whileInView='show'
                            viewport={{ once: true, amount: 0.35 }}
                        >
                            <Stack spacing={2} useFlexGap>
                                {FAQ_ITEMS.map((item, idx) => {
                                    const isExpanded = expanded === item.id;
                                    return (
                                        <motion.div key={item.id} variants={itemVariants} custom={idx}>
                                            <Accordion
                                                disableGutters
                                                elevation={0}
                                                expanded={isExpanded}
                                                onChange={(_, next) => setExpanded(next ? item.id : false)}
                                                sx={faqSx.accordion}
                                            >
                                                <AccordionSummary
                                                    disableRipple
                                                    expandIcon={
                                                        isExpanded ? (
                                                            <CloseIcon sx={faqSx.expandIcon} />
                                                        ) : (
                                                            <AddIcon sx={faqSx.expandIcon} />
                                                        )
                                                    }
                                                    sx={faqSx.summary}
                                                >
                                                    <Typography fontWeight='584' variant='h5' sx={faqSx.question}>
                                                        {item.question}
                                                    </Typography>
                                                </AccordionSummary>

                                                <AccordionDetails sx={faqSx.details}>
                                                    <Typography variant='subtitle1' fontWeight='492' color='text.secondry'>
                                                        {item.answer}
                                                    </Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                        </motion.div>
                                    );
                                })}
                            </Stack>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Box sx={faqSx.sparkleTopLeftFloat}>
                <Sparkle size={22} />
            </Box>

            <Box sx={faqSx.sparkleCenterFloat}>
                <Sparkle size={22} />
            </Box>
        </Box>
    );
};

export default Faq;
