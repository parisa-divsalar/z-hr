'use client';

import React, { useMemo, useRef, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { exportElementToPdf } from '@/utils/exportToPdf';

import {
    ActionContainer,
    AnswerText,
    DialogContainer,
    HeaderContainer,
    QuestionBadge,
    QuestionCardInner,
    QuestionDivider,
    QuestionHeading,
    QuestionRow,
    QuestionTexts,
    QuestionTitle,
    StackContainer,
    StackContent,
    StyledQuestionCard,
} from './styled';

export interface RecentInterviewQuestionsDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
}

interface QuestionCardProps {
    number: number;
    name?: string;
    question?: string;
    answer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ number, name, question = 'Question', answer }) => {
    return (
        <StyledQuestionCard>
            <QuestionCardInner>
                <QuestionRow>
                    <QuestionBadge>{number}</QuestionBadge>
                    <QuestionTexts>
                        <QuestionHeading variant='subtitle2'>{question}</QuestionHeading>
                        {name && <QuestionTitle variant='caption'>{name}</QuestionTitle>}
                    </QuestionTexts>
                </QuestionRow>
                {answer && <AnswerText variant='body2'>Answer: {answer}</AnswerText>}
            </QuestionCardInner>
            <QuestionDivider />
        </StyledQuestionCard>
    );
};

const InterviewQuestionsTabContent = () => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <QuestionCard
                        key={num}
                        number={num}
                        name='Soft skill'
                        question='Questions'
                        answer='Access common and position-specific interview questions to prepare effectively.'
                    />
                ))}
            </Grid>
        </Grid>
    );
};

const RecentInterviewQuestionsDialog: React.FC<RecentInterviewQuestionsDialogProps> = ({ open, onClose, title }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const pdfContentRef = useRef<HTMLDivElement | null>(null);

    const fileName = useMemo(() => {
        const base = (title ?? 'Interview Questions')
            .trim()
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 80);
        const date = new Date().toISOString().slice(0, 10);
        return `${base || 'Interview-Questions'}-${date}.pdf`;
    }, [title]);

    const handleDownloadPdf = async () => {
        if (!pdfContentRef.current || isDownloading) return;

        setIsDownloading(true);
        setDownloadError(null);
        setDownloadProgress(0);
        try {
            await exportElementToPdf(pdfContentRef.current, {
                fileName,
                marginPt: 24,
                scale: 2,
                backgroundColor: '#ffffff',
                imageCompression: 'SLOW',
                onProgress: (p) => setDownloadProgress(p),
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate PDF', e);
            setDownloadError('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <DialogContainer onClose={onClose} open={open} maxWidth='sm'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='subtitle1' fontWeight={500}>
                        {title ?? 'Interview Questions'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseRoundedIcon />
                    </IconButton>
                </HeaderContainer>

                <StackContent>
                    {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mb: 1.5 }} />}
                    <InterviewQuestionsTabContent />
                </StackContent>

                <ActionContainer direction='row'>
                    <MuiButton
                        fullWidth
                        color='secondary'
                        variant='contained'
                        loading={isDownloading}
                        onClick={handleDownloadPdf}
                        endIcon={<DownloadRoundedIcon />}
                    >
                        {isDownloading ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%` : 'Download PDF'}
                    </MuiButton>
                </ActionContainer>
            </StackContainer>

            {/* Offscreen content to capture the full (non-scrolled) UI as PDF */}
            {open && (
                <Box
                    ref={pdfContentRef}
                    sx={{
                        position: 'fixed',
                        left: '-10000px',
                        top: 0,
                        width: '500px',
                        backgroundColor: '#fff',
                        padding: 2,
                        borderRadius: '1rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1,
                    }}
                >
                    <Typography color='text.primary' variant='subtitle1' fontWeight={500} mb={1.5}>
                        {title ?? 'Interview Questions'}
                    </Typography>
                    {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mb: 1.5 }} />}
                    <InterviewQuestionsTabContent />
                </Box>
            )}
        </DialogContainer>
    );
};

export default RecentInterviewQuestionsDialog;
