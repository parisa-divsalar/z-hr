'use client';

import { useCallback, useRef, useState } from 'react';

import {  Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { useHistoryResumeRow } from '@/hooks/useHistoryResumeRow';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';
import { exportElementToPdf, sanitizeFileName } from '@/utils/exportToPdf';

import {
    Container,
    HeaderSection,
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

type ResumeGeneratorFrameProps = {
    setStage?: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES' | 'RESUME_GENERATOR_FRAME') => void;
    setActiveStep?: (activeStep: number) => void;
};

const ResumeGeneratorFrame = (props: ResumeGeneratorFrameProps) => {
    const { setStage, setActiveStep } = props;
    const router = useRouter();
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).landing.wizard.resumeGeneratorFrame;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const requestId = useWizardStore((state) => state.requestId);
    const resumePdfRef = useRef<HTMLDivElement | null>(null);

    const { row: historyRow } = useHistoryResumeRow(requestId);

    const resumeInfo = [
        { label: t.created, value: historyRow?.date || '—' },
        { label: t.size, value: historyRow?.size || '—' },
        { label: t.fitScore, value: historyRow?.Percentage || '—', isBadge: true },
        { label: t.skillGroup, value: historyRow?.position || '—' },
        { label: t.experienceLevel, value: historyRow?.level || '—' },
    ];

    const headerTitle = (() => {
        const base = String(historyRow?.name ?? '').trim();
        if (!base) return t.resume;
        return /resume/i.test(base) ? base : `${base}'s ${t.resume}`;
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
                preOpenWindow: false,
            });
        } catch (error) {
            console.error('Failed to export PDF', error);
            setDownloadError(error instanceof Error ? error.message : t.downloadError);
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading, requestId]);

    const handleEdit = useCallback(() => {
        if (setStage) {
            setActiveStep?.(3);
            setStage('RESUME_EDITOR');
            return;
        }

        const qs = new URLSearchParams();
        qs.set('step', '3');
        if (requestId) qs.set('requestId', requestId);
        router.push(`/resume-builder?${qs.toString()}`);
    }, [router, requestId, setActiveStep, setStage]);

    const featureCards = [
        { title: t.featureResumeTemplate, description: t.featureResumeTemplateDesc },
        { title: t.featureJobSuggestions, description: t.featureJobSuggestionsDesc },
        { title: t.featureLearningHub, description: t.featureLearningHubDesc },
        { title: t.featureInterviewQuestions, description: t.featureInterviewQuestionsDesc },
        { title: t.featureTextInterview, description: t.featureTextInterviewDesc },
        { title: t.featureVoiceInterview, description: t.featureVoiceInterviewDesc },
    ];

    return (
        <Container dir={dir} sx={{ direction: dir }}>
            {/* رندر مخفی فقط برای خروجی PDF؛ پیش‌نمایش در صفحه نشان داده نمی‌شود */}
            <div style={{ position: 'relative', overflow: 'hidden', height: 0 }}>
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '210mm',
                        minHeight: '297mm',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: -1,
                    }}
                >
                    <ResumeEditor
                        mode='preview'
                        pdfTargetRef={resumePdfRef}
                        setStage={setStage ?? (() => undefined)}
                        setActiveStep={setActiveStep ?? (() => undefined)}
                    />
                </div>
            </div>

            <Grid container spacing={{ xs: 3, sm: 4 }}>
                <Grid size={{ xs: 12, lg: 12 }}>
                    <InfoTable>
                        <HeaderSection>
                            <HeaderLeft>
                                <Typography variant='h5' color='text.primary' fontWeight='500'>
                                    {headerTitle}
                                </Typography>
                                <PurplePill>{t.aiGeneration}</PurplePill>
                            </HeaderLeft>

                        </HeaderSection>

                        <Grid container spacing={2} sx={{ mt: 3 }}>
                            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                                {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mb: 1 }} />}
                                {resumeInfo.map((info, index) => (
                                    <InfoRow key={index}>
                                        <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>
                                            {info.label}
                                        </Typography>
                                        {info.isBadge ? (
                                            <FitScoreBadge>{info.value}</FitScoreBadge>
                                        ) : (
                                            <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
                                                {info.value}
                                            </Typography>
                                        )}
                                    </InfoRow>
                                ))}
                                <Grid size={{ xs: 12, sm: 4, lg: 4 }} mt={6}>
                                    <ActionButtons>
                                        <MuiButton
                                            variant='outlined'
                                            size='large'
                                            color='secondary'
                                            onClick={handleEdit}
                                        >
                                            {t.edit}
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
                                                ? t.preparingPdf(Math.round(downloadProgress * 100))
                                                : t.downloadPdf}
                                        </MuiButton>
                                    </ActionButtons>
                                </Grid>
                            </Grid>
                        </Grid>
                    </InfoTable>
                </Grid>
            </Grid>

            <StyledDivider />

            {/*<Grid container spacing={{ xs: 2, sm: 3 }}>*/}
            {/*    {featureCards.map((card, index) => (*/}
            {/*        <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>*/}
            {/*            <FeatureCard*/}
            {/*                onMouseEnter={() => setHoveredCard(index)}*/}
            {/*                onMouseLeave={() => setHoveredCard(null)}*/}
            {/*            >*/}
            {/*                <FeatureCardIcon>*/}
            {/*                    {hoveredCard === index ? <LinkDarkIcon /> : <ArrowRightIcon />}*/}
            {/*                </FeatureCardIcon>*/}
            {/*                <Stack spacing={1}>*/}
            {/*                    <Typography variant='subtitle1' color='text.primary' fontWeight='500'>*/}
            {/*                        {card.title}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography variant='subtitle2' color='text.secondary' fontWeight='400'>*/}
            {/*                        {truncateText(card.description, 110)}*/}
            {/*                    </Typography>*/}
            {/*                </Stack>*/}
            {/*            </FeatureCard>*/}
            {/*        </Grid>*/}
            {/*    ))}*/}
            {/*</Grid>*/}
        </Container>
    );
};

export default ResumeGeneratorFrame;
