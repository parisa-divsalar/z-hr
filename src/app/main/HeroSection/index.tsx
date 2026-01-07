import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';

import { motion, useReducedMotion } from 'framer-motion';

import { HeroWrapper, StepBadge, StepCard, StepsRow } from './styled';

const AnimatedWords: FC<{
    text: string;
    stagger?: number;
    delay?: number;
}> = ({ text, stagger = 0.18, delay = 0.45 }) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) return <>{text}</>;

    const words = text.split(' ').filter(Boolean);

    return (
        <motion.span
            aria-label={text}
            role='text'
            initial='hidden'
            animate='visible'
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: stagger,
                    },
                },
            }}
            style={{ display: 'inline-block' }}
        >
            {words.map((word, idx) => (
                <motion.span
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${word}-${idx}`}
                    aria-hidden='true'
                    variants={{
                        hidden: { opacity: 0, y: 2 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1] },
                        },
                    }}
                    style={{ display: 'inline-block' }}
                >
                    {word}
                    {idx !== words.length - 1 ? '\u00A0' : ''}
                </motion.span>
            ))}
        </motion.span>
    );
};

const HeroSection: FC = () => {
    return (
        <HeroWrapper>
            <Container maxWidth='md'>
                <Typography
                    color='text.primary'
                    variant='h2'
                    mt={6}
                    sx={{
                        whiteSpace: 'nowrap',
                        fontSize: 'clamp(1.05rem, 5vw, 3.2rem)',
                    }}
                    fontWeight={700}
                    mb='1rem'
                >
                    <AnimatedWords text='Professional & ATS-friendly Resume' />
                </Typography>

                <Typography
                    mt={4}
                    variant='h5'
                    sx={{ color: 'secondary.main', fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' } }}
                    fontWeight={492}
                >
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                </Typography>

                <Typography
                    variant='h5'
                    mb={5}
                    sx={{
                        color: 'secondary.main',
                        fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
                        maxWidth: 780,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    fontWeight={492}
                >
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.
                </Typography>

                <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    sx={{
                        marginTop: { xs: '2rem', sm: '3rem', lg: '2rem' },
                        px: { xs: 3, sm: 4 },
                        width: { xs: '100%', sm: 'auto' },
                        borderRadius: 2.5,
                    }}
                >
                    Get Started Free
                </Button>

                <StepsRow aria-label='steps'>
                    <StepCard
                        sx={(theme) => ({
                            left: { sm: '0%', md: '4%', lg: '6%' },
                            top: { sm: 78, md: 70 },
                            transform: 'rotate(-8deg)',
                            zIndex: 2,
                            [theme.breakpoints.down('sm')]: {
                                left: 'auto',
                                top: 'auto',
                                transform: 'none',
                            },
                        })}
                    >
                        <StepBadge
                            sx={(t) => ({
                                backgroundColor: t.palette.primary.main,
                                border: 'none',
                                color: t.palette.common.white,
                                boxShadow: '0 10px 22px rgba(77, 73, 252, 0.28)',
                            })}
                        >
                            <Typography component='span' sx={{ lineHeight: 1 }}>
                                ✔
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography
                                variant='subtitle1'
                                fontWeight='492'
                                sx={{ color: 'primary.main', lineHeight: 1.15 }}
                            >
                                First Step
                            </Typography>
                            <Typography fontWeight='400' variant='subtitle2' sx={{ color: 'text.secondary' }}>
                                Answer questions
                            </Typography>
                        </Box>
                    </StepCard>

                    <StepCard
                        sx={(theme) => ({
                            left: '50%',
                            top: { sm: 50, md: 56 },
                            transform: 'translateX(-50%)',
                            zIndex: 3,
                            boxShadow: '0 22px 54px rgba(34, 28, 85, 0.14), inset 0 1px 0 rgba(255,255,255,0.75)',
                            [theme.breakpoints.down('sm')]: {
                                left: 'auto',
                                top: 'auto',
                                transform: 'none',
                            },
                        })}
                    >
                        <StepBadge>
                            <Typography component='span' variant='subtitle1' fontWeight='492'>
                                2
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography
                                variant='subtitle1'
                                fontWeight='492'
                                sx={{ color: 'text.primary', lineHeight: 1.15 }}
                            >
                                Second Step
                            </Typography>
                            <Typography fontWeight='400' variant='subtitle2' sx={{ color: 'text.secondary' }}>
                                Review and Submit
                            </Typography>
                        </Box>
                    </StepCard>

                    <StepCard
                        sx={(theme) => ({
                            right: { sm: '0%', md: '4%', lg: '6%' },
                            top: { sm: 78, md: 70 },
                            transform: 'rotate(8deg)',
                            zIndex: 2,
                            [theme.breakpoints.down('sm')]: {
                                right: 'auto',
                                top: 'auto',
                                transform: 'none',
                            },
                        })}
                    >
                        <StepBadge
                            sx={{ backgroundColor: '#EEF0F5', border: '1px solid #EEF0F5', color: 'text.primary' }}
                        >
                            <Typography variant='subtitle1' fontWeight='492' component='span'>
                                3
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography
                                variant='subtitle1'
                                fontWeight='492'
                                sx={{ color: 'text.primary', lineHeight: 1.15 }}
                            >
                                Final Step
                            </Typography>
                            <Typography fontWeight='400' variant='subtitle2' sx={{ color: 'text.secondary' }}>
                                Download a resume
                            </Typography>
                        </Box>
                    </StepCard>
                </StepsRow>
            </Container>
        </HeroWrapper>
    );
};

export default HeroSection;
