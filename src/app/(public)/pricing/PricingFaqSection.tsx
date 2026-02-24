'use client';

import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { faqSx } from '@/app/main/Faq/Faq.styles';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

type PricingFaqSectionProps = {
    dir: 'ltr' | 'rtl';
};

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

export default function PricingFaqSection({ dir }: PricingFaqSectionProps) {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).pricingPage.faq;
    const faqItems: FaqItem[] = t.items;
    const [expanded, setExpanded] = React.useState<string | false>(faqItems[0]?.id ?? false);

    return (
        <Box component='section' dir={dir} sx={{ ...faqSx.section, direction: dir }}>
            <Container maxWidth='lg' sx={faqSx.container}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems='flex-start'>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={faqSx.stickyCol}>
                            <Typography variant='h1' fontWeight='700' sx={faqSx.heading}>
                                {t.title}
                            </Typography>

                            <Typography variant='subtitle1' fontWeight='492' color='text.primary' mt={4} sx={{ lineHeight: 1.7 }}>
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
                        <Stack spacing={2} useFlexGap>
                            {faqItems.map((item) => {
                                const isExpanded = expanded === item.id;
                                return (
                                    <Accordion
                                        key={item.id}
                                        disableGutters
                                        elevation={0}
                                        expanded={isExpanded}
                                        onChange={(_, next) => setExpanded(next ? item.id : false)}
                                        sx={{
                                            ...faqSx.accordion,
                                            ...(dir === 'rtl' && {
                                                '& .MuiAccordionSummary-expandIconWrapper': {
                                                    right: 'auto',
                                                    left: { xs: 16, sm: 24 },
                                                },
                                            }),
                                        }}
                                    >
                                        <AccordionSummary
                                            disableRipple
                                            expandIcon={
                                                <Box sx={faqSx.expandIconWrap}>
                                                    {isExpanded ? <CloseIcon sx={faqSx.expandIcon} /> : <AddIcon sx={faqSx.expandIcon} />}
                                                </Box>
                                            }
                                            sx={{
                                                ...faqSx.summary,
                                                flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                                                pl: dir === 'rtl' ? { xs: 7, sm: 8 } : { xs: 2, sm: 3 },
                                                pr: dir === 'rtl' ? { xs: 2, sm: 3 } : { xs: 7, sm: 8 },
                                            }}
                                        >
                                            <Typography fontWeight='584' variant='h5' sx={{ ...faqSx.question, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                                                {item.question}
                                            </Typography>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ ...faqSx.details, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
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

            <Box sx={{ ...faqSx.sparkleTopLeftFloat, ...(dir === 'rtl' ? { left: 'auto', right: 0 } : {}) }}>
                <Sparkle size={22} />
            </Box>

            <Box sx={{ ...faqSx.sparkleCenterFloat, ...(dir === 'rtl' ? { right: 'auto', left: { xs: 16, sm: 24 } } : {}) }}>
                <Sparkle size={22} />
            </Box>
        </Box>
    );
}

