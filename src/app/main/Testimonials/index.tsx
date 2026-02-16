'use client';

import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';

import AvatarImage from '@/assets/images/bg/avatar.png';

type Testimonial = {
    id: string;
    role: string;
    name: string;
    quote: string;
};

const MotionBox = motion(Box);

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
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants: Variants = shouldReduceMotion
        ? {
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 0.25 } },
          }
        : {
              hidden: { opacity: 0, filter: 'blur(8px)' },
              show: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
          };

    return (
        <Container maxWidth='lg' sx={{ mt: { xs: '3rem', md: '5rem' } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1rem',
                }}
            >
                <Typography variant='h2' color='text.primary' fontWeight='800' sx={{ letterSpacing: '-0.02em' }}>
                    Testimonials
                </Typography>

                <Typography variant='subtitle1' color='text.secondary' fontWeight='492' mb={3} sx={{ maxWidth: 860, lineHeight: 1.8 }}>
                    "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                    <br />
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial ."
                </Typography>

                <Button
                    variant='contained'
                    size='medium'
                    disableElevation
                    sx={{
                        bgcolor: '#111827',
                        color: '#fff',
                        textTransform: 'none',
                        borderRadius: 2.5,
                        px: 2.5,
                        py: 1.2,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#0B1220' },
                    }}
                >
                    Ask Your Question
                </Button>
            </Box>

            <MotionBox
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 1fr)',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        md: 'repeat(3, minmax(0, 1fr))',
                    },
                    justifyContent: 'center',
                    gap: '1.5rem',
                    mt: '3rem',
                    px: { xs: 1, sm: 0 },
                }}
                variants={containerVariants}
                initial='hidden'
                whileInView='show'
                viewport={{ once: true, amount: 0.25 }}
            >
                {TESTIMONIALS.map((t) => (
                    <MotionBox
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
                            width: '100%',
                            minHeight: { xs: 240, sm: 240, md: 260 },
                        }}
                        variants={itemVariants}
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

                        <Typography variant='h5' color='secondary.main' fontWeight='584'>
                            {t.role}
                        </Typography>

                        <Typography
                            variant='subtitle1'
                            color='text.secondary'
                            fontWeight='492'
                            sx={{ mt: '-0.25rem' }}
                        >
                            {t.name}
                        </Typography>

                        <Typography
                            variant='body1'
                            color='text.primary'
                            fontWeight='492'
                            sx={{ maxWidth: 320, opacity: 0.92, whiteSpace: 'pre-line' }}
                        >
                            {t.quote}
                        </Typography>
                    </MotionBox>
                ))}
            </MotionBox>
        </Container>
    );
};

export default Testimonials;
