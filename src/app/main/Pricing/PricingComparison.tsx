'use client';

import { useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';

import PricingComparisonClient, { type PricingFeature, type PricingPlan } from './PricingComparisonClient';

type PlansApiResponse = {
    plans: PricingPlan[];
    features: PricingFeature[];
    source?: string;
    generatedAt?: string;
};

/**
 * Client-only wrapper.
 * IMPORTANT: DB access stays on the server (via /api/plans which reads from src/lib/db.ts).
 * No mock fallback: if API fails, we show an error instead of static data.
 */
export default function PricingComparison() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [features, setFeatures] = useState<PricingFeature[]>([]);

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
                setFeatures(Array.isArray(json.features) ? json.features : []);
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

    if (error || plans.length === 0 || features.length === 0) {
        return (
            <Stack width='100%' mt={4} alignItems='center' justifyContent='center'>
                <Typography variant='body2' color='error'>
                    Could not load plans from database{error ? `: ${error}` : ''}
                </Typography>
            </Stack>
        );
    }

    return <PricingComparisonClient plans={plans} features={features} />;
}
