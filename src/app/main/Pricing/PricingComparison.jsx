'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Card, CardContent, Chip, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

const HIGHLIGHT_BORDER = '#5B5BFF';
const OUTER_BORDER = '#EAEAEA';
const COL_DIVIDER = '#F0F0F0';
const ROW_DIVIDER = '#F6F6F6';
const HEADER_ROW_HEIGHT = 92;

const PLAN_NAME_TYPOGRAPHY = { variant: 'h6', color: 'info.main', fontWeight: 492 };
const DEFAULT_FEATURE_LABEL_TYPOGRAPHY = { variant: 'body2', sx: { color: '#555' } };

const SX = {
    desktopGrid: (plansCount) => ({
        display: 'grid',
        // Keep all columns the same width on desktop (Best for + N plans)
        gridTemplateColumns: { xs: '1fr', md: `repeat(${plansCount + 1}, minmax(0, 1fr))` },
        width: '100%',
    }),
    featuresCol: {
        boxSizing: 'border-box',
        borderRight: `1px solid ${COL_DIVIDER}`,
    },
    featuresHeaderCell: {
        px: 2,
        minHeight: HEADER_ROW_HEIGHT,
        display: 'flex',
        alignItems: 'center',
    },
    featureLabelCell: {
        px: 2,
        py: 1.5,
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        borderTop: `1px solid ${ROW_DIVIDER}`,
    },
    planValueCell: {
        px: 2,
        py: 1.5,
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: `1px solid ${ROW_DIVIDER}`,
    },
    pricingLabelCell: {
        px: 2,
        py: 1.5,
        borderTop: `1px solid ${ROW_DIVIDER}`,
    },
    pricingLabelTypography: { color: '#555', fontWeight: 600 },
    mobileFeatureRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.25,
        borderTop: `1px solid ${ROW_DIVIDER}`,
    },
};

/**
 * NOTE:
 * Replace the strings/values in `PLANS` + `FEATURES` with the exact content from your screenshot.
 * The layout is wired so swapping data keeps the grid aligned pixel-perfect.
 */
const PLANS = [
    {
        id: 'starter',
        topText: 'Perfect for students & first resume',
        name: 'Starter',
        isPopular: false,
        price: 'Free',
        priceTone: 'free',
        taxNote: 'Total price with 9% Tax',
        cta: { label: 'Upgrade Now', variant: 'outlined' },
    },
    {
        id: 'pro',
        topText: 'For serious job seekers & career ',
        name: 'Pro',
        isPopular: false,
        price: '120 AED',
        priceTone: 'paid',
        taxNote: 'Total price with 9% Tax',
        cta: { label: 'Upgrade Now', variant: 'outlined' },
    },
    {
        id: 'careerPlus',
        topText: 'Active job seekers, career changers',
        name: 'Career Plus',
        isPopular: true,
        price: '250 AED',
        priceTone: 'paid',
        taxNote: 'Total price with 9% Tax',
        cta: { label: 'Upgrade Now', variant: 'contained' },
    },
    {
        id: 'elite',
        topText: 'For professionals, power users ',
        name: 'Elite',
        isPopular: false,
        price: '450 AED',
        priceTone: 'paid',
        taxNote: 'Total price with 9% Tax',
        cta: { label: 'Upgrade Now', variant: 'outlined' },
    },
];

