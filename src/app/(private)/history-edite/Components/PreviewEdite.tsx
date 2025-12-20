import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
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
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { exportElementToPdf, sanitizeFileName } from '@/utils/exportToPdf';

import { PreviewEditeRoot } from '../styled';

interface PreviewEditeProps {
    setActiveStep?: (step: number) => void;
}

const PreviewEdite: React.FC<PreviewEditeProps> = ({ setActiveStep }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const pdfRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleBackClick = () => {
        router.push('/history');
    };

    const handleEditResume = () => {
        if (setActiveStep) {
            setActiveStep(3);
        } else {
            router.push('/?step=3');
        }
    };

    const handleDownload = useCallback(async () => {
        if (!pdfRef.current || isDownloading) return;
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadError(null);
        try {
            const date = new Date().toISOString().slice(0, 10);
            const baseName = sanitizeFileName("Zayd-Al-Mansoori's-Resume") || 'Resume';
            await exportElementToPdf(pdfRef.current, {
                fileName: `${baseName}-${date}`,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                onProgress: (p) => setDownloadProgress(p),
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to export PDF', error);
            setDownloadError(error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading]);

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
        <PreviewEditeRoot ref={pdfRef}>
            <Grid container spacing={2} alignItems='stretch'>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Stack direction='row' alignItems='center' gap={2}>
                        <BackIcon onClick={handleBackClick} style={{ cursor: 'pointer' }} />
                        <Typography variant='h5' color='text.primary' fontWeight='500'>
                            Zayd Al-Mansoori's Resume
                        </Typography>
                    </Stack>
                    {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mt: 1 }} />}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 2 }} pt={2}>
                    <HistoryImage p={2}>
                        <Image src={ResumeIcon} alt='Resume preview' fill />
                    </HistoryImage>
                </Grid>

                <Grid size={{ xs: 12, sm: 5, md: 7 }} p={2} pl={4}>
                    <Stack direction='row' gap={1}>
                        <Typography variant='h6' fontWeight='500' color='text.primary'>
                            Resume Name
                        </Typography>

                        <TagPill sx={{ marginTop: '5px' }}> 85%</TagPill>
                    </Stack>

                    <Stack direction='row' gap={2} alignItems='center'>
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            Nov 26, 2024
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            2.5MB
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            Software Engineer
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            Senior
                        </Typography>
                    </Stack>

                    <Stack direction='row' gap={4} alignItems='center' mt={2}>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VoiceIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                Voice
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <ImageIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                Photo
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VideoIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                Video
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction='row' gap={1} mt={3}>
                        <Position />

                        <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
                            3 Suggested Position{' '}
                        </Typography>
                    </Stack>

                    <Stack direction='row' gap={1} mt={3} alignItems='center'>
                        <FrameFaw />
                        <Divider orientation='vertical' flexItem sx={{ bgcolor: 'grey.100' }} />
                        <TrashIcon />
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 3, md: 3 }} display='flex' alignItems='flex-end' justifyContent='flex-end'>
                    <Stack direction='row' gap={1}>
                        <MuiButton
                            variant='outlined'
                            size='medium'
                            color='secondary'
                            onClick={handleEditResume}
                            sx={{ width: 160 }}
                        >
                            Edit In Preview
                        </MuiButton>
                        <MuiButton
                            variant='contained'
                            size='medium'
                            color='secondary'
                            loading={isDownloading}
                            onClick={handleDownload}
                        >
                            {isDownloading ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%` : 'Download'}
                        </MuiButton>
                    </Stack>
                </Grid>
            </Grid>
        </PreviewEditeRoot>
    );
};

export default PreviewEdite;
