'use client';

import React, { useEffect, useMemo, useState } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Divider, IconButton, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';
import { addCoverLetter } from '@/services/cv/add-cover-letter';
import { getCoverLetter } from '@/services/cv/get-cover-letter';
import { useAuthStore } from '@/store/auth';

import {
    ActionContainer,
    ContainerSkill,
    DialogContainer,
    HeaderContainer,
    InputContent,
    StackContainer,
    StackContent,
} from './styled';

export type CreateCoverLetterValues = {
    jobDescription: string;
    cvContent: string;
    companyName: string;
    positionTitle: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onCreated: (args: {
        values: CreateCoverLetterValues;
        coverLetterText: string;
        rawResponse: unknown;
        requestId: string | null;
    }) => void;
    defaultValues?: Partial<CreateCoverLetterValues>;
};

const normalizeText = (text: string) => text.replace(/\r\n/g, '\n').trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const extractCoverLetterText = (payload: unknown): string | null => {
    if (typeof payload === 'string') {
        const v = normalizeText(payload);
        return v ? v : null;
    }

    if (!payload) return null;

    const directKeys = [
        'uiContent',
        'coverLetter',
        'cover_letter',
        'coverletter',
        'letter',
        'body',
        'content',
        'text',
        'result',
        'message',
    ] as const;

    if (isRecord(payload)) {
        for (const k of directKeys) {
            const v = payload[k];
            if (typeof v === 'string' && normalizeText(v)) return normalizeText(v);
        }

        const nestedData = payload.data;
        if (typeof nestedData === 'string' && normalizeText(nestedData)) return normalizeText(nestedData);
        if (isRecord(nestedData)) {
            for (const k of directKeys) {
                const v = nestedData[k];
                if (typeof v === 'string' && normalizeText(v)) return normalizeText(v);
            }
        }
    }

    const seen = new Set<unknown>();
    const queue: unknown[] = [payload];
    let best = '';
    let guard = 0;

    while (queue.length && guard < 5000) {
        guard++;
        const cur = queue.shift();
        if (!cur) continue;

        if (typeof cur === 'string') {
            const v = normalizeText(cur);
            if (v.length > best.length) best = v;
            continue;
        }

        if (typeof cur !== 'object') continue;
        if (seen.has(cur)) continue;
        seen.add(cur);

        if (Array.isArray(cur)) {
            for (const x of cur) queue.push(x);
            continue;
        }

        for (const v of Object.values(cur as Record<string, unknown>)) {
            queue.push(v);
        }
    }

    return best ? best : null;
};

const extractCoverLetterRequestId = (payload: unknown): string | null => {
    const normalizeValue = (value: unknown): string | null => {
        if (value === null || value === undefined) return null;
        const str = String(value).trim();
        if (!str) return null;
        if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
        return str;
    };

    const tryParseJsonString = (value: unknown) => {
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        try {
            return JSON.parse(trimmed) as unknown;
        } catch {
            return null;
        }
    };

    if (!payload) return null;

    const direct =
        (payload as any)?.RequestId ??
        (payload as any)?.requestId ??
        (payload as any)?.result?.RequestId ??
        (payload as any)?.result?.requestId ??
        (payload as any)?.id ??
        (payload as any)?.Id ??
        (payload as any)?.result?.id ??
        (payload as any)?.result?.Id ??
        (payload as any)?.data?.RequestId ??
        (payload as any)?.data?.requestId ??
        (payload as any)?.data?.id ??
        (payload as any)?.data?.Id ??
        null;

    const normalizedDirect = normalizeValue(direct);
    if (normalizedDirect) return normalizedDirect;

    const resultContainer = (payload as any)?.result ?? (payload as any)?.data?.result ?? null;

    if (typeof resultContainer === 'string') {
        const normalizedResultString = normalizeValue(resultContainer);
        if (!normalizedResultString) return null;

        const parsed = tryParseJsonString(normalizedResultString);
        if (parsed && typeof parsed === 'object') {
            const parsedValue =
                (parsed as any).value ??
                (parsed as any).Value ??
                (parsed as any).id ??
                (parsed as any).Id ??
                (parsed as any).RequestId ??
                (parsed as any).requestId ??
                null;
            const normalizedParsedValue = normalizeValue(parsedValue);
            if (normalizedParsedValue) return normalizedParsedValue;
        }

        return normalizedResultString;
    }

    if (resultContainer && typeof resultContainer === 'object') {
        const normalizedWrappedValue = normalizeValue(
            (resultContainer as any)?.value ??
                (resultContainer as any)?.Value ??
                (resultContainer as any)?.id ??
                (resultContainer as any)?.Id ??
                (resultContainer as any)?.RequestId ??
                (resultContainer as any)?.requestId ??
                null,
        );
        if (normalizedWrappedValue) return normalizedWrappedValue;
    }

    const parsedResult = tryParseJsonString(resultContainer);
    if (parsedResult && typeof parsedResult === 'object') {
        const parsedValue =
            (parsedResult as any).id ??
            (parsedResult as any).Id ??
            (parsedResult as any).RequestId ??
            (parsedResult as any).requestId ??
            (parsedResult as any).value ??
            (parsedResult as any).Value ??
            null;
        const normalizedParsedValue = normalizeValue(parsedValue);
        if (normalizedParsedValue) return normalizedParsedValue;
    }

    return null;
};

