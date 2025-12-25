'use client';

import { useCallback, useRef, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import ArrowIcon from '@/assets/images/dashboard/Icon.svg';
import LinkDarkIcon from '@/assets/images/icons/link-dark.svg';
import ArrowRightIcon from '@/assets/images/icons/links.svg';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { useWizardStore } from '@/store/wizard';
import { exportElementToPdf, sanitizeFileName } from '@/utils/exportToPdf';

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
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const requestId = useWizardStore((state) => state.requestId);
    const resumePdfRef = useRef<HTMLDivElement | null>(null);

    const resumeInfo = [
        { label: 'Created:', value: '09/09/2025' },
        { label: 'Size:', value: '2.85 MB' },
        { label: 'Fit score:', value: '89%', isBadge: true },
        { label: 'Skill group:', value: 'Front-end' },
        { label: 'Experience level:', value: 'Mid-senior' },
    ];

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

    const featureCards = [
        {
            title: 'Resume Template',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
        {
            title: 'Job Position Suggestions',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
        {
            title: 'Learning Hub',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
        {
            title: 'Interview Questions',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
        {
            title: 'Text Interview Practice (Chatbot)',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
        {
            title: 'Voice Interview Practice',
            description: 'Create professional, templates with modern design and flexible layout options.',
        },
    ];

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
                        <Typography variant='body1' color='text.secondary'>
                            Resume Preview
                        </Typography>
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
                                    Zayd Al-Mansoori's Resume
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
                                        <MuiButton variant='outlined' size='large' color='secondary'>
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

            <StyledDivider />

            <Grid container spacing={{ xs: 2, sm: 3 }}>
                {featureCards.map((card, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
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
                ))}
            </Grid>
        </Container>
    );
};

export default ResumeGeneratorPage;