const FEATURES = [
    {
        id: 'planName',
        label: 'Plan Name',
        labelTypography: PLAN_NAME_TYPOGRAPHY,
        availability: { starter: true, pro: true, careerPlus: true, elite: true },
    },
    {
        id: 'atsFriendly',
        label: 'ATS-friendly',
        availability: { starter: false, pro: true, careerPlus: true, elite: true },
    },
    {
        id: 'withWatermark',
        label: 'With watermark',
        availability: { starter: false, pro: true, careerPlus: true, elite: true },
    },
    {
        id: 'templates',
        label: 'Templates',
        availability: { starter: false, pro: true, careerPlus: true, elite: true },
    },
    {
        id: 'jobDescriptionMatch',
        label: 'Job Description Match',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'languagesSupported',
        label: 'languages supported',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'format',
        label: 'Format',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'aiResumeBuilder',
        label: 'AI resume builder',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'aiCoverLetter',
        label: 'AI Cover Letter',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'imagesInput',
        label: 'Images input',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'voiceInput',
        label: 'Voice input',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'videoInput',
        label: 'Video input',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'fileInput',
        label: 'File input',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'wizardEdit',
        label: 'Wizard Edit',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'learningHub',
        label: 'Learning Hub',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'skillGap',
        label: 'Skill gap',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'voiceInterview',
        label: 'Voice interview',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'videoInterview',
        label: 'Video interview',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'questionInterview',
        label: 'Question interview',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'positionSuggestion',
        label: 'Position Suggestion',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
    {
        id: 'processingSpeed',
        label: 'Processing Speed',
        availability: { starter: false, pro: false, careerPlus: true, elite: true },
    },
];

function AvailabilityIcon({ value }) {
    return value ? (
        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
    ) : (
        <CloseIcon sx={{ color: 'error.main', fontSize: 20 }} />
    );
}

function FeatureLabel({ feature, sx }) {
    const t = feature.labelTypography ?? DEFAULT_FEATURE_LABEL_TYPOGRAPHY;

    return (
        <Typography variant={t.variant} color={t.color} fontWeight={t.fontWeight} sx={{ ...(t.sx ?? {}), ...(sx ?? {}) }}>
            {feature.label}
        </Typography>
    );
}

function PlanHeader({ plan }) {
    return (
        <Box
            sx={{
                px: 2,
                minHeight: HEADER_ROW_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <Typography variant='h6' color='text.primary' fontWeight='492'>
                {plan.topText}
            </Typography>
        </Box>
    );
}

function PlanNameCell({ plan }) {
    return (
        <Stack direction='row' alignItems='center' justifyContent='center' spacing={1}>
            <Link
                href='#'
                underline='hover'
                sx={{
                    typography: 'subtitle1',
                    fontWeight: 492,
                    fontSize: '18px',
                    color: 'primary.main',
                    lineHeight: 1.2,
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
                        '& .MuiChip-label': { px: 1, fontSize: 12, fontWeight: 600 },
                    }}
                />
            )}
        </Stack>
    );
}

function PriceFooter({ plan, isHighlighted }) {
    const isFree = plan.priceTone === 'free';

    return (
        <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
                variant='h4'
                sx={{
                    fontWeight: 800,
                    letterSpacing: -0.3,
                    color: isFree ? 'primary.main' : 'text.primary',
                    lineHeight: 1.1,
                }}
            >
                {plan.price}
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                {plan.taxNote}
            </Typography>

            <Button
                fullWidth
                variant={isHighlighted ? 'contained' : plan.cta.variant}
                color='primary'
                sx={{
                    mt: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1.1,
                    ...(isHighlighted
                        ? { boxShadow: 'none' }
                        : {
                              color: 'text.primary',
                              borderColor: 'rgba(0,0,0,0.16)',
                              '&:hover': { borderColor: 'rgba(0,0,0,0.28)' },
                          }),
                }}
            >
                {plan.cta.label}
            </Button>
        </Box>
    );
}

function DesktopComparisonTable() {
    const highlightedId = PLANS.find((p) => p.isPopular)?.id;
    const highlightedRowIdx = 0; // row that starts with "Plan Name"

    return (
        <Box sx={SX.desktopGrid(PLANS.length)}>
            {/* Features column */}
            <Box sx={SX.featuresCol}>
                <Box sx={SX.featuresHeaderCell}>
                    <Typography variant='h6' fontWeight='492'>
                        Best for
                    </Typography>
                </Box>

                {FEATURES.map((f, fIdx) => (
                    <Box key={f.id} sx={[SX.featureLabelCell, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}>
                        <FeatureLabel feature={f} />
                    </Box>
                ))}

                <Box sx={SX.pricingLabelCell}>
                    <Typography variant='body2' sx={SX.pricingLabelTypography}>
                        Pricing
                    </Typography>
                </Box>
            </Box>

            {/* Plan columns */}
            {PLANS.map((plan, idx) => {
                const isHighlighted = plan.id === highlightedId;
                const prevPlan = PLANS[idx - 1];
                const showLeftDivider = idx > 0 && !isHighlighted && !(prevPlan && prevPlan.id === highlightedId);

                return (
                    <Box
                        key={plan.id}
                        sx={{
                            boxSizing: 'border-box',
                            position: 'relative',
                            borderLeft: showLeftDivider ? `1px solid ${COL_DIVIDER}` : 'none',
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
                        {FEATURES.map((f, fIdx) => (
                            <Box
                                key={f.id}
                                sx={[SX.planValueCell, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}
                            >
                                {f.id === 'planName' ? (
                                    <PlanNameCell plan={plan} />
                                ) : (
                                    <AvailabilityIcon value={Boolean(f.availability?.[plan.id])} />
                                )}
                            </Box>
                        ))}
                        <Box sx={{ borderTop: `1px solid ${ROW_DIVIDER}` }}>
                            <PriceFooter plan={plan} isHighlighted={isHighlighted} />
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

function MobilePlanCards() {
    const highlightedId = PLANS.find((p) => p.isPopular)?.id;
    const highlightedRowIdx = 0; // row that starts with "Plan Name"

    return (
        <Stack spacing={2.5}>
            {PLANS.map((plan) => {
                const isHighlighted = plan.id === highlightedId;

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
                                {FEATURES.map((f, fIdx) => (
                                    <Box
                                        key={f.id}
                                        sx={[SX.mobileFeatureRow, fIdx === highlightedRowIdx && { bgcolor: 'info.light' }]}
                                    >
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
                                                            '& .MuiChip-label': {
                                                                px: 1,
                                                                fontSize: 12,
                                                                fontWeight: 600,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                        ) : (
                                            <AvailabilityIcon value={Boolean(f.availability?.[plan.id])} />
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${ROW_DIVIDER}`, textAlign: 'center' }}>
                                <PriceFooter plan={plan} isHighlighted={isHighlighted} />
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </Stack>
    );
}

export default function PricingComparison() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <900px

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        backgroundColor: '#fff',
                        border: `1px solid ${OUTER_BORDER}`,
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ p: { xs: 2, md: 2 } }}>
                        {isMobile ? <MobilePlanCards /> : <DesktopComparisonTable />}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
