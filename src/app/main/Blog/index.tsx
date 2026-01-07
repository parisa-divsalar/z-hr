'use client';

import { Button, Stack, Typography } from '@mui/material';

import ImageCardSlider from '@/app/main/Blog/ImageCardSlider';

import { BlogSection } from './ImageCardSlider.styles';

const Blog = () => {
    return (
        <BlogSection justifyContent='center' alignItems='center' width='100%' textAlign='center' gap={2}>
            <Typography variant='h2' color='secondary.main' fontWeight={'700'} pt={12}>
                Blog{' '}
            </Typography>

            <Typography variant='body1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                "Create a professional and ATS-friendly resume and CV in minutes with Z-CV.{' '}
            </Typography>

            <Typography variant='body1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                intelligence.{' '}
            </Typography>

            <ImageCardSlider />

            <Stack direction='row' justifyContent='center' mt={5} mb={15}>
                <Button variant='contained' color='secondary' size='medium'>
                    View Archive{' '}
                </Button>
            </Stack>
        </BlogSection>
    );
};

export default Blog;
