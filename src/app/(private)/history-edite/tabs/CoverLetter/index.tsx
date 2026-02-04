'use client';

import { useEffect, useMemo, useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, IconButton, Stack, TextField, Typography } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import CopyIcon from '@/assets/images/icons/copy.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import { getCoverLetter } from '@/services/cv/get-cover-letter';
import { listCoverLetters } from '@/services/cv/list-cover-letters';
import { updateCoverLetter } from '@/services/cv/update-cover-letter';
import { useWizardStore } from '@/store/wizard/useWizardStore';

import CreateCoverLetterDialog, { CreateCoverLetterValues } from './CreateCoverLetterDialog';

type CoverLetterItem = {
    id: string;
    requestId: string;
    title: string;
    body: string;
    draftBody: string;
    isEditing: boolean;
    createdAt?: string;
    updatedAt?: string;
};

const normalizeCoverLetter = (text: string) => text.replace(/\r\n/g, '\n').trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const extractCoverLetterTitle = (payload: unknown, fallback: string): string => {
    if (!payload) return fallback;

    const normalize = (s: unknown) => (typeof s === 'string' ? s.trim() : '');
    const from = (obj: any) => {
        const subject = normalize(obj?.subject);
        if (subject) return subject;
        const positionTitle = normalize(obj?.positionTitle);
        const companyName = normalize(obj?.companyName);
        if (positionTitle && companyName) return `${positionTitle} - ${companyName}`;
        if (positionTitle) return positionTitle;
        if (companyName) return companyName;
        return '';
    };

    if (typeof payload === 'string') return fallback;
    if (isRecord(payload)) {
        const direct = from(payload as any);
        if (direct) return direct;
        const nested = (payload as any).data;
        if (nested && typeof nested === 'object') {
            const nestedTitle = from(nested);
            if (nestedTitle) return nestedTitle;
        }
    }

    return fallback;
};

const extractCoverLetterText = (payload: unknown): string | null => {
    if (typeof payload === 'string') {
        const v = normalizeCoverLetter(payload);
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
            if (typeof v === 'string') {
                const normalized = normalizeCoverLetter(v);
                if (normalized) return normalized;
            }
        }

        const nestedData = payload.data;
        if (typeof nestedData === 'string') {
            const normalized = normalizeCoverLetter(nestedData);
            if (normalized) return normalized;
        }
        if (isRecord(nestedData)) {
            for (const k of directKeys) {
                const v = nestedData[k];
                if (typeof v === 'string') {
                    const normalized = normalizeCoverLetter(v);
                    if (normalized) return normalized;
                }
            }
        }
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

    if (typeof maybe === 'string' && maybe.trim()) return maybe.trim();
    return 'Failed to load cover letter';
};

const iconButtonSx = {
    width: 40,
    height: 40,
    minWidth: 40,
    minHeight: 40,
    p: 0,
    borderRadius: 2,
    border: 'none',
    backgroundColor: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    '&:hover': { backgroundColor: 'grey.50' },
    '& svg': {
        width: 24,
        height: 24,
        flexShrink: 0,
        display: 'block',
    },
    '& svg > rect': {
        display: 'none',
    },
} as const;

