'use client';

import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { useUserProfile } from '@/hooks/useUserProfile';

import type { SxProps, Theme } from '@mui/material/styles';

const HIGHLIGHT_BORDER = '#5B5BFF';
const OUTER_BORDER = '#EAEAEA';
const COL_DIVIDER = '#F0F0F0';
const ROW_DIVIDER = '#EAEAEA';
const HEADER_ROW_HEIGHT = 92;
const CHANNEL_NAME = 'zcv-payment';

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';
type FeatureValue = string | number | boolean | null;

type PaymentResultMessage = {
    type: 'payment_result';
    status: 'success' | 'failed' | 'cancelled';
    planId?: string;
    at: number;
};

export type PricingPlan = {
    id: PlanId;
    topText: string;
    name: string;
    isPopular: boolean;
    price: string;
    priceTone: 'free' | 'paid';
    taxNote?: string;
    cta: { label: string; variant: 'contained' | 'outlined' | 'text' };
};

type FeatureLabelTypography = {
    variant?: ComponentProps<typeof Typography>['variant'];
    sx?: SxProps<Theme>;
};

export type PricingFeature = {
    id: string;
    label: string;
    labelTypography?: FeatureLabelTypography;
    values: Record<PlanId, FeatureValue>;
};

const PLAN_NAME_TYPOGRAPHY: FeatureLabelTypography = { variant: 'h6', sx: { color: 'info.main', fontWeight: 492 } };
const DEFAULT_FEATURE_LABEL_TYPOGRAPHY: FeatureLabelTypography = { variant: 'body2', sx: { color: '#555' } };

const SX = {
    desktopGrid: (plansCount: number) => ({
        display: 'grid',
        // Keep all columns the same width on desktop (Best for + N plans)
        gridTemplateColumns: { xs: '1fr', md: `repeat(${plansCount + 1}, minmax(0, 1fr))` },
        width: '100%',
    }),
    featuresCol: {
        boxSizing: 'border-box',
        borderRight: `1px solid ${COL_DIVIDER}`,
        // Make the last "Pricing" row stretch to match the height of plan footers
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    featuresHeaderCell: {
        px: 2,
        minHeight: HEADER_ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        flex: '0 0 auto',
        borderBottom: `1px solid ${ROW_DIVIDER}`,
    },
    featureLabelCell: {
        px: 2,
        py: 1.5,
        minHeight: 48,
        height: { md: 48 },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        borderBottom: `1px solid ${ROW_DIVIDER}`,
        flex: '0 0 auto',
    },
    planValueCell: {
        px: 2,
        py: 1.5,
        minHeight: 48,
        height: { md: 48 },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
        borderBottom: `1px solid ${ROW_DIVIDER}`,
        flex: '0 0 auto',
    },
    pricingLabelCell: {
        px: 2,
        py: 1.5,
        // Fill the footer row height so it aligns with plan price footers
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'left',
    },
    pricingLabelTypography: { color: '#555', fontWeight: 600 },
    mobileFeatureRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.25,
        borderBottom: `1px solid ${ROW_DIVIDER}`,
    },
};

function CellValue({ value, isEmphasized }: { value: FeatureValue; isEmphasized?: boolean }) {
    if (typeof value === 'boolean') {
        const size = isEmphasized ? 22 : 20;

        return (
            <Box
                component='span'
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: 0,
                }}
            >
                {value ? (
                    <CheckCircleRoundedIcon sx={{ fontSize: size, color: 'success.main' }} titleAccess='Yes' />
                ) : (
                    <CancelRoundedIcon sx={{ fontSize: size, color: 'error.main' }} titleAccess='No' />
                )}
            </Box>
        );
    }

    const text = value == null ? '—' : typeof value === 'number' ? String(value) : value;

    return (
        <Typography
            variant={isEmphasized ? 'subtitle1' : 'body2'}
            color={isEmphasized ? 'primary.main' : 'text.primary'}
            fontWeight={isEmphasized ? 600 : 450}
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
        >
            {text}
        </Typography>
    );
}

function FeatureLabel({ feature, sx }: { feature: PricingFeature; sx?: SxProps<Theme> }) {
    const t = feature.labelTypography ?? DEFAULT_FEATURE_LABEL_TYPOGRAPHY;
    // `SxProps` can itself be an array; flatten to avoid nested arrays (MUI types don't allow that).
    const combinedSx: SxProps<Theme> = [
        ...(t.sx ? (Array.isArray(t.sx) ? t.sx : [t.sx]) : []),
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
    ];

    return (
        <Typography variant={t.variant ?? 'subtitle1'} color='text.primary' fontWeight='450' sx={combinedSx}>
            {feature.label}
        </Typography>
    );
}

