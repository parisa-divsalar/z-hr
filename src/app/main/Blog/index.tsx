'use client';

import { Button, Stack, Typography } from '@mui/material';

import ImageCardSlider from '@/components/Blog/ImageCardSlider';
import { BlogSection } from '@/components/Blog/ImageCardSlider.styles';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

const Blog = () => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).blog;

    return (
        <BlogSection justifyContent='center' alignItems='center' width='100%' textAlign='center' gap={2}>
            <Typography variant='h2' color='secondary.main' fontWeight={'700'} pt={12}>
                {t.title}
            </Typography>

            <Typography variant='body1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                {t.intro}
            </Typography>

            <ImageCardSlider />

            <Stack direction='row' justifyContent='center' mt={5} mb={15}>
                <Button variant='contained' color='secondary' size='medium'    href='/blog'>
                    {t.viewArchive}
                </Button>
            </Stack>
        </BlogSection>
    );
};

export default Blog;
