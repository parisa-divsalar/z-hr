'use client';

import { Box, Breadcrumbs, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import PricingFaqSection from '@/app/(public)/pricing/PricingFaqSection';
import FooterMain from '@/app/main/FooterMain';
import CoinPlansRow from '@/app/main/Pricing';
import PricingComparison from '@/app/main/Pricing/PricingComparison';
import Testimonials from '@/app/main/Testimonials';
import Navbar from '@/components/Layout/Navbar';
import MuiButton from '@/components/UI/MuiButton';


function Sparkle({ size = 18 }: { size?: number }) {
    const gradientId = `pricing-sparkle-${size}`;
    return (
        <Box component='svg' width={size} height={size} viewBox='0 0 24 24' fill='none' aria-hidden='true' sx={{ display: 'block' }}>
            <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='24' y2='24'>
                    <stop offset='0' stopColor='#8B5CF6' />
                    <stop offset='0.55' stopColor='#22C55E' />
                    <stop offset='1' stopColor='#06B6D4' />
                </linearGradient>
            </defs>
            <path d='M12 1.75l1.55 6.1 6.1 1.55-6.1 1.55L12 17.05l-1.55-6.1-6.1-1.55 6.1-1.55L12 1.75z' fill={`url(#${gradientId})`} />
            <path d='M18.75 13.2l.9 3.55 3.55.9-3.55.9-.9 3.55-.9-3.55-3.55-.9 3.55-.9.9-3.55z' fill={`url(#${gradientId})`} />
        </Box>
    );
}

export default function Pricing() {
    return (
        <Box
            sx={{
                minHeight: 'var(--app-height)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fcfbff',
                overflowX: 'hidden',
            }}
        >
            <Navbar />

            <Box component='main' sx={{ flex: 1, width: '100%' }}>
                {/* Hero */}
                <Box sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 8 } }}>
                    <Container maxWidth='lg'>
                        <Stack spacing={2.5} alignItems='center' textAlign='center'>
                            <Breadcrumbs aria-label='breadcrumb' separator='›' sx={{ color: 'text.secondary' }}>
                                <MuiLink component={Link} href='/' underline='hover' color='inherit'>
                                    Home
                                </MuiLink>
                                <Typography variant='body1' fontWeight={584} color='text.primary'>
                                    Pricing
                                </Typography>
                            </Breadcrumbs>

                            <Typography
                                variant='h1'
                                fontWeight={800}
                                color='text.primary'
                                sx={{
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.08,
                                    fontSize: { xs: 34, sm: 44, md: 56 },
                                }}
                            >
                                Three Plans to Boost Your Career
                            </Typography>

                            <Typography
                                variant='subtitle1'
                                fontWeight={492}
                                color='text.secondary'
                                sx={{ maxWidth: 860, lineHeight: 1.8, fontSize: { xs: 14.5, sm: 16 } }}
                            >
                                Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.
                            </Typography>

                            <MuiButton
                                text='Get Started Plan'
                                variant='contained'
                                color='inherit'
                                sx={{
                                    mt: 1,
                                    height: 44,
                                    px: 3,
                                    borderRadius: 2.5,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: '#111827',
                                    color: '#fff',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#0B1220', boxShadow: 'none' },
                                }}
                                onClick={() => {
                                    if (typeof window !== 'undefined') window.location.hash = '#plans';
                                }}
                            />
                        </Stack>
                    </Container>
                </Box>

                {/* Our Plans */}
                <Box id='plans' sx={{ position: 'relative', py: { xs: 4, md: 7 } }}>
                    <Container maxWidth='lg' sx={{ position: 'relative' }}>
                        <Stack spacing={1.25} alignItems='center' textAlign='center'>
                            <Typography
                                variant='h2'
                                fontWeight={800}
                                color='text.primary'
                                sx={{ letterSpacing: '-0.02em', lineHeight: 1.1, fontSize: { xs: 28, sm: 34, md: 40 } }}
                            >
                                Our Plans
                            </Typography>
                            <Typography
                                variant='subtitle1'
                                fontWeight={492}
                                color='text.secondary'
                                sx={{ maxWidth: 860, lineHeight: 1.8, fontSize: { xs: 14.5, sm: 16 } }}
                            >
                                Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                            </Typography>
                        </Stack>

                        <CoinPlansRow />

                        <Box sx={{ mt: { xs: 2, md: 3 } }}>
                            <PricingComparison />
                        </Box>
                    </Container>

                    <Box
                        sx={{
                            position: 'absolute',
                            left: { xs: 16, sm: 24 },
                            top: { xs: 90, md: 120 },
                            width: 40,
                            height: 40,
                            display: 'grid',
                            placeItems: 'center',
                            filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
                            pointerEvents: 'none',
                        }}
                    >
                        <Sparkle size={22} />
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: { xs: 16, sm: 24 },
                            top: { xs: 260, md: 300 },
                            width: 40,
                            height: 40,
                            display: 'grid',
                            placeItems: 'center',
                            filter: 'drop-shadow(0px 8px 14px rgba(16,24,40,0.12))',
                            pointerEvents: 'none',
                        }}
                    >
                        <Sparkle size={22} />
                    </Box>
                </Box>

                {/* FAQ */}
                <PricingFaqSection />

                {/* Testimonials */}
                <Box sx={{ pb: { xs: 6, md: 10 } }}>
                    <Testimonials />
                </Box>
            </Box>

            <FooterMain />
        </Box>
    );
}
