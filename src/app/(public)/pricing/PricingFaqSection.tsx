'use client';

import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { faqSx } from '@/app/main/Faq/Faq.styles';

type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'ats-score-check',
        question: 'Is it possible to check if my Resume is fully ATS-friendly?',
        answer: "Check your resume's ATS compatibility with our score checker for better applications.",
    },
    {
        id: 'ats-friendly',
        question: 'Are your resumes ATS-friendly?',
        answer: 'Yes—our templates are designed to be ATS-friendly and readable by recruiters and tracking systems.',
    },
    {
        id: 'pdf-docx',
        question: 'Can I get a PDF/DOCX output?',
        answer: 'Yes. You can export your resume in PDF and DOCX formats depending on your plan and template.',
    },
    {
        id: 'collaboration',
        question: 'What features do you offer for collaboration?',
        answer: 'You can share, review, and iterate faster with version history and easy export/share options.',
    },
    {
        id: 'trial',
        question: 'Is there a trial period available?',
        answer: 'We offer a trial so you can test templates and core features before committing to a plan.',
    },
];

const Sparkle = (props: { size?: number }) => {
    const size = props.size ?? 18;
    const gradientId = React.useId();
    return (
        <Box component='svg' width={size} height={size} viewBox='0 0 24 24' fill='none' aria-hidden='true' sx={faqSx.sparkleSvg}>
            <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='24' y2='24'>
                    <stop offset='0' stopColor='#8B5CF6' />
                    <stop offset='0.55' stopColor='#22C55E' />
                    <stop offset='1' stopColor='#06B6D4' />
                </linearGradient>
            </defs>
            <path d='M12 1.75l1.55 6.1 6.1 1.55-6.1 1.55L12 17.05l-1.55-6.1-6.1-1.55 6.1-1.55L12 1.75z' fill={`url(#${gradientId})`} />
            <path d='M18.75 13.2l.9 3.55 3.55.9-3.55.9-.9 3.55-.9-3.55-3.55-.9 3.55-.9.9-3.55z' fill={`url(#${gradientId})`} />
        </Box>
    );
};

export default function PricingFaqSection() {
    const [expanded, setExpanded] = React.useState<string | false>(FAQ_ITEMS[0]?.id ?? false);

    return (
        <Box component='section' sx={faqSx.section}>
            <Container maxWidth='lg' sx={faqSx.container}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems='flex-start'>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={faqSx.stickyCol}>
                            <Typography variant='h2' fontWeight='700' sx={faqSx.heading}>
                                FAQ
                            </Typography>

                            <Typography variant='subtitle1' fontWeight='492' color='text.primary' mt={4} sx={{ lineHeight: 1.7 }}>
                                "Create a professional and ATS-friendly resume and CV in minutes with Z-CV. Tailored for the markets of Iran
                                and Dubai, featuring modern templates and advanced artificial intelligence.
                            </Typography>

                            <Box sx={faqSx.ctaWrap} mt={4}>
                                <Button variant='contained' disableElevation sx={faqSx.ctaButton}>
                                    Ask Your Question
                                </Button>

                                <Box sx={faqSx.sparkleCtaFloat}>
                                    <Sparkle size={22} />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={2} useFlexGap>
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
                                            disableRipple
                                            expandIcon={
                                                <Box sx={faqSx.expandIconWrap}>
                                                    {isExpanded ? <CloseIcon sx={faqSx.expandIcon} /> : <AddIcon sx={faqSx.expandIcon} />}
                                                </Box>
                                            }
                                            sx={faqSx.summary}
                                        >
                                            <Typography fontWeight='584' variant='h5' sx={faqSx.question}>
                                                {item.question}
                                            </Typography>
                                        </AccordionSummary>

                                        <AccordionDetails sx={faqSx.details}>
                                            <Typography variant='subtitle1' fontWeight='492' color='text.secondary' sx={faqSx.answer}>
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

            <Box sx={faqSx.sparkleTopLeftFloat}>
                <Sparkle size={22} />
            </Box>

            <Box sx={faqSx.sparkleCenterFloat}>
                <Sparkle size={22} />
            </Box>
        </Box>
    );
}

