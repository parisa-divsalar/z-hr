'use client';

import { useCallback, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

type PlanCard = {
    id: 'free' | 'mini' | 'starter' | 'pro' | 'elite';
    title: string;
    badge?: string;
    coins: number;
    subtitle: string;
    saveText: string;
    priceText: string;
    ctaText: string;
    highlighted?: boolean;
    isCurrent?: boolean;
};

const PLANS: PlanCard[] = [
    {
        id: 'free',
        title: 'Free',
        coins: 6,
        subtitle: 'For general users',
        saveText: 'Save 0% on features',
        priceText: 'Free',
        ctaText: 'Current Plan',
        isCurrent: true,
    },
    {
        id: 'mini',
        title: 'Mini Pack',
        coins: 10,
        subtitle: 'For advanced users',
        saveText: 'Save 6% on features',
        priceText: '75 AED',
        ctaText: 'Upgrade Now',
    },
    {
        id: 'starter',
        title: 'Starter Pack',
        badge: 'Popular',
        coins: 20,
        subtitle: 'For power users',
        saveText: 'Save 13% on features',
        priceText: '140 AED',
        ctaText: 'Upgrade Now',
        highlighted: true,
    },
    {
        id: 'pro',
        title: 'Pro Pack',
        coins: 35,
        subtitle: 'For power users',
        saveText: 'Save 19% on features',
        priceText: '228 AED',
        ctaText: 'Upgrade Now',
    },
    {
        id: 'elite',
        title: 'Elite Pack',
        coins: 55,
        subtitle: 'For power users',
        saveText: 'Save 25% on features',
        priceText: '330 AED',
        ctaText: 'Upgrade Now',
    },
];

function PlanCardView({
    plan,
    selected,
    onSelect,
}: {
    plan: PlanCard;
    selected: boolean;
    onSelect: (id: PlanCard['id']) => void;
}) {
    const highlighted = Boolean(plan.highlighted);
    const isCurrent = Boolean(plan.isCurrent);

    return (
        <Box
            role='button'
            tabIndex={0}
            aria-label={`${plan.title} plan`}
            aria-pressed={selected}
            onClick={() => onSelect(plan.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(plan.id);
                }
            }}
            sx={{
                flex: '1 1 0',
                minWidth: { xs: '100%', sm: 220 },
                maxWidth: { xs: '100%', md: 230 },
                height: { xs: 'auto', sm: 340 },
                borderRadius: 5,
                bgcolor: '#fff',
                border: selected ? '2px solid #4D49FC' : '1px solid #EEF0F6',
                boxShadow: 'none',
                px: 3.5,
                pt: 3.25,
                pb: 3.25,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.75,
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                outline: 'none',
                '&:hover': {
                    boxShadow: selected ? 'none' : '0px 10px 26px rgba(17, 24, 39, 0.06)',
                },
                '&:focus-visible': {
                    boxShadow: '0px 0px 0px 3px rgba(77, 73, 252, 0.20)',
                },
            }}
        >
            {plan.badge ? (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        px: 1.4,
                        py: 0.55,
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #FF3D6E 0%, #9B3DFF 100%)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 800,
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        boxShadow: '0px 8px 18px rgba(17, 24, 39, 0.16)',
                    }}
                >
                    {plan.badge}
                </Box>
            ) : null}

            <Typography
                variant='subtitle1'
                fontWeight={800}
                color='text.primary'
                sx={{ fontSize: 16, lineHeight: 1.2 }}
            >
                {plan.title}
            </Typography>

            <Stack direction='row' alignItems='baseline' gap={1}>
                <Typography
                    variant='h2'
                    fontWeight={900}
                    color='text.primary'
                    sx={{ letterSpacing: -0.8, lineHeight: 1, fontSize: 44 }}
                >
                    {plan.coins}
                </Typography>
                <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    fontWeight={600}
                    sx={{ fontSize: 13, transform: 'translateY(-2px)' }}
                >
                    Coins
                </Typography>
            </Stack>

            <Typography variant='body2' color='text.secondary' sx={{ mt: -0.5, fontSize: 13 }}>
                {plan.subtitle}
            </Typography>

            <Box
                sx={{
                    alignSelf: 'flex-start',
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: 'rgba(77, 73, 252, 0.08)',
                    color: '#4D49FC',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                }}
            >
                {plan.saveText}
            </Box>

            <Box sx={{ flex: '1 1 auto' }} />

            <Typography variant='subtitle1' fontWeight={800} color='text.primary' sx={{ fontSize: 16 }}>
                {plan.priceText}
            </Typography>

            <MuiButton
                text={plan.ctaText}
                variant={highlighted ? 'contained' : 'outlined'}
                color='inherit'
                fullWidth
                sx={{
                    height: 44,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    boxShadow: 'none',
                    fontWeight: 700,
                    bgcolor: highlighted ? '#111827' : '#fff',
                    color: highlighted ? '#fff' : '#111827',
                    border: highlighted ? '1px solid #111827' : isCurrent ? '1px solid #E6EAF2' : '1px solid #EEF0F6',
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
    const [selectedPlanId, setSelectedPlanId] = useState<PlanCard['id']>('starter');
    const handleSelect = useCallback((id: PlanCard['id']) => setSelectedPlanId(id), []);

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
                py: { xs: 4, md: 8 },
            }}
        >
            <Box
                sx={{
                    width: 'min(95vw, 1200px)',
                }}
            >
                <Stack
                    alignItems='center'
                    justifyContent='center'
                    sx={{
                        width: '100%',
                    }}
                >
                    <Stack
                        direction='row'
                        gap={2.5}
                        alignItems='stretch'
                        justifyContent='center'
                        sx={{
                            width: '100%',
                            flexWrap: { xs: 'wrap', lg: 'nowrap' },
                        }}
                    >
                        {PLANS.map((p) => (
                            <PlanCardView
                                key={p.id}
                                plan={p}
                                selected={p.id === selectedPlanId}
                                onSelect={handleSelect}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
