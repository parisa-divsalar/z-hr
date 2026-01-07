'use client';

import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';

import AvatarImage from '@/assets/images/bg/avatar.png';

type Testimonial = {
    id: string;
    role: string;
    name: string;
    quote: string;
};

const TESTIMONIALS: Testimonial[] = [
    {
        id: 'pavel-1',
        role: 'CEO of Telegram',
        name: 'Pavel Durov',
        quote: `“Create a professional and ATS-friendly resume and CV in minutes with Z-CV.”

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.

Create a professional and ATS-friendly resume and CV in minutes with Z-CV.

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.`,
    },
    {
        id: 'pavel-2',
        role: 'CEO of Telegram',
        name: 'Pavel Durov',
        quote: `“Create a professional and ATS-friendly resume and CV in minutes with Z-CV in minutes with Z-CV.”

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.`,
    },
    {
        id: 'pavel-3',
        role: 'CEO of Telegram',
        name: 'Pavel Durov',
        quote: `“Create a professional and ATS-friendly resume and CV in minutes with Z-CV.”

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.

Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.`,
    },
];

const Testimonials: FC = () => {
    return (
        <Container sx={{ mt: '5rem' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1rem',
                }}
            >
                <Typography variant='h2' color='secondary.main' fontWeight='700'>
                    Testimonials
                </Typography>

                <Typography
                    variant='subtitle1'
                    color='secondary.main'
                    fontWeight='492'
                    sx={{ maxWidth: 760 }}
                >
                    "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                    <br />
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence."
                </Typography>

                <Button variant='contained' color='secondary' size='medium' disableElevation>
                    Ask Your Question
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 360px)',
                        sm: 'repeat(2, minmax(0, 360px))',
                        md: 'repeat(3, minmax(0, 360px))',
                    },
                    justifyContent: 'center',
                    gap: '1.5rem',
                    mt: '3rem',
                }}
            >
                {TESTIMONIALS.map((t) => (
                    <Box
                        key={t.id}
                        sx={{
                            background: 'white',
                            border: '2px solid #F0F0F2',
                            borderRadius: '24px',
                            px: '1.5rem',
                            py: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '0.75rem',
                            minHeight: 220,
                        }}
                    >
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: '999px',
                                overflow: 'hidden',
                                border: '2px solid #F0F0F2',
                            }}
                        >
                            <Image alt='avatar' src={AvatarImage} width={52} height={52} />
                        </Box>

                        <Typography variant='h6' color='secondary.main' fontWeight='700'>
                            {t.role}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' fontWeight='492' sx={{ mt: '-0.25rem' }}>
                            {t.name}
                        </Typography>

                        <Typography
                            variant='body2'
                            color='secondary.main'
                            fontWeight='492'
                            sx={{ maxWidth: 320, opacity: 0.92, whiteSpace: 'pre-line' }}
                        >
                            {t.quote}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default Testimonials;
