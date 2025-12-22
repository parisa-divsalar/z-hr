import type { FC } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroWrapper = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(8, 0),
    backgroundImage: 'url(/images/mask-group.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: theme.palette.secondary.main,
    height: '750px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const HeroSection: FC = () => {
    return (
        <HeroWrapper>
            <Container maxWidth='md'>
                <Typography variant='h2' sx={{ color: 'secondary.main' }} fontWeight={700} mb='1rem'>
                    Professional & ATS-friendly Resume
                </Typography>

                <Typography variant='h5' sx={{ color: 'secondary.main' }} fontWeight={500}>
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                </Typography>

                <Typography variant='h5' sx={{ color: 'secondary.main' }} fontWeight={500}>
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.
                </Typography>

                <Button variant='contained' color='secondary' size='large' sx={{ marginTop: '3rem' }}>
                    Get Started Free
                </Button>
            </Container>
        </HeroWrapper>
    );
};

export default HeroSection;
