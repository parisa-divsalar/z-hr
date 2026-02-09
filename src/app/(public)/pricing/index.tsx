'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import logo from '@/assets/images/logo/logo.png';
import { AppImage } from '@/components/AppImage';
import MuiButton from '@/components/UI/MuiButton';

type PlanCard = {
    id: 'pro' | 'career-plus' | 'elite';
    title: string;
    badge?: string;
    coins: number;
    subtitle: string;
    features: string[];
    ctaText: string;
    highlighted?: boolean;
};

const PLANS: PlanCard[] = [
    {
        id: 'pro',
        title: 'Pro',
        badge: 'Popular',
        coins: 500,
        subtitle: 'For advanced users',
        features: [
            'Search Boost',
            'Eye-Catching Design',
            'Multilingual Support',
            'Anytime Access',
            'Key Metrics',
            'Trend Insights',
            'User Engagement',
            'Mobile Access',
            'Content Strategy',
            'Social Media',
        ],
        ctaText: '100 AED / Upgrade Now',
        highlighted: true,
    },
    {
        id: 'career-plus',
        title: 'Carrer Plus',
        coins: 1000,
        subtitle: 'For power users',
        features: [
            'Collaborative Tools',
            'Integration Options',
            'Brand Customization',
            'Revision History',
            'Data Security',
            'Team Communication',
            'Project Management',
            'Cloud Access',
            'User Permissions',
            'Feedback Loops',
        ],
        ctaText: '250 AED / Upgrade Now',
    },
    {
        id: 'elite',
        title: 'Elite',
        coins: 1000,
        subtitle: 'For power users',
        features: [
            'Collaborative Tools',
            'Integration Options',
            'Brand Customization',
            'Revision History',
            'Data Security',
            'Team Communication',
            'Project Management',
            'Cloud Access',
            'User Permissions',
            'Feedback Loops',
        ],
        ctaText: '500 AED / Upgrade Now',
    },
];