const getErrorMessage = (error: any): string => {
    const maybe =
        error?.response?.data?.error?.message ??
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        error?.toString?.();

    if (typeof maybe === 'string' && maybe.trim()) return maybe;
    return 'Something went wrong';
};

const createEmptyValues = (defaults?: Partial<CreateCoverLetterValues>): CreateCoverLetterValues => ({
    companyName: defaults?.companyName ?? '',
    positionTitle: defaults?.positionTitle ?? '',
    cvContent: defaults?.cvContent ?? '',
    jobDescription: defaults?.jobDescription ?? '',
});

export default function CreateCoverLetterDialog({ open, onClose, onCreated, defaultValues }: Props) {
    const userId = useAuthStore((s) => s.accessToken);
    const [values, setValues] = useState<CreateCoverLetterValues>(() => createEmptyValues(defaultValues));
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateCoverLetterValues, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setValues(createEmptyValues(defaultValues));
        setFieldErrors({});
        setSubmitError(null);
        setIsSubmitting(false);
    }, [open, defaultValues]);

    const canSubmit = useMemo(() => {
        return (
            !isSubmitting &&
            Boolean(values.companyName.trim()) &&
            Boolean(values.positionTitle.trim()) &&
            Boolean(values.cvContent.trim()) &&
            Boolean(values.jobDescription.trim())
        );
    }, [isSubmitting, values]);

    const validate = (): boolean => {
        const next: Partial<Record<keyof CreateCoverLetterValues, string>> = {};
        if (!values.companyName.trim()) next.companyName = 'Company name is required';
        if (!values.positionTitle.trim()) next.positionTitle = 'Position title is required';
        if (!values.cvContent.trim()) next.cvContent = 'CV content is required';
        if (!values.jobDescription.trim()) next.jobDescription = 'Job description is required';

        setFieldErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setSubmitError(null);
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const raw = await addCoverLetter({
                userId: userId ?? undefined,
                lang: 'en',
                requestId: null,
                companyName: values.companyName.trim(),
                positionTitle: values.positionTitle.trim(),
                cvContent: values.cvContent.trim(),
                jobDescription: values.jobDescription.trim(),
            });

            const requestId = extractCoverLetterRequestId(raw);
            let outputRaw: unknown = raw;
            let coverLetterText: string | null = extractCoverLetterText(raw);

            // Fallback: if API returned only requestId, fetch the stored cover letter once.
            if (!coverLetterText && requestId) {
                const res = await getCoverLetter({ requestId });
                outputRaw = res;
                coverLetterText = extractCoverLetterText(res);
            }

            if (!coverLetterText) throw new Error('Cover letter is not ready yet. Please try again in a moment.');

            onCreated({
                values: {
                    companyName: values.companyName.trim(),
                    positionTitle: values.positionTitle.trim(),
                    cvContent: values.cvContent.trim(),
                    jobDescription: values.jobDescription.trim(),
                },
                coverLetterText,
                rawResponse: outputRaw,
                requestId: requestId ?? null,
            });
            onClose();
        } catch (e: any) {
            console.error('addCoverLetter failed', e);
            setSubmitError(getErrorMessage(e));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContainer onClose={onClose} open={open} maxWidth='md'>
            <StackContainer>
                <HeaderContainer direction='row'>
                    <Typography color='text.primary' variant='subtitle1' fontWeight={500}>
                        Create cover letter
                    </Typography>
                    <IconButton onClick={onClose} aria-label='Close'>
                        <CloseRoundedIcon />
                    </IconButton>
                </HeaderContainer>

                <StackContent>
                    {submitError && (
                        <Stack
                            sx={{
                                position: 'absolute',
                                top: 8,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10,
                                width: '100%',
                                maxWidth: 350,
                                px: 2,
                                pointerEvents: 'auto',
                            }}
                        >
                            <MuiAlert
                                severity='error'
                                message={<span title={submitError}>{submitError}</span>}
                                dismissLabel='Close'
                                onDismiss={() => setSubmitError(null)}
                                sx={{
                                    my: 0,
                                    width: '100%',
                                    '& .MuiTypography-root': {
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    },
                                }}
                            />
                        </Stack>
                    )}
                    <Stack px={2} gap={1.25}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.25}>
                            <Stack sx={{ flex: 1, minWidth: 0 }}>
                                <MuiInput
                                    label='Company name'
                                    placeholder='Company name'
                                    value={values.companyName}
                                    onChange={(v) => setValues((prev) => ({ ...prev, companyName: String(v ?? '') }))}
                                    error={Boolean(fieldErrors.companyName)}
                                    helperText={fieldErrors.companyName ?? ''}
                                    maxLength={120}
                                />
                            </Stack>
                            <Stack sx={{ flex: 1, minWidth: 0 }}>
                                <MuiInput
                                    label='Position title'
                                    value={values.positionTitle}
                                    onChange={(v) => setValues((prev) => ({ ...prev, positionTitle: String(v ?? '') }))}
                                    error={Boolean(fieldErrors.positionTitle)}
                                    helperText={fieldErrors.positionTitle ?? ''}
                                    maxLength={120}
                                />
                            </Stack>
                        </Stack>

                        <Stack sx={{ minWidth: 0 }}>
                            <Typography
                                variant='caption'
                                color={fieldErrors.cvContent ? 'error.main' : 'text.secondary'}
                            >
                                CV content
                            </Typography>
                        </Stack>
                        <ContainerSkill direction='row' active={Boolean(values.cvContent.trim())}>
                            <InputContent
                                placeholder='Paste your CV content...'
                                value={values.cvContent}
                                wrap='soft'
                                maxLength={20000}
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setValues((prev) => ({ ...prev, cvContent: event.target.value }))
                                }
                            />
                        </ContainerSkill>
                        {fieldErrors.cvContent && (
                            <Typography variant='caption' color='error.main'>
                                {fieldErrors.cvContent}
                            </Typography>
                        )}

                        <Stack sx={{ minWidth: 0 }}>
                            <Typography
                                variant='caption'
                                color={fieldErrors.jobDescription ? 'error.main' : 'text.secondary'}
                            >
                                Job description
                            </Typography>
                            <TextField
                                value={values.jobDescription}
                                onChange={(e) => setValues((prev) => ({ ...prev, jobDescription: e.target.value }))}
                                placeholder='Job description'
                                fullWidth
                                error={Boolean(fieldErrors.jobDescription)}
                                helperText={fieldErrors.jobDescription ?? ''}
                                inputProps={{ maxLength: 20000 }}
                            />
                        </Stack>
                    </Stack>
                </StackContent>

                <Divider />

                <ActionContainer direction={{ xs: 'column', sm: 'row' }}>
                    <MuiButton fullWidth color='secondary' variant='outlined' onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </MuiButton>
                    <MuiButton
                        fullWidth
                        color='secondary'
                        variant='contained'
                        loading={isSubmitting}
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >
                        Create
                    </MuiButton>
                </ActionContainer>
            </StackContainer>
        </DialogContainer>
    );
}