function PlanHeader({ plan }: { plan: PricingPlan }) {
    return (
        <Box
            sx={{
                minHeight: HEADER_ROW_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textAlign: 'left',
                px: 2,
                borderBottom: `1px solid ${ROW_DIVIDER}`,
            }}
        >
            <Typography variant='h6' color='text.primary' fontWeight='492'>
                {plan.topText}
            </Typography>
        </Box>
    );
}

function PlanNameCell({ plan }: { plan: PricingPlan }) {
    return (
        <Stack
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            spacing={1}
            sx={{ minWidth: 0, maxWidth: '100%' }}
        >
            <Link
                href='#'
                underline='hover'
                sx={{
                    typography: 'subtitle1',
                    fontWeight: 492,
                    fontSize: '18px',
                    color: 'primary.main',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                }}
            >
                {plan.name}
            </Link>
            {plan.isPopular && (
                <Chip
                    label='Popular'
                    size='small'
                    sx={{
                        height: 22,
                        borderRadius: 999,
                        bgcolor: '#A855F7',
                        color: '#fff',
                        flex: '0 0 auto',
                        '& .MuiChip-label': { px: 1, fontSize: 12, fontWeight: 600 },
                    }}
                />
            )}
        </Stack>
    );
}

function PriceFooter({
    plan,
    isHighlighted,
    isCurrent,
    loading,
    onUpgrade,
}: {
    plan: PricingPlan;
    isHighlighted: boolean;
    isCurrent: boolean;
    loading: boolean;
    onUpgrade: (plan: PricingPlan) => void;
}) {
    return (
        <Stack
            gap={2}
            justifyContent='center'
            mt={2}
            alignItems='flex-start'
            sx={{ flex: 1, width: '100%', textAlign: 'left', px: 2, pb: 2 }}
        >
            <Typography variant='h5' fontWeight='584' color='primary.main'>
                {plan.price}
            </Typography>

            <MuiButton
                fullWidth
                variant={isHighlighted ? 'contained' : plan.cta.variant}
                color='primary'
                disabled={isCurrent || loading}
                onClick={() => onUpgrade(plan)}
            >
                {isCurrent ? 'Current Plan' : loading ? 'Redirecting…' : 'Upgrade Now'}
            </MuiButton>
        </Stack>
    );
}

