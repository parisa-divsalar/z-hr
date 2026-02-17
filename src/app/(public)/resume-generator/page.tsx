'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box, CircularProgress, Dialog, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter, useSearchParams } from 'next/navigation';

import ArrowIcon from '@/assets/images/dashboard/Icon.svg';
import LinkDarkIcon from '@/assets/images/icons/link-dark.svg';
import ArrowRightIcon from '@/assets/images/icons/links.svg';
import type { MoreFeatureSuggestion } from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { useHistoryResumeRow } from '@/hooks/useHistoryResumeRow';
import { useWizardStore } from '@/store/wizard';
import { exportElementToPdf, exportElementToPdfPreviewImage, sanitizeFileName } from '@/utils/exportToPdf';

import {
    Container,
    HeaderSection,
    ResumePreview,
    InfoTable,
    InfoRow,
    FitScoreBadge,
    ActionButtons,
    FeatureCard,
    FeatureCardIcon,
    HeaderLeft,
    PurplePill,
    StyledDivider,
} from './styled';

const ResumeGeneratorPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const requestId = useWizardStore((state) => state.requestId);
    const setRequestId = useWizardStore((state) => state.setRequestId);
    const resumePdfRef = useRef<HTMLDivElement | null>(null);

    const { row: historyRow } = useHistoryResumeRow(requestId);

    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [featureCards, setFeatureCards] = useState<{ id: number | string; title: string; description: string }[]>(
        [],
    );
    const [featureCardsLoading, setFeatureCardsLoading] = useState(true);
    const [featureCardsError, setFeatureCardsError] = useState<string | null>(null);

    useEffect(() => {
        const raw = searchParams.get('requestId') ?? searchParams.get('RequestId');
        if (!raw) return;
        const trimmed = raw.trim();
        if (!trimmed) return;
        const normalized =
            trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1).trim() : trimmed;
        if (normalized) setRequestId(normalized);
    }, [searchParams, setRequestId]);

    useEffect(() => {
        let isMounted = true;
        const loadFeatureCards = async () => {
            setFeatureCardsLoading(true);
            setFeatureCardsError(null);
            try {
                const res = await fetch('/api/more-features', { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = (await res.json()) as MoreFeatureSuggestion[];
                const rows = Array.isArray(json) ? json : [];
                const mapped = rows
                    .map((row, index) => ({
                        id: row.id ?? `${row.title ?? 'feature'}-${index}`,
                        title: row.title ?? 'Untitled',
                        description: row.description ?? '',
                    }))
                    .filter((row) => row.title || row.description);
                if (isMounted) setFeatureCards(mapped);
            } catch (error) {
                if (isMounted) {
                    setFeatureCardsError(error instanceof Error ? error.message : 'Failed to load features');
                    setFeatureCards([]);
                }
            } finally {
                if (isMounted) setFeatureCardsLoading(false);
            }
        };

        loadFeatureCards();
        return () => {
            isMounted = false;
        };
    }, []);

    const renderResumeThumbnail = useCallback(async () => {
        const element = resumePdfRef.current;
        if (!element) return;

        setIsPreviewLoading(true);
        setPreviewError(null);

        try {
            const dataUrl = await exportElementToPdfPreviewImage(element, {
                // Match PDF framing defaults (A4 portrait with margins), but keep it fast.
                marginPt: 24,
                scale: 1,
                backgroundColor: '#ffffff',
                imageType: 'JPEG',
                jpegQuality: 0.82,
                waitForFonts: true,
                waitForImages: true,
                resourceTimeoutMs: 2500,
            });

            if (!dataUrl) {
                throw new Error('Preview image is empty.');
            }

            setPreviewSrc(dataUrl);
        } catch (e) {
             
            console.error('Failed to render resume thumbnail', e);
            setPreviewError('Failed to render PDF preview.');
            setPreviewSrc(null);
        } finally {
            setIsPreviewLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        setPreviewSrc(null);
        setPreviewError(null);

        // Retry a few times because ResumeEditor loads its content asynchronously.
        const run = async () => {
            for (let attempt = 0; attempt < 8; attempt++) {
                if (cancelled) return;
                if (resumePdfRef.current) {
                    // Give the browser a tick to paint updated resume content.
                    await new Promise<void>((r) => requestAnimationFrame(() => r()));
                    const textLen = (resumePdfRef.current.textContent ?? '').replace(/\s+/g, ' ').trim().length;
                    // Heuristic: wait until the resume actually has some content before capturing.
                    if (textLen < 40) {
                        await new Promise((r) => window.setTimeout(r, 300));
                        continue;
                    }

                    await renderResumeThumbnail();
                    return;
                }
                await new Promise((r) => window.setTimeout(r, 250));
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [requestId, renderResumeThumbnail]);

    const resumeInfo = [
        { label: 'Created:', value: historyRow?.date || '—' },
        { label: 'Size:', value: historyRow?.size || '—' },
        { label: 'Fit score:', value: historyRow?.Percentage || '—', isBadge: true },
        { label: 'Skill group:', value: historyRow?.position || '—' },
        { label: 'Experience level:', value: historyRow?.level || '—' },
    ];

    const headerTitle = (() => {
        const base = String(historyRow?.name ?? '').trim();
        if (!base) return 'Resume';
        return /resume/i.test(base) ? base : `${base}'s Resume`;
    })();

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleDownload = useCallback(async () => {
        if (!resumePdfRef.current || isDownloading) return;
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadError(null);
        try {
            const date = new Date().toISOString().slice(0, 10);
            const baseName = sanitizeFileName(`Resume-${requestId ?? date}`) || sanitizeFileName('Resume') || 'Resume';
            await exportElementToPdf(resumePdfRef.current, {
                fileName: baseName,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
                // Keep UX consistent with ResumeEditor (no new tab).
                preOpenWindow: false,
            });
        } catch (error) {
            console.error('Failed to export PDF', error);
            setDownloadError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading, requestId]);

    const handleEdit = useCallback(() => {
        const qs = new URLSearchParams();
        qs.set('step', '3');
        if (requestId) qs.set('requestId', requestId);
        router.push(`/resume-builder?${qs.toString()}`);
    }, [router, requestId]);

    return (
        <Container>
            {/* Render the same resume DOM as ResumeEditor (off-screen) and export that exact element. */}
            <Box sx={{ position: 'fixed', left: '-100000px', top: 0, width: 900, pointerEvents: 'none' }}>
                <ResumeEditor
                    mode='preview'
                    pdfTargetRef={resumePdfRef}
                    setStage={() => undefined}
                    setActiveStep={() => undefined}
                />
            </Box>
            <Grid container spacing={{ xs: 3, sm: 4 }}>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <ResumePreview>
                        {previewSrc ? (
                            <Box
                                component='img'
                                src={previewSrc}
                                alt='Resume preview'
                                onClick={() => setIsPreviewOpen(true)}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                    opacity: 1,
                                    filter: 'none',
                                    cursor: 'pointer',
                                }}
                            />
                        ) : (
                            <Stack alignItems='center' justifyContent='center' spacing={1} sx={{ px: 2 }}>
                                {isPreviewLoading ? <CircularProgress size={22} /> : null}
                                <Typography variant='body2' color='text.secondary' textAlign='center'>
                                    {previewError ?? (isPreviewLoading ? 'Generating preview…' : 'Preview will appear here')}
                                </Typography>
                            </Stack>
                        )}
                    </ResumePreview>
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                    <InfoTable>
                        <HeaderSection>
                            <HeaderLeft>
                                <Typography
                                    variant='h5'
                                    color='text.primary'
                                    fontWeight='500'
                                    sx={{
                                        fontSize: { xs: '1.5rem', sm: '2.125rem' },
                                    }}
                                >
                                    {headerTitle}
                                </Typography>
                                <PurplePill>AI Generation</PurplePill>
                            </HeaderLeft>
                            <MuiButton
                                size='medium'
                                variant='outlined'
                                endIcon={<ArrowIcon />}
                                color='secondary'
                                href='/dashboard'
                            >
                                Go to panel
                            </MuiButton>
                        </HeaderSection>

                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mb: 1 }} />}
                                {resumeInfo.map((info, index) => (
                                    <InfoRow key={index}>
                                        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                                            {info.label}
                                        </Typography>
                                        {info.isBadge ? (
                                            <FitScoreBadge>{info.value}</FitScoreBadge>
                                        ) : (
                                            <Typography variant='subtitle2' color='text.primary' fontWeight='500'>
                                                {info.value}
                                            </Typography>
                                        )}
                                    </InfoRow>
                                ))}
                                <Grid size={{ xs: 12, sm: 4, lg: 4 }} mt={6}>
                                    <ActionButtons>
                                        <MuiButton variant='outlined' size='large' color='secondary' onClick={handleEdit}>
                                            Edit
                                        </MuiButton>
                                        <MuiButton
                                            variant='contained'
                                            size='large'
                                            color='secondary'
                                            sx={{ width: '200px' }}
                                            loading={isDownloading}
                                            onClick={handleDownload}
                                        >
                                            {isDownloading
                                                ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%`
                                                : 'Download PDF'}
                                        </MuiButton>
                                    </ActionButtons>
                                </Grid>
                            </Grid>
                        </Grid>
                    </InfoTable>
                </Grid>
            </Grid>

            <Dialog
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                fullScreen={isSmallScreen}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        bgcolor: '#fff',
                        boxShadow: theme.shadows[6],
                        overflow: 'hidden',
                        borderRadius: isSmallScreen ? 0 : 2,
                        m: { xs: 0, sm: 2 },
                    },
                }}
                BackdropProps={{
                    // User asked for a white/very light "gallery" background (not dark).
                    sx: { backgroundColor: 'rgba(250,250,250,0.98)' },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: isSmallScreen ? '100vw' : '92vw',
                        height: isSmallScreen ? '100vh' : '92vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 1.5, sm: 2 },
                    }}
                >
                    <IconButton
                        aria-label='Close preview'
                        onClick={() => setIsPreviewOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            color: theme.palette.text.primary,
                            bgcolor: 'rgba(255,255,255,0.85)',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': { bgcolor: '#fff' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {previewSrc ? (
                        <Box
                            component='img'
                            src={previewSrc}
                            alt='Resume preview large'
                            onDoubleClick={handleEdit}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: 1,
                                bgcolor: '#fff',
                                opacity: 1,
                                filter: 'none',
                            }}
                        />
                    ) : null}
                </Box>
            </Dialog>

            <StyledDivider />

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {featureCardsLoading ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant='body2' color='text.secondary'>
                            Loading features...
                        </Typography>
                    </Grid>
                ) : featureCardsError ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant='body2' color='error'>
                            {featureCardsError}
                        </Typography>
                    </Grid>
                ) : featureCards.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant='body2' color='text.secondary'>
                            No feature data available.
                        </Typography>
                    </Grid>
                ) : (
                    featureCards.map((card, index) => (
                        <Grid key={card.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                            <FeatureCard
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <FeatureCardIcon>
                                    {hoveredCard === index ? <LinkDarkIcon /> : <ArrowRightIcon />}
                                </FeatureCardIcon>
                                <Stack spacing={2}>
                                    <Typography variant='body1' color='text.primary' fontWeight='500'>
                                        {card.title}
                                    </Typography>
                                    <Typography variant='body2' color='text.primary' fontWeight='400'>
                                        {truncateText(card.description, 110)}
                                    </Typography>
                                </Stack>
                            </FeatureCard>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default ResumeGeneratorPage;
