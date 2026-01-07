import { FC } from 'react';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Image, { StaticImageData } from 'next/image';

import AIBulletImage from '@/assets/images/main/ai-bullet.png';
import ATSScoreImage from '@/assets/images/main/ats-score.png';
import KeywordImage from '@/assets/images/main/keyword.png';
import ModernATSImage from '@/assets/images/main/modern-ats.png';
import OneClickImage from '@/assets/images/main/one-click.png';

interface Feature {
    title: string;
    description: string;
    image: StaticImageData;
}
const ProductFeatures: FC = () => {
    const features: Feature[] = [
        {
            title: 'One-Click Job Description Import',
            description:
                'Paste or import a Job Description and instantly tailor your resume content to match role requirements',
            image: AIBulletImage,
        },
        {
            title: 'AI Bullet Points Generator',
            description:
                'Turn tasks into impact-driven achievements with an AI bullet points generator (clear, concise, recruiter-ready)',
            image: ATSScoreImage,
        },
        {
            title: 'ATS Score Checker / Profile',
            description:
                'Check resume structure and content with an ATS score checker style review to improve compatibility and clarity',
            image: KeywordImage,
        },
        {
            title: 'Keyword Gap Analyzer',
            description:
                'Identify missing keywords from the JD and improve matching with a built-in keyword gap analyzer',
            image: ModernATSImage,
        },
        {
            title: 'Modern ATS-Friendly Templates',
            description:
                'Pick from ATS-friendly resume templates optimized for a clean Dubai CV format look and faster scanning',
            image: ATSScoreImage,
        },
        {
            title: 'AI Cover Letter Builder',
            description:
                'Generate a tailored cover letter aligned to the same job description, so your application stays consistent',
            image: OneClickImage,
        },
    ];

    return (
        <Container sx={{ mt: '5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                    Product Features
                </Typography>

                <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                        Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                        intelligence.
                    </Typography>
                </Typography>
            </div>
            <Box
                sx={{
                    display: 'grid',
                    gap: 0,
                    mt: '3rem',
                    borderRadius: '24px',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 0 10px 2px #F0F0F2',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 400px)',
                        sm: 'repeat(2, minmax(0, 400px))',
                        md: 'repeat(3, 400px)', // 3 cards per row on desktop
                    },
                }}
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        style={{
                            gap: '12px',
                            width: '100%',
                            maxWidth: 400,
                            height: 313,
                            boxSizing: 'border-box',
                            display: 'flex',
                            background: 'white',
                            padding: '24px',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            border: '0.5px solid #F0F0F2',
                        }}
                    >
                        <Image alt='ats' width={100} height={100} src={feature.image} />

                        <Typography variant='h5' color='secondary.main' fontWeight={'584'} textAlign={'center'}>
                            {feature.title}
                        </Typography>

                        <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                            {feature.description}
                        </Typography>
                    </div>
                ))}
            </Box>

            <Stack direction='row' justifyContent='center' mt={6}>
                <Button variant='contained' color='secondary' size='medium'>
                    Get Started Free
                </Button>
            </Stack>
        </Container>
    );
};

export default ProductFeatures;
