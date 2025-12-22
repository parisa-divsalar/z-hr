import { FC } from 'react';

import { Button, Container, Stack, Typography } from '@mui/material';
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
            title: 'AI Bullet Points Generator',
            description: 'Effortlessly create bullet points with our AI tool for quick writing.',
            image: AIBulletImage,
        },
        {
            title: 'ATS Score Checker',
            description: "Check your resume's ATS compatibility with our score checker for better applications.",
            image: ATSScoreImage,
        },
        {
            title: 'Keyword Gap Analyzer',
            description: 'Uncover keyword opportunities with our tool that spots gaps in your content strategy.',
            image: KeywordImage,
        },
        {
            title: 'Modern ATS-Friendly Templates',
            description: 'Explore stylish templates that pass ATS checks and make your resume shine.',
            image: ModernATSImage,
        },
        {
            title: 'AI Cover Letter Writer',
            description: 'Easily craft personalized cover letters with our AI creator for job applications.',
            image: ATSScoreImage,
        },
        {
            title: 'One-Click Job Description Import',
            description: 'Seamlessly import job descriptions to streamline your hiring process.',
            image: OneClickImage,
        },
    ];

    return (
        <Container sx={{ mt: '5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                    Product Features
                </Typography>

                <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                        Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                        intelligence.
                    </Typography>
                </Typography>
            </div>
            <div
                style={{
                    gap: '0',
                    display: 'grid',
                    marginTop: '3rem',
                    borderRadius: '24px',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    overflow: 'hidden',
                    boxShadow: '0 0 10px 2px #F0F0F2',
                }}
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        style={{
                            gap: '1rem',
                            height: '354',
                            display: 'flex',
                            background: 'white',
                            padding: '40px 24px',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
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
            </div>

            <Stack direction='row' justifyContent='center' mt={3}>
                <Button variant='contained' color='secondary' size='medium'>
                    Get Started Free
                </Button>
            </Stack>
        </Container>
    );
};

export default ProductFeatures;
