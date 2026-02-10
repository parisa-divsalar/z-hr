'use client';

import { useEffect, useState } from 'react';

import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';

type PricingPlan = {
    id: PlanId;
    topText: string;
    name: string;
    isPopular: boolean;
    price: string;
    priceTone: 'free' | 'paid';
    taxNote?: string;
    cta: { label: string; variant: 'contained' | 'outlined' | 'text' };
};

type PlansApiResponse = {
    plans: PricingPlan[];
};

export default function PlansBelowComparison() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<PricingPlan[]>([]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/plans', { headers: { Accept: 'application/json' }, cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as PlansApiResponse;
                if (cancelled) return;
                setPlans(Array.isArray(json.plans) ? json.plans : []);
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : 'Failed to load plans');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <Stack width='100%' mt={4} alignItems='center' justifyContent='center'>
                <Typography variant='body2' color='text.secondary'>
                    Loading plans...
                </Typography>
            </Stack>
        );
    }

    if (error || plans.length === 0) {
        return (
            <Stack width='100%' mt={4} alignItems='center' justifyContent='center'>
                <Typography variant='body2' color='error'>
                    Could not load plans from database{error ? `: ${error}` : ''}
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack width='100%' mt={5} spacing={2} alignItems='center'>
            <Typography variant='h4' color='secondary.main' fontWeight={700}>
                Choose your plan
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1200,
                    px: { xs: 2, md: 0 },
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                }}
            >
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        variant='outlined'
                        sx={{
                            borderRadius: 3,
                            borderColor: plan.isPopular ? 'primary.main' : 'divider',
                            boxShadow: plan.isPopular ? '0px 8px 24px rgba(0,0,0,0.06)' : 'none',
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Stack spacing={1.25} textAlign='left'>
                                <Typography variant='subtitle1' fontWeight={700} color='primary.main'>
                                    {plan.name}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {plan.topText}
                                </Typography>

                                <Stack spacing={0.25} mt={1}>
                                    <Typography variant='h5' fontWeight={700} color='text.primary'>
                                        {plan.price}
                                    </Typography>
                                    {plan.taxNote ? (
                                        <Typography variant='caption' color='text.secondary'>
                                            {plan.taxNote}
                                        </Typography>
                                    ) : null}
                                </Stack>

                                <MuiButton
                                    fullWidth
                                    color='primary'
                                    variant={plan.cta.variant}
                                    onClick={() => {
                                        const url = `/payment/test?plan=${encodeURIComponent(plan.id)}`;
                                        window.open(url, '_blank', 'noopener,noreferrer');
                                    }}
                                >
                                    {plan.cta.label}
                                </MuiButton>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Stack>
    );
}









