import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import FrameFaw from '@/assets/images/dashboard/FrameFaw.svg';
import BackIcon from '@/assets/images/dashboard/imag/backIcon.svg';
import ImageIcon from '@/assets/images/dashboard/image.svg';
import Position from '@/assets/images/dashboard/position.svg';
import ResumeIcon from '@/assets/images/dashboard/resume.svg?url';
import TrashIcon from '@/assets/images/dashboard/trash-01.svg';
import VideoIcon from '@/assets/images/dashboard/video.svg';
import VoiceIcon from '@/assets/images/dashboard/voice.svg';
import { HistoryImage, StyledDivider, TagPill } from '@/components/History/styled';
import { THistoryChannel } from '@/components/History/type';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';
import { exportElementToPdf, sanitizeFileName } from '@/utils/exportToPdf';

import { PreviewEditeRoot } from '../styled';

interface PreviewEditeProps {
    setActiveStep?: (step: number) => void;
    historyRow?: THistoryChannel;
}

const PreviewEdite: React.FC<PreviewEditeProps> = ({ setActiveStep, historyRow }) => {
    const router = useRouter();
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).historyEdite.preview;
    const setRequestId = useWizardStore((s) => s.setRequestId);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const resumePdfRef = useRef<HTMLDivElement | null>(null);
    const [isResumeReady, setIsResumeReady] = useState(false);

    const requestId = useMemo(() => String(historyRow?.id ?? '').trim() || null, [historyRow?.id]);

    const handleBackClick = () => {
        router.push('/history');
    };

    const handleEditResume = () => {
        if (!requestId) {
            setDownloadError(t.missingResumeId);
            return;
        }

        // Seed wizard context (Step3 loads CV by requestId from store/sessionStorage)
        setRequestId(requestId);

        if (setActiveStep) {
            setActiveStep(3);
            return;
        }

        // Render the real ResumeEditor component inside history-edite page (no separate page).
        router.push(`/history-edite?id=${encodeURIComponent(requestId)}&mode=editor`);
    };

    const handleDownload = useCallback(async () => {
        if (isDownloading) return;
        if (!requestId) {
            setDownloadError(t.missingResumeId);
            return;
        }
        if (!resumePdfRef.current || !isResumeReady) {
            setDownloadError(t.resumeStillLoading);
            return;
        }
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadError(null);
        try {
            const date = new Date().toISOString().slice(0, 10);
            const baseName = sanitizeFileName(historyRow?.name || t.resumeFallback) || t.resumeFallback;
            await exportElementToPdf(resumePdfRef.current, {
                fileName: `${baseName}-${date}`,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
                // Keep UX consistent with ResumeEditor (no new tab) and avoid popup blockers.
                preOpenWindow: false,
            });
        } catch (error) {
            console.error('Failed to export PDF', error);
            setDownloadError(error instanceof Error ? error.message : t.failedToGeneratePdf);
        } finally {
            setIsDownloading(false);
        }
    }, [historyRow?.name, isDownloading, isResumeReady, requestId, t.missingResumeId, t.resumeStillLoading, t.failedToGeneratePdf]);

    useEffect(() => {
        setIsResumeReady(false);
        setDownloadError(null);
        if (!requestId) return;

        let cancelled = false;
        let attempts = 0;

        const checkReady = async () => {
            if (cancelled) return;
            attempts++;

            const el = resumePdfRef.current;
            if (el) {
                const textLen = (el.textContent ?? '').replace(/\s+/g, ' ').trim().length;
                // Heuristic: wait until the resume actually has some content before enabling download.
                if (textLen >= 40) {
                    setIsResumeReady(true);
                    return;
                }
            }

            if (attempts < 30) {
                window.setTimeout(checkReady, 250);
            }
        };

        window.setTimeout(checkReady, 0);
        return () => {
            cancelled = true;
        };
    }, [requestId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                moreButtonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !moreButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <PreviewEditeRoot>
            {/* Render the actual resume DOM off-screen and export that (not this preview/header section). */}
            {requestId ? (
                <Box sx={{ position: 'fixed', left: '-100000px', top: 0, width: 900, pointerEvents: 'none' }}>
                    <ResumeEditor
                        mode='preview'
                        pdfTargetRef={resumePdfRef}
                        requestIdOverride={requestId}
                        disableAutoPoll
                        setStage={() => undefined}
                        setActiveStep={() => undefined}
                    />
                </Box>
            ) : null}
            <Grid container spacing={2} alignItems='stretch'>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        gap={1.5}
                    >
                        <BackIcon onClick={handleBackClick} style={{ cursor: 'pointer' }} />
                        <Typography variant='h5' color='text.primary' fontWeight='500'>
                            {historyRow?.name || t.resumeFallback}
                        </Typography>
                    </Stack>
                    {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mt: 1 }} />}
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 2, md: 2 }}
                    pt={2}
                    sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
                >
                    <HistoryImage p={2}>
                        <Image src={ResumeIcon} alt={t.resumePreviewAlt} fill />
                    </HistoryImage>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 7, md: 7 }}
                    p={2}
                    sx={{
                        px: { xs: 2, sm: 2, md: 4 },
                        pt: { xs: 1, md: 0 },
                    }}
                >
                    <Stack direction='row' gap={1}>
                        <Typography variant='h6' fontWeight='500' color='text.primary'>
                            {historyRow?.title || t.resumeFallback}
                        </Typography>

                        {historyRow?.Percentage && <TagPill sx={{ marginTop: '5px' }}>{historyRow.Percentage}</TagPill>}
                    </Stack>

                    <Stack
                        direction='row'
                        gap={2}
                        alignItems='center'
                        flexWrap='wrap'
                        sx={{ mt: 0.5 }}
                    >
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {historyRow?.date || '—'}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {historyRow?.size || '—'}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {historyRow?.position || '—'}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {historyRow?.level || '—'}
                        </Typography>
                    </Stack>

                    <Stack
                        direction='row'
                        gap={2}
                        alignItems='center'
                        mt={2}
                        flexWrap='wrap'
                    >
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VoiceIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {t.voice}{historyRow?.Voice ? ` (${historyRow.Voice})` : ''}
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <ImageIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {t.photo}{historyRow?.Photo ? ` (${historyRow.Photo})` : ''}
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VideoIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {t.video}{historyRow?.Video ? ` (${historyRow.Video})` : ''}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction='row' gap={1} mt={3}>
                        <Position />

                        <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
                            {t.suggestedPositionsCount}{' '}
                        </Typography>
                    </Stack>

                    <Stack
                        direction='row'
                        gap={1}
                        mt={3}
                        alignItems='center'
                        flexWrap='wrap'
                    >
                        <FrameFaw />
                        <Divider orientation='vertical' flexItem sx={{ bgcolor: 'grey.100' }} />
                        <TrashIcon />
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 3, md: 3 }}
                    display='flex'
                    alignItems='flex-end'
                    justifyContent='flex-end'
                    sx={{
                        pt: { xs: 1, sm: 2 },
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        gap={1}
                        width='100%'
                        justifyContent={{ xs: 'stretch', sm: 'flex-end' }}
                        alignItems='center'
                    >
                        <MuiButton
                            variant='outlined'
                            size='medium'
                            color='secondary'
                            onClick={handleEditResume}
                            fullWidth
                            sx={{
                                width: { xs: '100%', sm: 160 },
                                textTransform: 'none',
                            }}
                        >
                            {t.edit}
                        </MuiButton>
                        <MuiButton
                            variant='contained'
                            size='medium'
                            color='secondary'
                            loading={isDownloading}
                            onClick={handleDownload}
                            fullWidth
                            disabled={!isResumeReady && !isDownloading}
                            sx={{
                                width: { xs: '100%', sm: 'auto' },
                                textTransform: 'none',
                            }}
                        >
                            {isDownloading ? t.preparingPdf(Math.round(downloadProgress * 100)) : t.download}
                        </MuiButton>
                    </Stack>
                </Grid>
            </Grid>
        </PreviewEditeRoot>
    );
};

export default PreviewEdite;