function DesktopComparisonTable({
    plans,
    features,
    currentPlanId,
    upgradeLoadingPlanId,
    onUpgrade,
}: {
    plans: PricingPlan[];
    features: PricingFeature[];
    currentPlanId: PlanId | null;
    upgradeLoadingPlanId: PlanId | null;
    onUpgrade: (plan: PricingPlan) => void;
}) {
    const highlightedId = plans.find((p) => p.isPopular)?.id;
    const highlightedRowIdx = 0; // row that starts with "Plan Name"
    const priceFeature = features.find((f) => f.id === 'price') ?? { id: 'price', label: 'Price', values: {} as Record<PlanId, FeatureValue> };
    const featureRows = features.filter((f) => f.id !== 'price');

    return (
        <Box sx={SX.desktopGrid(plans.length)}>
            {/* Features column */}
            <Box sx={SX.featuresCol}>
                <Box sx={SX.featuresHeaderCell}>
                    <Typography variant='h6' fontWeight='492'>
                        Best for
                    </Typography>
                </Box>

                {featureRows.map((f, fIdx) => (
                    <Box key={f.id} sx={[SX.featureLabelCell, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}>
                        <FeatureLabel feature={f} />
                    </Box>
                ))}

                <Box sx={SX.pricingLabelCell}>
                    <Typography variant='body2' sx={SX.pricingLabelTypography}>
                        {priceFeature.label}
                    </Typography>
                </Box>
            </Box>

            {/* Plan columns */}
            {plans.map((plan, idx) => {
                const isHighlighted = plan.id === highlightedId;
                const isCurrent = currentPlanId === plan.id;
                const loading = upgradeLoadingPlanId === plan.id;
                const prevPlan = plans[idx - 1];
                const showLeftDivider = idx > 0 && !isHighlighted && !(prevPlan && prevPlan.id === highlightedId);

                return (
                    <Box
                        key={plan.id}
                        sx={{
                            boxSizing: 'border-box',
                            position: 'relative',
                            borderLeft: showLeftDivider ? `1px solid ${COL_DIVIDER}` : 'none',
                            // Keep columns equal height so the footer row stays aligned
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            ...(isHighlighted
                                ? {
                                      borderRadius: 3,
                                      border: `2px solid ${HIGHLIGHT_BORDER}`,
                                      boxShadow: '0px 8px 24px rgba(0,0,0,0.06)',
                                      zIndex: 1,
                                  }
                                : {}),
                        }}
                    >
                        <PlanHeader plan={plan} />
                        {featureRows.map((f, fIdx) => (
                            <Box key={f.id} sx={[SX.planValueCell, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}>
                                {f.id === 'planName' ? (
                                    <PlanNameCell plan={plan} />
                                ) : (
                                    <CellValue value={f.values?.[plan.id]} />
                                )}
                            </Box>
                        ))}
                        <PriceFooter plan={plan} isHighlighted={isHighlighted} isCurrent={isCurrent} loading={loading} onUpgrade={onUpgrade} />
                    </Box>
                );
            })}
        </Box>
    );
}

function MobilePlanCards({
    plans,
    features,
    currentPlanId,
    upgradeLoadingPlanId,
    onUpgrade,
}: {
    plans: PricingPlan[];
    features: PricingFeature[];
    currentPlanId: PlanId | null;
    upgradeLoadingPlanId: PlanId | null;
    onUpgrade: (plan: PricingPlan) => void;
}) {
    const highlightedId = plans.find((p) => p.isPopular)?.id;
    const highlightedRowIdx = 0; // row that starts with "Plan Name"
    const featureRows = features.filter((f) => f.id !== 'price');

    return (
        <Stack spacing={2.5}>
            {plans.map((plan) => {
                const isHighlighted = plan.id === highlightedId;
                const isCurrent = currentPlanId === plan.id;
                const loading = upgradeLoadingPlanId === plan.id;

                return (
                    <Card
                        key={plan.id}
                        variant='outlined'
                        sx={{
                            borderRadius: 3,
                            border: isHighlighted ? `2px solid ${HIGHLIGHT_BORDER}` : `1px solid ${OUTER_BORDER}`,
                            boxShadow: isHighlighted ? '0px 8px 24px rgba(0,0,0,0.06)' : 'none',
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <PlanHeader plan={plan} />
                            </Box>

                            <Box sx={{ mt: 1.5 }}>
                                {featureRows.map((f, fIdx) => (
                                    <Box key={f.id} sx={[SX.mobileFeatureRow, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}>
                                        <FeatureLabel feature={f} sx={{ pr: 2 }} />
                                        {f.id === 'planName' ? (
                                            <Stack direction='row' alignItems='center' spacing={1}>
                                                <Typography variant='h6' color='info.main' fontWeight='492'>
                                                    {plan.name}
                                                </Typography>
                                                {plan.isPopular && (
                                                    <Chip
                                                        label='Popular'
                                                        size='small'
                                                        sx={{
                                                            height: 22,
                                                            borderRadius: 999,
                                                            bgcolor: '#A855F7',
                                                            color: '#fff',
                                                            '& .MuiChip-label': { px: 1, fontSize: 12, fontWeight: 600 },
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                        ) : (
                                            <CellValue value={f.values?.[plan.id]} />
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            <PriceFooter plan={plan} isHighlighted={isHighlighted} isCurrent={isCurrent} loading={loading} onUpgrade={onUpgrade} />
                        </CardContent>
                    </Card>
                );
            })}
        </Stack>
    );
}

export default function PricingComparisonClient({ plans, features }: { plans: PricingPlan[]; features: PricingFeature[] }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <900px
    const router = useRouter();
    const { profile } = useUserProfile({ enabled: true });

    const [paymentResult, setPaymentResult] = useState<PaymentResultMessage | null>(null);
    const [upgradeLoadingPlanId, setUpgradeLoadingPlanId] = useState<PlanId | null>(null);
    const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null);

    const profileCurrentPlanIdRaw = (profile as any)?.current_plan_id ?? (profile as any)?.currentPlanId ?? null;
    useEffect(() => {
        const s = String(profileCurrentPlanIdRaw ?? '').trim().toLowerCase();
        const next: PlanId | null = s === 'starter' || s === 'pro' || s === 'plus' || s === 'elite' ? (s as PlanId) : null;
        setCurrentPlanId(next);
    }, [profileCurrentPlanIdRaw]);

    const hydratedFeatures: PricingFeature[] = features.map((f) => ({
        ...f,
        ...(f.id === 'planName' ? { labelTypography: PLAN_NAME_TYPOGRAPHY } : {}),
    }));

    useEffect(() => {
        const handlePayload = (payload: unknown) => {
            if (!payload || typeof payload !== 'object') return;
            const p = payload as Partial<PaymentResultMessage>;
            if (p.type !== 'payment_result') return;
            if (p.status !== 'success' && p.status !== 'failed' && p.status !== 'cancelled') return;
            setPaymentResult({
                type: 'payment_result',
                status: p.status,
                planId: typeof p.planId === 'string' ? p.planId : undefined,
                at: typeof p.at === 'number' ? p.at : Date.now(),
            });

            if (p.status === 'success' && typeof p.planId === 'string') {
                const s = p.planId.trim().toLowerCase();
                const next: PlanId | null = s === 'starter' || s === 'pro' || s === 'plus' || s === 'elite' ? (s as PlanId) : null;
                if (next) setCurrentPlanId(next);
            }
        };

        let bc: BroadcastChannel | null = null;
        try {
            bc = new BroadcastChannel(CHANNEL_NAME);
            bc.onmessage = (e) => handlePayload(e.data);
        } catch {
            // ignore
        }

        const onWindowMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            handlePayload(event.data);
        };
        window.addEventListener('message', onWindowMessage);

        return () => {
            window.removeEventListener('message', onWindowMessage);
            try {
                bc?.close();
            } catch {
                // ignore
            }
        };
    }, []);

    const handleUpgradeClick = async (plan: PricingPlan) => {
        const planId = plan?.id;
        if (!planId) return;
        if (!profile?.id) {
            router.push(PublicRoutes.login);
            return;
        }
        if (currentPlanId === planId) return;

        setUpgradeLoadingPlanId(planId);
        try {
            const res = await fetch('/api/payment/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ planId }),
                cache: 'no-store',
            });
            const json = await res.json().catch(() => ({} as any));
            if (res.status === 401) {
                setUpgradeLoadingPlanId(null);
                router.push(PublicRoutes.login);
                return;
            }
            if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
            const url = String(json?.paymentUrl ?? '').trim();
            if (!url) throw new Error('Missing paymentUrl');
            const w = window.open(url, '_blank', 'noopener,noreferrer');
            if (!w || w.closed) window.location.href = url;
            return;
        } catch (e) {
            console.error('Upgrade create-session failed:', e);
            setUpgradeLoadingPlanId(null);
        }
    };

    return (
        <Stack width='100%' mt={4}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 0 }}>
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        border: `1px solid ${OUTER_BORDER}`,
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ px: 0, py: { xs: 2, md: 2 } }}>
                        {isMobile ? (
                            <MobilePlanCards
                                plans={plans}
                                features={hydratedFeatures}
                                currentPlanId={currentPlanId}
                                upgradeLoadingPlanId={upgradeLoadingPlanId}
                                onUpgrade={handleUpgradeClick}
                            />
                        ) : (
                            <DesktopComparisonTable
                                plans={plans}
                                features={hydratedFeatures}
                                currentPlanId={currentPlanId}
                                upgradeLoadingPlanId={upgradeLoadingPlanId}
                                onUpgrade={handleUpgradeClick}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            <Dialog open={Boolean(paymentResult)} onClose={() => setPaymentResult(null)} fullWidth maxWidth='xs'>
                <DialogTitle>Payment result</DialogTitle>
                <DialogContent dividers>
                    <Stack gap={1}>
                        <Typography variant='body2' color='text.secondary'>
                            Status:{' '}
                            <Typography component='span' variant='body2' fontWeight={700} color='text.primary'>
                                {paymentResult?.status ?? '—'}
                            </Typography>
                        </Typography>
                        {paymentResult?.planId ? (
                            <Typography variant='body2' color='text.secondary'>
                                Plan:{' '}
                                <Typography component='span' variant='body2' fontWeight={700} color='text.primary'>
                                    {paymentResult.planId}
                                </Typography>
                            </Typography>
                        ) : null}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <MuiButton fullWidth color='primary' variant='contained' onClick={() => setPaymentResult(null)}>
                        OK
                    </MuiButton>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}