function PlanCardView({ plan }: { plan: PlanCard }) {
    const highlighted = Boolean(plan.highlighted);

    return (
        <Box
            sx={{
                flex: '1 1 0',
                minWidth: { xs: '100%', md: 0 },
                borderRadius: 3,
                bgcolor: '#fff',
                border: highlighted ? '2px solid #4D49FC' : '1px solid #EEF0F6',
                boxShadow: 'none',
                px: 3,
                pt: 3,
                pb: 2.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
                <Typography variant='h6' fontWeight={800} color='text.primary'>
                    {plan.title}
                </Typography>
                {plan.badge ? (
                    <Box
                        sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 99,
                            background: 'linear-gradient(90deg, #FF3D6E 0%, #9B3DFF 100%)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {plan.badge}
                    </Box>
                ) : null}
            </Stack>

            <Stack direction='row' alignItems='baseline' gap={1}>
                <Typography
                    variant='h3'
                    fontWeight={900}
                    color='text.primary'
                    sx={{ letterSpacing: -0.5, lineHeight: 1 }}
                >
                    {plan.coins}
                </Typography>
                <Typography variant='subtitle2' color='text.secondary' fontWeight={600}>
                    Coins
                </Typography>
            </Stack>

            <Typography variant='body2' color='text.secondary' sx={{ mt: -0.5 }}>
                {plan.subtitle}
            </Typography>

            <Box sx={{ flex: '1 1 auto', pt: 0.5 }}>
                <Stack component='ul' sx={{ listStyle: 'disc', pl: 2.25, m: 0 }} gap={1}>
                    {plan.features.map((f) => (
                        <Typography key={f} component='li' variant='body2' color='text.primary' sx={{ opacity: 0.9 }}>
                            {f}
                        </Typography>
                    ))}
                </Stack>
            </Box>

            <MuiButton
                text={plan.ctaText}
                variant={highlighted ? 'contained' : 'outlined'}
                color='inherit'
                fullWidth
                sx={{
                    height: 44,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: 'none',
                    fontWeight: 700,
                    bgcolor: highlighted ? '#111827' : '#fff',
                    color: highlighted ? '#fff' : '#111827',
                    border: highlighted ? '1px solid #111827' : '1px solid #EEF0F6',
                    '&:hover': {
                        bgcolor: highlighted ? '#0B1220' : 'grey.50',
                        boxShadow: 'none',
                        borderColor: highlighted ? '#0B1220' : '#E6EAF2',
                    },
                }}
            />
        </Box>
    );
}

export default function Pricing() {
    return (
        <Box
            sx={{
                minHeight: 'var(--app-height)',
                width: '100%',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: 6,
            }}
        >
            <Box
                sx={{
                    width: 'min(92vw, 1040px)',
                    borderRadius: 4,
                    border: '1px solid #E8E8EE',
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    boxShadow: '0px 12px 40px rgba(17, 24, 39, 0.08)',
                }}
            >
                {/* Header */}
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                        px: 3,
                        py: 2,
                        bgcolor: '#FAFAFC',
                    }}
                >
                    <Stack direction='row' alignItems='center' gap={1.5} sx={{ minWidth: 0 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(77, 73, 252, 0.10)',
                                border: '1px solid rgba(77, 73, 252, 0.16)',
                                flex: '0 0 auto',
                            }}
                        >
                            <AppImage src={logo} width={18} height={24} alt='Z-CV logo' />
                        </Box>

                        <Stack sx={{ minWidth: 0 }}>
                            <Typography variant='subtitle1' fontWeight={800} color='text.primary' lineHeight={1.1} noWrap>
                                Z-CV
                            </Typography>
                            <Typography variant='caption' color='text.secondary' lineHeight={1.1} noWrap>
                                AI Resume Maker
                            </Typography>
                        </Stack>
                    </Stack>

                    <Link
                        href='/'
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 600,
                        }}
                    >
                        <Typography variant='subtitle2' fontWeight={600} color='text.primary'>
                            Website
                        </Typography>
                        <ArrowForwardIcon sx={{ fontSize: 18 }} />
                    </Link>
                </Stack>

                <Divider />

                {/* Body */}
                <Stack
                    alignItems='center'
                    justifyContent='center'
                    sx={{
                        px: { xs: 2, md: 4 },
                        pt: 5,
                        pb: 4,
                    }}
                >
                    <Typography variant='h5' fontWeight={800} color='text.primary' textAlign='center' sx={{ mb: 0.75 }}>
                        Our Plans
                    </Typography>
                    <Typography variant='body2' color='text.secondary' textAlign='center' sx={{ mb: 3 }}>
                        You can purchase our plans to take advantage of our features.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        gap={3}
                        alignItems='stretch'
                        justifyContent='center'
                        sx={{ width: '100%' }}
                    >
                        {PLANS.map((p) => (
                            <PlanCardView key={p.id} plan={p} />
                        ))}
                    </Stack>
                </Stack>

                <Divider />

                {/* Footer */}
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                        px: 3,
                        py: 2,
                        bgcolor: '#FAFAFC',
                    }}
                >
                    <Typography variant='subtitle1' fontWeight={800} color='text.primary'>
                        Z-CV
                    </Typography>

                    <Typography variant='caption' color='text.secondary' sx={{ textAlign: 'center' }}>
                        All rights reserved. &nbsp; © 2025
                    </Typography>

                    <Stack direction='row' gap={0.5}>
                        {[
                            { label: 'Facebook', icon: <FacebookIcon sx={{ fontSize: 18 }} /> },
                            { label: 'LinkedIn', icon: <LinkedInIcon sx={{ fontSize: 18 }} /> },
                            { label: 'Instagram', icon: <InstagramIcon sx={{ fontSize: 18 }} /> },
                            { label: 'X', icon: <XIcon sx={{ fontSize: 18 }} /> },
                        ].map((item) => (
                            <IconButton
                                key={item.label}
                                aria-label={item.label}
                                size='small'
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 2,
                                    bgcolor: '#fff',
                                    border: '1px solid #EEF0F6',
                                    color: 'text.secondary',
                                    '&:hover': { bgcolor: 'grey.50' },
                                }}
                            >
                                {item.icon}
                            </IconButton>
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
