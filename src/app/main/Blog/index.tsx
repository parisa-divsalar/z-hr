'use client';

import { Stack, Typography } from '@mui/material';

import ImageCardSlider from '@/app/main/Blog/ImageCardSlider';

const Blog = () => {
    return (
        <Stack
            sx={{ pt: { xs: 4, md: 6 } }}
            justifyContent='center'
            alignItems='center'
            width='100%'
            textAlign='center'
            gap={2}
            mt={5}
        >
            <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                Blog{' '}
            </Typography>

            <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.{' '}
                <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.{' '}
                </Typography>
            </Typography>

            <ImageCardSlider />
        </Stack>
    );
};

export default Blog;
