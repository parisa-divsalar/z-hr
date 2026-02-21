'use client';

import * as React from 'react';

import { Box, Container, Typography } from '@mui/material';

import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

const OurFeatures = () => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).ourFeatures;

    type OurFeatureItem = {
        title: string;
        description: string;
        media: `/${string}`;
        reverse?: boolean;
    };

    const items: OurFeatureItem[] = [
        { title: t.items[0].title, description: t.description, media: '/images/main/main.svg' },
        { title: t.items[1].title, description: t.description, media: '/images/main/main1.svg', reverse: true },
        { title: t.items[2].title, description: t.description, media: '/images/main/main2.svg' },
        { title: t.items[3].title, description: t.description, media: '/images/main/main3.svg', reverse: true },
        { title: t.items[4].title, description: t.description, media: '/images/main/main4.svg' },
    ];

    return (
        <Box
            component='section'
            sx={{
                width: '100%',
                direction: locale === 'fa' ? 'rtl' : 'ltr',
                bgcolor: 'common.white',
                pt: { xs: 7, sm: 9, md: 11 },
            }}
        >
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, alignItems: 'center' }}>
                    <Typography variant='h3' color='secondary.main' fontWeight={700}>
                        {t.title}
                    </Typography>

                    <Typography
                        variant='subtitle1'
                        mt={3}
                        color='secondary.main'
                        fontWeight={492}
                        textAlign='center'
                        sx={{ maxWidth: 760, opacity: 0.92, lineHeight: 1.7 }}
                    >
                        {t.intro}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: { xs: 5, sm: 6, md: 7 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 5, sm: 6, md: 7 },
                    }}
                >
                    {items.map((item) => {
                        const reverse = Boolean(item.reverse);
                        return (
                            <Box
                                key={item.title}
                                sx={{
                                    display: 'grid',
                                    // md+: 12-col feel -> text 8 / media 4 (and keep the ratio when reversed)
                                    gridTemplateColumns: { xs: '1fr', md: reverse ? '4fr 8fr' : '8fr 4fr' },
                                    gridTemplateAreas: {
                                        xs: `"text" "media"`,
                                        md: reverse ? `"media text"` : `"text media"`,
                                    },
                                    columnGap: { xs: 0, md: 10 },
                                    rowGap: { xs: 2.5, sm: 3 },
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{ gridArea: 'text' }}>
                                    <Typography
                                        variant='h4'
                                        color='secondary.main'
                                        fontWeight={700}
                                        sx={{ mb: 1.25, lineHeight: 1.25 }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant='subtitle1'
                                        color='secondary.main'
                                        fontWeight={492}
                                        sx={{
                                            maxWidth: { xs: 540, md: 'none' },
                                            opacity: 0.9,
                                            lineHeight: 1.75,
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        gridArea: 'media',
                                        width: '100%',
                                        maxWidth: { xs: 520, md: 460 },
                                        justifySelf: { xs: 'center', md: reverse ? 'start' : 'end' },
                                        borderRadius: '18px',
                                        overflow: 'hidden',
                                        bgcolor: 'common.white',
                                        aspectRatio: '396 / 333',
                                        display: 'grid',
                                        placeItems: 'center',
                                        p: '4px',
                                    }}
                                >
                                    <Box
                                        component='img'
                                        src={item.media}
                                        alt={item.title}
                                        loading='lazy'
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            objectPosition: 'center',
                                            display: 'block',
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
};

export default OurFeatures;
