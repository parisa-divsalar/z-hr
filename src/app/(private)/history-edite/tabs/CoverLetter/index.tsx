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
import { useWizardStore } from '@/store/wizard/useWizardStore';

import CreateCoverLetterDialog, { CreateCoverLetterValues } from './CreateCoverLetterDialog';

type CoverLetterItem = {
    id: string;
    title: string;
    body: string;
    draftBody: string;
    isEditing: boolean;
};

const normalizeCoverLetter = (text: string) => text.replace(/\r\n/g, '\n').trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

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

    const requestId = useMemo(() => {
        const fromQuery = searchParams.get('requestId') ?? searchParams.get('RequestId');
        const normalizedQuery = fromQuery?.trim();
        return normalizedQuery ? normalizedQuery : storedRequestId;
    }, [searchParams, storedRequestId]);

    const [items, setItems] = useState<CoverLetterItem[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

    const fetchCoverLetter = async (requestIdToFetch: string) => {
        setIsFetching(true);
        setFetchError(null);
        try {
            const raw = await getCoverLetter({ requestId: requestIdToFetch });
            const text = extractCoverLetterText(raw);

            const apiId = `cl:${requestIdToFetch}`;
            setItems((prev) => {
                const rest = prev.filter((it) => it.id !== apiId).map((it) => ({ ...it, isEditing: false }));
                if (!text) return rest;
                return [
                    {
                        id: apiId,
                        title: 'Cover letter',
                        body: text,
                        draftBody: text,
                        isEditing: false,
                    },
                    ...rest,
                ];
            });
        } catch (e: any) {
            setFetchError(getErrorMessage(e));
        } finally {
            setIsFetching(false);
            setHasFetchedOnce(true);
        }
    };

    useEffect(() => {
        if (!requestId) return;
        setHasFetchedOnce(false);
        void fetchCoverLetter(requestId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId]);

    const startEdit = (id: string) => {
        setItems((prev) =>
            prev.map((it) =>
                it.id === id ? { ...it, isEditing: true, draftBody: it.body } : { ...it, isEditing: false },
            ),
        );
    };

    const save = (id: string) => {
        setItems((prev) =>
            prev.map((it) => {
                if (it.id !== id) return it;
                const next = normalizeCoverLetter(it.draftBody);
                return { ...it, body: next || it.body, draftBody: next || it.body, isEditing: false };
            }),
        );
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

    const handleCreated = (args: { values: CreateCoverLetterValues; coverLetterText: string; requestId: string | null }) => {
        const { coverLetterText, requestId: createdRequestId } = args;

        if (createdRequestId) {
            setItems((prev) => prev.map((it) => ({ ...it, isEditing: false })));
            setStoredRequestId(createdRequestId);

     
            try {
                const nextParams = new URLSearchParams(searchParams.toString());
                nextParams.set('requestId', createdRequestId);
                nextParams.delete('RequestId');
                router.replace(`${pathname}?${nextParams.toString()}`);
            } catch {
                // ignore URL update issues
            }
            return;
        }

        const body = normalizeCoverLetter(coverLetterText);
        setItems((prev) => {
            const rest = prev.map((it) => ({ ...it, isEditing: false })).filter((it) => it.id !== 'cl:generated');
            if (!body) return rest;
            return [
                {
                    id: 'cl:generated',
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

            {!requestId && (
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

            {!isFetching && requestId && hasFetchedOnce && items.length === 0 && !fetchError && (
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
                            disabled={!requestId || isFetching}
                            onClick={() => requestId && fetchCoverLetter(requestId)}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            ))}

            <CreateCoverLetterDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={({ values, coverLetterText, requestId }) => handleCreated({ values, coverLetterText, requestId })}
            />
        </Stack>
    );
};

export default CoverLetter;
