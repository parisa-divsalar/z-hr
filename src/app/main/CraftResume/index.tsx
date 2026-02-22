'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import TypewriterText from '@/components/UI/TypewriterText';
import { useGetStartedFree } from '@/hooks/useGetStartedFree';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

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

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

const easeOutBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easeOutBezier },
    },
};

const CraftResume: FC = () => {
    const [isActiveOnce, setIsActiveOnce] = useState(false);
    const { onGetStartedFree, isRouting } = useGetStartedFree();
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).craftResume;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia?.('(hover: none), (pointer: coarse)');
        if (mq?.matches) setIsActiveOnce(true);
    }, []);

    return (
        <HeroWrapper onMouseEnter={() => setIsActiveOnce(true)} onFocusCapture={() => setIsActiveOnce(true)}>
            <Container
                maxWidth='md'
                sx={{ gap: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                component={motion.div}
                variants={containerVariants}
                initial='hidden'
                animate={isActiveOnce ? 'show' : 'hidden'}
            >
                <motion.div variants={itemVariants}>
                    <Typography variant='h2' color='secondary.main' fontWeight={'700'} fontSize={'2.25rem'}>
                        {t.title}
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'}>
                        <TypewriterText text={t.subtitle} active={isActiveOnce} once tokenDelayMs={32} spaceDelayMs={12} />
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button
                        variant='contained'
                        color='secondary'
                        size='large'
                        onClick={onGetStartedFree}
                        disabled={isRouting}
                        sx={{ marginTop: '3rem', textDecoration: 'none' }}
                    >
                        {t.getStarted}
                    </Button>
                </motion.div>
            </Container>
        </HeroWrapper>
    );
};

export default CraftResume;
