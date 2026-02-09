'use client';

import * as React from 'react';

import {
    Box,
    Container,
    Typography,
} from '@mui/material';

const OurFeatures = () => {
    const description =
        'Please provide details about your current visa status and the languages you speak fluently. Additionally, share your primary area of expertise and a summary of your previous work experiences. Include any certifications you hold, and let us know if you are open to relocating for work. What are your salary expectations, and how many years of experience do you have in your field? Finally, outline your career goals for the next five years.';

    type OurFeatureItem = {
        title: string;
        description: string;
        media: `/${string}`;
        reverse?: boolean;
    };

    const items: OurFeatureItem[] = [
        {
            title: 'Response to questions in 9 stages',
            description,
            media: '/images/main/main.svg',
        },
        {
            title: 'Review the resume before the final exit',
            description,
            media: '/images/main/main1.svg',
            reverse: true,
        },
        {
            title: 'Check out our awesome features!',
            description,
            media: '/images/main/main2.svg',
        },
        {
            title: 'Finish, you can download and use your resume and its features.',
            description,
            media: '/images/main/main3.svg',
            reverse: true,
        },
        {
            title: 'Check out our awesome features!',
            description,
            media: '/images/main/main4.svg',
        },

    ];

    return (
        <Box
            component='section'
            sx={{
                width: '100%',
                direction: 'ltr',
                bgcolor: 'common.white',
                pt: { xs: 7, sm: 9, md: 11 },
            }}
        >
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, alignItems: 'center' }}>
                    <Typography variant='h3' color='secondary.main' fontWeight={700}>
                        Our Features
                    </Typography>

                    <Typography
                        variant='subtitle1'
                        mt={3}
                        color='secondary.main'
                        fontWeight={492}
                        textAlign='center'
                        sx={{ maxWidth: 760, opacity: 0.92, lineHeight: 1.7 }}
                    >
                        Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                        <br />
                        Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                        intelligence.
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
                                    gridTemplateColumns: { xs: '1fr', md: '1fr 460px' },
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
                                        variant='h5'
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
                                        sx={{ maxWidth: 540, opacity: 0.9, lineHeight: 1.75 }}
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
