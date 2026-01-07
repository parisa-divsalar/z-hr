'use client';

import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';

import AITextImage from '@/assets/images/main/ai-text.png';
import ATSImage from '@/assets/images/main/ats.png';
import JobOpportunityImage from '@/assets/images/main/job-opportunity.png';
import MiddleEastImage from '@/assets/images/main/middle-east.png';
import QuickResumeImage from '@/assets/images/main/quick-resume.png';

interface Benefit {
    title: string;
    description: string;
    image: StaticImageData;
}
const KeyBenefits: FC = () => {
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

    const MotionBox = motion(Box);

    const rotateImageOnHoverSx = {
        display: 'inline-flex',
        cursor: 'pointer',
        '& img': {
            transform: 'rotate(0deg)',
            transition: 'transform 5000ms cubic-bezier(0.45, 0, 0.55, 1)',
            willChange: 'transform',
        },
        '&:hover img': {
            transform: 'rotate(360deg)',
        },
        '@media (prefers-reduced-motion: reduce)': {
            '& img': { transition: 'none' },
            '&:hover img': { transform: 'none' },
        },
    } as const;

    const benefits: Benefit[] = [
        {
            title: 'ATS-Friendly Resume That Gets Past Filters',
            description:
                'Create an ATS-friendly resume designed to pass automated screening and stay readable for real hiring managers',
            image: QuickResumeImage,
        },
        {
            title: 'Tailor Your Resume to Any Job Description',
            description:
                'Tailor your resume to match the Job Description (JD) to highlight your relevant skills and experience.',
            image: JobOpportunityImage,
        },
        {
            title: 'AI Resume Builder, Done in Minutes',
            description:
                'Use an AI Resume Builder to generate a polished, professional resume without starting from scratch',
            image: AITextImage,
        },
        {
            title: 'Keyword Optimization for Higher Visibility',
            description:
                'Find missing keywords with a Keyword Gap approach so your resume matches UAE job posts more accurately',
            image: MiddleEastImage,
        },
    ];

    return (
        <Container>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'start' }}>
                    <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                        Key Benefits
                    </Typography>

                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'}>
                        Create a professional and ATS-friendly resume and CV in minutes with Z-CV. Tailored for the
                        markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.
                    </Typography>

                    <Button variant='contained' color='secondary' size='medium'>
                        Get Started Free
                    </Button>
                </div>

                <motion.div
                    variants={itemVariants}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.4 }}
                    style={{
                        gap: '2rem',
                        width: 588,
                        height: 374,
                        display: 'flex',
                        padding: '40px',
                        background: 'white',
                        alignItems: 'center',
                        borderRadius: '24px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '2px solid #F0F0F2',
                    }}
                >
                    <Typography variant='h5' color='secondary.main' fontWeight={'584'}>
                        Dubai & UAE CV Format, Ready to Submit{' '}
                    </Typography>

                    <Typography
                        justifyContent='center'
                        textAlign='center'
                        variant='subtitle1'
                        color='secondary.main'
                        fontWeight={'492'}
                    >
                        Build a Dubai-ready CV that matches UAE resume format expectations, from layout to
                        recruiter-friendly
                    </Typography>

                    <Box sx={rotateImageOnHoverSx}>
                        <Image alt='ats' width={200} height={157} src={ATSImage} />
                    </Box>
                </motion.div>
            </div>

            <MotionBox
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 282px)',
                        sm: 'repeat(2, 282px)',
                        md: 'repeat(4, 282px)', // show all 4 cards in a single row on desktop
                    },
                    justifyContent: 'center',
                    gap: '1rem',
                    mt: '5rem',
                }}
                variants={containerVariants}
                initial='hidden'
                whileInView='show'
                viewport={{ once: true, amount: 0.25 }}
            >
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        style={{
                            gap: '1.5rem',
                            width: 282,
                            height: 439,
                            display: 'flex',
                            background: 'white',
                            padding: '40px 24px',
                            alignItems: 'center',
                            borderRadius: '24px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '2px solid #F0F0F2',
                        }}
                        variants={itemVariants}
                    >
                        <Typography variant='h5' color='secondary.main' fontWeight={'584'} textAlign={'center'}>
                            {benefit.title}
                        </Typography>

                        <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                            {benefit.description}
                        </Typography>

                        <Box sx={rotateImageOnHoverSx}>
                            <Image alt={benefit.title} width={182} height={157} src={benefit.image} />
                        </Box>
                    </motion.div>
                ))}
            </MotionBox>
        </Container>
    );
};

export default KeyBenefits;
