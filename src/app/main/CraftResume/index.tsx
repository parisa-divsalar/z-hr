'use client';

import type { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroWrapper = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(8, 0),
    backgroundImage: 'url(/images/people-collage.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: theme.palette.secondary.main,
    height: '437px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5rem',
}));

const CraftResume: FC = () => {

    return (
        <HeroWrapper>
            <Container
                maxWidth='md'
                sx={{ gap: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography variant='h2' color='secondary.main' fontWeight={'700'} fontSize={'2.25rem'}>
                    Craft Your Dream Resume Today!
                </Typography>

                <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'}>
                    Z-CV has helped create over 10,000 resumes from all around the world Our platform is here for job
                    seekers everywhere, making it easy to build the perfect resume. Join the thousands who’ve already
                    taken advantage of our cool resume-building tools!
                </Typography>

                <Button variant='contained' color='secondary' size='large' sx={{ marginTop: '3rem' }}>
                    Get Started Free
                </Button>
            </Container>
        </HeroWrapper>
    );
};

export default CraftResume;
