import { FC } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';

import { HeroWrapper, StepBadge, StepCard, StepsRow } from './styled';

const HeroSection: FC = () => {
    return (
        <HeroWrapper>
            <Container maxWidth='md'>
                <Typography
                    variant='h2'
                    sx={{
                        color: 'secondary.main',
                        fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.2rem' },
                        lineHeight: 1.1,
                    }}
                    fontWeight={800}
                    mb='1rem'
                >
                    Professional & ATS-friendly Resume
                </Typography>

                <Typography
                    variant='h5'
                    sx={{ color: 'secondary.main', fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' } }}
                    fontWeight={600}
                >
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                </Typography>

                <Typography
                    variant='h5'
                    sx={{
                        color: 'secondary.main',
                        fontSize: { xs: '1.05rem', sm: '1.15rem', md: '1.25rem' },
                        maxWidth: 780,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                    fontWeight={600}
                >
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.
                </Typography>

                <Button
                    variant='contained'
                    color='secondary'
                    size='large'
                    sx={{
                        marginTop: { xs: '2rem', sm: '3rem' },
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
                            <Typography component='span' fontWeight={900} sx={{ lineHeight: 1 }}>
                                ✔
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography fontWeight={800} sx={{ color: 'primary.main', lineHeight: 1.15 }}>
                                First Step
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
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
                            boxShadow:
                                '0 22px 54px rgba(34, 28, 85, 0.14), inset 0 1px 0 rgba(255,255,255,0.75)',
                            [theme.breakpoints.down('sm')]: {
                                left: 'auto',
                                top: 'auto',
                                transform: 'none',
                            },
                        })}
                    >
                        <StepBadge>
                            <Typography component='span' fontWeight={900}>
                                2
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.15 }}>
                                Second Step
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
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
                        <StepBadge sx={{ backgroundColor: '#EEF0F5', border: '1px solid #EEF0F5', color: 'text.primary' }}>
                            <Typography component='span' fontWeight={900}>
                                3
                            </Typography>
                        </StepBadge>
                        <Box textAlign='left'>
                            <Typography fontWeight={800} sx={{ color: 'text.primary', lineHeight: 1.15 }}>
                                Final Step
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
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
