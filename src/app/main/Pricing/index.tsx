'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import MuiButton from '@/components/UI/MuiButton';

type PlanCard = {
    id: string;
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

type CoinPackageRow = {
    id?: number | string;
    package_name?: string;
    coin_amount?: number | string;
    price_aed?: number | string;
    user_saving_percent?: number | string;
    [k: string]: unknown;
};

type CoinPackagesApiResponse = { data?: CoinPackageRow[]; error?: string; generatedAt?: string };

function safeStr(v: unknown): string {
    return String(v ?? '').trim();
}

function toFiniteNumber(v: unknown, fallback = 0): number {
    if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
    if (typeof v === 'string') {
        const n = Number(v.replace(/,/g, '').trim());
        return Number.isFinite(n) ? n : fallback;
    }
    const n = Number(v as any);
    return Number.isFinite(n) ? n : fallback;
}

function formatAed(priceAed: number): string {
    const n = Number.isFinite(priceAed) ? priceAed : 0;
    if (n <= 0) return 'Free';
    const rounded = Math.round(n * 100) / 100;
    const label = rounded % 1 === 0 ? String(rounded.toFixed(0)) : String(rounded.toFixed(2));
    return `${label} AED`;
}

function normalizePackagesToPlans(rows: CoinPackageRow[]): PlanCard[] {
    const safeRows = Array.isArray(rows) ? rows : [];

    const paidRows = safeRows.filter((r) => toFiniteNumber(r?.price_aed, 0) > 0);
    const popularRow =
        paidRows.length === 0
            ? null
            : paidRows.reduce<CoinPackageRow | null>((best, r) => {
                  if (!best) return r;
                  const s1 = toFiniteNumber(best?.user_saving_percent, 0);
                  const s2 = toFiniteNumber(r?.user_saving_percent, 0);
                  if (s2 !== s1) return s2 > s1 ? r : best;
                  const c1 = toFiniteNumber(best?.coin_amount, 0);
                  const c2 = toFiniteNumber(r?.coin_amount, 0);
                  return c2 > c1 ? r : best;
              }, null);

    const popularKey = popularRow ? safeStr(popularRow.id) || safeStr(popularRow.package_name) : '';

    const plans = safeRows
        .map((row, idx) => {
            const title = safeStr(row?.package_name) || `Package ${idx + 1}`;
            const id = safeStr(row?.id) || safeStr(row?.package_name) || String(idx + 1);
            const coins = Math.max(0, Math.round(toFiniteNumber(row?.coin_amount, 0)));
            const priceAed = toFiniteNumber(row?.price_aed, 0);
            const saving = Math.max(0, Math.round(toFiniteNumber(row?.user_saving_percent, 0)));
            const isCurrent = priceAed <= 0 || title.toLowerCase() === 'free';

            const isPopular = Boolean(popularKey) && (safeStr(row?.id) === popularKey || safeStr(row?.package_name) === popularKey);

            return {
                id,
                title,
                coins,
                subtitle: '',
                saveText: `Save ${saving}% on features`,
                priceText: formatAed(priceAed),
                ctaText: isCurrent ? 'Current Plan' : 'Upgrade Now',
                isCurrent,
                badge: isPopular ? 'Popular' : undefined,
                highlighted: isPopular,
            } satisfies PlanCard;
        })
        .filter((p) => Boolean(p.id) && Boolean(p.title));

    // Keep a stable, sensible order (by coins, with Free first if present).
    plans.sort((a, b) => {
        const aFree = a.priceText === 'Free' ? 1 : 0;
        const bFree = b.priceText === 'Free' ? 1 : 0;
        if (aFree !== bFree) return bFree - aFree; // free first
        return a.coins - b.coins;
    });

    return plans;
}

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
                maxWidth: { xs:
                        '100%', md: 230 },
                height: { xs: 'auto', sm: 433 },
                borderRadius: '24px',
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
                transition: 'border-color 160ms ease, box-shadow 160ms ease',
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
                pt={3}
                variant='h5'
                fontWeight={584}
                color='text.primary'
                sx={{  lineHeight: 1.2 }}
            >
                {plan.title}
            </Typography>

            <Stack direction='row' alignItems='baseline' gap={1} >
                <Typography
                    variant='h3'
                    fontWeight={700}
                    color='text.primary'
                    sx={{ letterSpacing: -0.8, lineHeight: 1, fontSize: 44 }}
                >
                    {plan.coins}
                </Typography>
                <Typography
                    variant='subtitle2'
                    color='text.primary'
                    fontWeight={700}
                    sx={{ transform: 'translateY(-2px)' }}
                >
                    Coins
                </Typography>
            </Stack>



            <Box
mt={4}
                sx={{
                    alignSelf: 'flex-start',
                    px: 1.75,
                    py: 1.2,
                    borderRadius: '12px',
                    bgcolor: 'rgba(77, 73, 252, 0.08)',
                    color: '#4D49FC',
                    fontSize: 13,
                    fontWeight: 492,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                }}
            >
                {plan.saveText}
            </Box>


            <Typography variant='subtitle1' pt={5} fontWeight={584} color='text.primary' sx={{ fontSize: 16 }}>
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

const Pricing = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<PlanCard[]>([]);

    const defaultSelectedId = useMemo(() => plans.find((p) => p.highlighted)?.id ?? plans[0]?.id ?? '', [plans]);
    const [selectedPlanId, setSelectedPlanId] = useState<PlanCard['id']>('');
    const handleSelect = useCallback((id: PlanCard['id']) => setSelectedPlanId(id), []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/pricing/coin-packages', { headers: { Accept: 'application/json' }, cache: 'no-store', signal });
                const json = (await res.json().catch(() => ({}))) as CoinPackagesApiResponse;
                if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
                const rows = Array.isArray(json?.data) ? json.data : [];
                const nextPlans = normalizePackagesToPlans(rows);
                setPlans(nextPlans);
            } catch (e) {
                if (signal.aborted) return;
                setError(e instanceof Error ? e.message : 'Failed to load coin packages');
                setPlans([]);
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!defaultSelectedId) return;
        setSelectedPlanId((prev) => (prev ? prev : defaultSelectedId));
    }, [defaultSelectedId]);

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                py: { xs: 4, md: 7 },
            }}
        >
            <Box sx={{ width: 'min(95vw, 1200px)' }}>
                {loading ? (
                    <Stack width='100%' alignItems='center' justifyContent='center' py={4}>
                        <Typography variant='body2' color='text.secondary'>
                            Loading plans...
                        </Typography>
                    </Stack>
                ) : error || plans.length === 0 ? (
                    <Stack width='100%' alignItems='center' justifyContent='center' py={4}>
                        <Typography variant='body2' color='error'>
                            Could not load coin packages from database{error ? `: ${error}` : ''}
                        </Typography>
                    </Stack>
                ) : (
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
                        {plans.map((p) => (
                            <PlanCardView key={p.id} plan={p} selected={p.id === selectedPlanId} onSelect={handleSelect} />
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default Pricing;
