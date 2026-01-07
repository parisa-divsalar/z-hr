'use client';

import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
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

                <div
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

                    <Image alt='ats' width={200} height={157} src={ATSImage} />
                </div>
            </div>

            <Box
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
            >
                {benefits.map((benefit, index) => (
                    <div
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
                    >
                        <Typography variant='h5' color='secondary.main' fontWeight={'584'} textAlign={'center'}>
                            {benefit.title}
                        </Typography>

                        <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                            {benefit.description}
                        </Typography>

                        <Image alt='ats' width={182} height={157} src={benefit.image} />
                    </div>
                ))}
            </Box>
        </Container>
    );
};

export default KeyBenefits;