const CoverLetter = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const storedRequestId = useWizardStore((s) => s.requestId);
    const setStoredRequestId = useWizardStore((s) => s.setRequestId);

    // This is the resume requestId (cvRequestId).
    const resumeRequestId = useMemo(() => {
        // In History-Edit flow, the resume request id is passed as `?id=...`
        // In other places it might be `?requestId=...`
        const fromQuery =
            searchParams.get('requestId') ?? searchParams.get('RequestId') ?? searchParams.get('id') ?? searchParams.get('cvRequestId');
        const normalizedQuery = fromQuery?.trim();
        return normalizedQuery ? normalizedQuery : storedRequestId;
    }, [searchParams, storedRequestId]);

    const [items, setItems] = useState<CoverLetterItem[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const fetchCoverLettersForResume = async (cvRequestId: string) => {
        setIsFetching(true);
        setFetchError(null);
        try {
            const res = await listCoverLetters({ cvRequestId });
            const nextItems: CoverLetterItem[] = (res?.items ?? [])
                .map((row: any) => {
                    const text = extractCoverLetterText(row?.coverLetter ?? row) ?? '';
                    const title = extractCoverLetterTitle(row, 'Cover letter');
                    const requestId = String(row?.requestId ?? '').trim();
                    if (!requestId || !text) return null;
                    return {
                        id: `cl:${requestId}`,
                        requestId,
                        title,
                        body: text,
                        draftBody: text,
                        isEditing: false,
                        createdAt: row?.createdAt,
                        updatedAt: row?.updatedAt,
                    } satisfies CoverLetterItem;
                })
                .filter(Boolean) as CoverLetterItem[];

            setItems(nextItems);
        } catch (e: any) {
            // Backward compatible fallback: if list endpoint isn't available for some reason, try old single fetch.
            try {
                const raw = await getCoverLetter({ requestId: cvRequestId });
                const text = extractCoverLetterText(raw);
                const title = extractCoverLetterTitle(raw, 'Cover letter');
                if (text) {
                    setItems([
                        {
                            id: `cl:${cvRequestId}`,
                            requestId: cvRequestId,
                            title,
                            body: text,
                            draftBody: text,
                            isEditing: false,
                        },
                    ]);
                } else {
                    setItems([]);
                }
            } catch (inner: any) {
                setFetchError(getErrorMessage(inner ?? e));
            }
        } finally {
            setIsFetching(false);
            setHasFetchedOnce(true);
        }
    };

    useEffect(() => {
        if (!resumeRequestId) return;
        setHasFetchedOnce(false);
        void fetchCoverLettersForResume(resumeRequestId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeRequestId]);

    const startEdit = (id: string) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, isEditing: true, draftBody: it.body } : { ...it, isEditing: false },
            ),
        );
    };

    const save = async (id: string) => {
        const item = items.find((x) => x.id === id);
        if (!item) return;

        const next = normalizeCoverLetter(item.draftBody);
        if (!next) {
            cancel(id);
            return;
        }

        // optimistic UI
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, body: next, draftBody: next, isEditing: false } : it)),
        );

        try {
            // If this item isn't linked to DB yet, skip persistence.
            if (!item.requestId || item.requestId === 'generated') return;
            await updateCoverLetter({ requestId: item.requestId, coverLetter: next, subject: item.title });
        } catch (e: any) {
            setFetchError(getErrorMessage(e));
            // revert
            setItems((prev) =>
                prev.map((it) =>
                    it.id === id ? { ...it, body: item.body, draftBody: item.body, isEditing: false } : it,
                ),
            );
        }
    };

    const cancel = (id: string) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, draftBody: it.body, isEditing: false } : it)));
    };

    const updateDraft = (id: string, value: string) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, draftBody: value } : it)));
    };

    const handleCopy = async (id: string) => {
        const item = items.find((x) => x.id === id);
        if (!item) return;
        const textToCopy = item.isEditing ? item.draftBody : item.body;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                return;
            }
        } catch {
            // fall back
        }

        try {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch {
            // ignore
        }
    };

    const handleAddNew = () => {
        setItems((prev) => prev.map((it) => ({ ...it, isEditing: false })));
        setIsCreateOpen(true);
    };

    const handleCreated = (args: {
        values: CreateCoverLetterValues;
        coverLetterText: string;
        requestId: string | null;
        rawResponse?: unknown;
    }) => {
        const { coverLetterText, requestId: createdRequestId, rawResponse } = args;

        if (createdRequestId) {
            const body = normalizeCoverLetter(coverLetterText);
            const title = extractCoverLetterTitle(rawResponse, 'Cover letter');

            // Prepend this new cover letter to the list (then re-sync from DB).
            setItems((prev) => {
                const apiId = `cl:${createdRequestId}`;
                const rest = prev.map((it) => ({ ...it, isEditing: false })).filter((it) => it.id !== apiId);
                if (!body) return rest;
                return [
                    {
                        id: apiId,
                        requestId: createdRequestId,
                        title,
                        body,
                        draftBody: body,
                        isEditing: false,
                    },
                    ...rest,
                ];
            });

            setItems((prev) => prev.map((it) => ({ ...it, isEditing: false })));
            // Ensure resumeRequestId persists across refresh: prefer the current resumeRequestId; otherwise use the first created cover letter id.
            const nextResumeId = resumeRequestId ?? createdRequestId;
            setStoredRequestId(nextResumeId);

            // Also persist in the URL so reloads always have ?requestId=...
            try {
                const nextParams = new URLSearchParams(searchParams.toString());
                // Keep both keys for backward compatibility across different flows.
                nextParams.set('requestId', nextResumeId);
                nextParams.set('id', nextResumeId);
                nextParams.delete('RequestId');
                router.replace(`${pathname}?${nextParams.toString()}`);
            } catch {
                // ignore URL update issues
            }

            // Ensure the list reflects DB state.
            void fetchCoverLettersForResume(nextResumeId);
            return;
        }

        const body = normalizeCoverLetter(coverLetterText);
        setItems((prev) => {
            const rest = prev.map((it) => ({ ...it, isEditing: false })).filter((it) => it.id !== 'cl:generated');
            if (!body) return rest;
            return [
                {
                    id: 'cl:generated',
                    requestId: 'generated',
                    title: 'Cover letter',
                    body,
                    draftBody: body,
                    isEditing: false,
                },
                ...rest,
            ];
        });
    };

    return (
        <Stack gap={2}>
            {fetchError && <MuiAlert severity='error' message={fetchError} hideDismissButton />}

            {!resumeRequestId && (
                <MuiAlert
                    severity='info'
                    message='RequestId not found. Open this page with ?requestId=... to load a saved cover letter.'
                    hideDismissButton
                />
            )}

            <Stack direction='row' justifyContent='flex-end'>
                <MuiButton
                    onClick={handleAddNew}
                    text='Add New'
                    variant='outlined'
                    color='secondary'
                    size='small'
                    startIcon={<AddIcon fontSize='small' />}
                />
            </Stack>

            {isFetching && items.length === 0 && (
                <Stack direction='row' alignItems='center' gap={1}>
                    <CircularProgress size={18} />
                    <Typography variant='body2' color='text.secondary'>
                        Loading cover letter...
                    </Typography>
                </Stack>
            )}

            {!isFetching && resumeRequestId && hasFetchedOnce && items.length === 0 && !fetchError && (
                <Typography variant='body2' color='text.secondary'>
                    No cover letter found for this request.
                </Typography>
            )}

            {items.map((item) => (
                <Stack
                    key={item.id}
                    gap={2}
                    sx={{
                        border: '1px solid',
                        borderColor: 'grey.100',
                        borderRadius: 2,
                        backgroundColor: 'common.white',
                        px: 2.5,
                        py: 2.25,
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant='body1'
                        fontWeight={492}
                        color='text.primary'
                        sx={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                        {item.title}
                    </Typography>

                    {item.isEditing ? (
                        <TextField
                            value={item.draftBody}
                            onChange={(e) => updateDraft(item.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') cancel(item.id);
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save(item.id);
                            }}
                            placeholder='Type/paste your cover letter...'
                            multiline
                            minRows={6}
                            maxRows={14}
                            variant='standard'
                            size='small'
                            fullWidth
                            autoFocus={false}
                            InputProps={{ disableUnderline: true }}
                            sx={{
                                minWidth: 0,
                                '& .MuiInputBase-root': { alignItems: 'flex-start' },
                                '& .MuiInputBase-input': {
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    whiteSpace: 'pre-wrap',
                                },
                            }}
                        />
                    ) : (
                        <Typography
                            variant='body2'
                            color='text.primary'
                            sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}
                        >
                            {item.body}
                        </Typography>
                    )}

                    <Stack direction='row' alignItems='center' gap={1}>
                        {item.isEditing ? (
                            <>
                                <IconButton sx={iconButtonSx} onClick={() => save(item.id)} aria-label='Save'>
                                    <Check fontSize='small' />
                                </IconButton>
                                <IconButton sx={iconButtonSx} onClick={() => cancel(item.id)} aria-label='Cancel'>
                                    <Close fontSize='small' />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton sx={iconButtonSx} onClick={() => startEdit(item.id)} aria-label='Edit'>
                                <EditIcon />
                            </IconButton>
                        )}

                        <IconButton sx={iconButtonSx} onClick={() => handleCopy(item.id)} aria-label='Copy'>
                            <CopyIcon />
                        </IconButton>
                        <IconButton
                            sx={iconButtonSx}
                            aria-label='Refresh'
                            disabled={!resumeRequestId || isFetching}
                            onClick={() => resumeRequestId && fetchCoverLettersForResume(resumeRequestId)}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            ))}

            <CreateCoverLetterDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                resumeRequestId={resumeRequestId}
                onCreated={({ values, coverLetterText, requestId, rawResponse }) =>
                    handleCreated({ values, coverLetterText, requestId, rawResponse })
                }
            />
        </Stack>
    );
};

export default CoverLetter;
