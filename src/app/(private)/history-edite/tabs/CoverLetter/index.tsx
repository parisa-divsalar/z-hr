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
import { usePlanGate } from '@/hooks/usePlanGate';
import { getCoverLetter } from '@/services/cv/get-cover-letter';
import { listCoverLetters } from '@/services/cv/list-cover-letters';
import { updateCoverLetter } from '@/services/cv/update-cover-letter';
import { useTranslatedSummary } from '@/components/Landing/Wizard/Step3/ResumeEditor/hooks/useTranslatedSummary';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import type { Locale } from '@/store/common/type';
import { useWizardStore } from '@/store/wizard/useWizardStore';

import CreateCoverLetterDialog, { CreateCoverLetterValues } from './CreateCoverLetterDialog';

type CoverLetterItem = {
    id: string;
    requestId: string;
    cvRequestId?: string;
    title: string;
    body: string;
    draftBody: string;
    isEditing: boolean;
    createdAt?: string;
    updatedAt?: string;
    /** True if this cover letter is attached to the current resume (cvRequestId from URL/store). */
    isForCurrentResume?: boolean;
};

const normalizeCoverLetter = (text: string) => text.replace(/\r\n/g, '\n').trim();

/** Decode numeric HTML entities (e.g. &#10; -> newline) so they display correctly. */
function decodeHtmlNumericEntities(text: string): string {
    return String(text ?? '').replace(/&#(\d+);/g, (_, code) => {
        const n = parseInt(code, 10);
        return n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : `&#${code};`;
    });
}

/** Renders a single cover letter card; when locale is fa, title and body from API are translated to Persian. */
function CoverLetterCard({
    item,
    locale,
    t,
    resumeRequestId,
    isFetching,
    onStartEdit,
    onSave,
    onCancel,
    onUpdateDraft,
    onCopy,
    onRefresh,
}: {
    item: CoverLetterItem;
    locale: Locale;
    t: ReturnType<typeof getMainTranslations>['historyEdite']['coverLetter'];
    resumeRequestId: string | null;
    isFetching: boolean;
    onStartEdit: (id: string) => void;
    onSave: (id: string) => void;
    onCancel: (id: string) => void;
    onUpdateDraft: (id: string, value: string) => void;
    onCopy: (id: string) => void;
    onRefresh: () => void;
}) {
    const { displayText: displayTitle } = useTranslatedSummary(item.title, locale);
    const { displayText: displayBody } = useTranslatedSummary(item.body, locale);

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
        '& svg': { width: 24, height: 24, flexShrink: 0, display: 'block' },
        '& svg > rect': { display: 'none' },
    } as const;

    const rawTitle = item.isEditing ? item.title : displayTitle;
    const rawBody = item.isEditing ? item.draftBody : displayBody;
    const titleToShow = decodeHtmlNumericEntities(rawTitle);
    const bodyToShow = decodeHtmlNumericEntities(rawBody);
    const isRtl = locale === 'fa';

    return (
        <Stack
            gap={2}
            dir={isRtl ? 'rtl' : 'ltr'}
            sx={{
                border: '1px solid',
                borderColor: 'grey.100',
                borderRadius: 2,
                backgroundColor: 'common.white',
                px: 2.5,
                py: 2.25,
                minWidth: 0,
                direction: isRtl ? 'rtl' : 'ltr',
                textAlign: isRtl ? 'right' : 'left',
            }}
        >
            <Stack
                direction='row'
                alignItems='baseline'
                justifyContent='space-between'
                gap={1}
                sx={{ minWidth: 0, flexDirection: isRtl ? 'row-reverse' : 'row' }}
            >
                <Typography
                    variant='body1'
                    fontWeight={492}
                    color='text.primary'
                    sx={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        minWidth: 0,
                        textAlign: isRtl ? 'right' : 'left',
                    }}
                >
                    {titleToShow}
                </Typography>

                {resumeRequestId && item.isForCurrentResume === false && (
                    <Typography variant='caption' color='text.secondary' sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {t.otherResume}
                    </Typography>
                )}
            </Stack>

            {item.isEditing ? (
                <TextField
                    value={item.draftBody}
                    onChange={(e) => onUpdateDraft(item.id, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') onCancel(item.id);
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSave(item.id);
                    }}
                    placeholder={t.placeholder}
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
                        direction: isRtl ? 'rtl' : 'ltr',
                        '& .MuiInputBase-root': { alignItems: 'flex-start' },
                        '& .MuiInputBase-input': {
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            textAlign: isRtl ? 'right' : 'left',
                            direction: isRtl ? 'rtl' : 'ltr',
                        },
                    }}
                />
            ) : (
                <Typography
                    variant='body2'
                    color='text.primary'
                    sx={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-line',
                        textAlign: isRtl ? 'right' : 'left',
                        direction: isRtl ? 'rtl' : 'ltr',
                    }}
                >
                    {bodyToShow}
                </Typography>
            )}

            <Stack
                direction='row'
                alignItems='center'
                gap={1}
                sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}
            >
                {item.isEditing ? (
                    <>
                        <IconButton sx={iconButtonSx} onClick={() => onSave(item.id)} aria-label={t.save}>
                            <Check fontSize='small' />
                        </IconButton>
                        <IconButton sx={iconButtonSx} onClick={() => onCancel(item.id)} aria-label={t.cancel}>
                            <Close fontSize='small' />
                        </IconButton>
                    </>
                ) : (
                    <IconButton sx={iconButtonSx} onClick={() => onStartEdit(item.id)} aria-label={t.edit}>
                        <EditIcon />
                    </IconButton>
                )}

                <IconButton sx={iconButtonSx} onClick={() => onCopy(item.id)} aria-label={t.copy}>
                    <CopyIcon />
                </IconButton>
                <IconButton
                    sx={iconButtonSx}
                    aria-label={t.refresh}
                    disabled={isFetching}
                    onClick={onRefresh}
                >
                    <RefreshIcon />
                </IconButton>
            </Stack>
        </Stack>
    );
}

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

const getErrorMessage = (error: any, fallback: string): string => {
    const maybe =
        error?.response?.data?.error?.message ??
        error?.response?.data?.error ??
        error?.response?.data?.message ??
        error?.message ??
        error?.toString?.();

    if (typeof maybe === 'string' && maybe.trim()) return maybe.trim();
    return fallback;
};

const CoverLetter = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).historyEdite.coverLetter;
    const storedRequestId = useWizardStore((s) => s.requestId);
    const setStoredRequestId = useWizardStore((s) => s.setRequestId);
    const { guardAction, planDialog } = usePlanGate();

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
    const [fetchScope, setFetchScope] = useState<'resume' | 'user' | 'merged'>('resume');

    const fetchCoverLetters = async (args?: { cvRequestId?: string | null }) => {
        const cvRequestId = String(args?.cvRequestId ?? '').trim();
        setIsFetching(true);
        setFetchError(null);
        setFetchScope(cvRequestId ? 'resume' : 'user');
        try {
            // If we have a resumeRequestId, fetch BOTH:
            // - cover letters attached to this resume (cvRequestId filter)
            // - all saved cover letters for the user (no filter)
            // This fixes cases where users expect "all my cover letters" even when page is opened with ?id=...
            const [resByResume, resByUser] = await Promise.all([
                listCoverLetters({ cvRequestId: cvRequestId || null }),
                cvRequestId
                    ? // best-effort: user scope requires auth; if it fails we still show resume-scoped list
                      listCoverLetters({ cvRequestId: null }).catch(() => null as any)
                    : Promise.resolve(null as any),
            ]);

            const mergedRows = [
                ...(resByResume?.items ?? []),
                ...((cvRequestId ? (resByUser?.items ?? []) : []) as any[]),
            ];

            const byRequestId = new Map<string, any>();
            for (const row of mergedRows) {
                const rid = String(row?.requestId ?? '').trim();
                if (!rid) continue;
                // Keep the newest row for a given requestId (defensive; requestId should be unique)
                const prev = byRequestId.get(rid);
                const prevT = String(prev?.updatedAt ?? prev?.createdAt ?? '');
                const nextT = String(row?.updatedAt ?? row?.createdAt ?? '');
                if (!prev || nextT.localeCompare(prevT) > 0) byRequestId.set(rid, row);
            }

            const uniqueRows = Array.from(byRequestId.values());

            if (cvRequestId && resByUser?.items?.length) setFetchScope('merged');

            const nextItems: CoverLetterItem[] = uniqueRows
                .map((row: any) => {
                    const text = extractCoverLetterText(row?.coverLetter ?? row) ?? '';
                    const title = extractCoverLetterTitle(row, t.coverLetterFallback);
                    const requestId = String(row?.requestId ?? '').trim();
                    if (!requestId || !text) return null;
                    const rowCvRequestId = String(row?.cvRequestId ?? row?.cv_request_id ?? '').trim();
                    return {
                        id: `cl:${requestId}`,
                        requestId,
                        cvRequestId: rowCvRequestId || undefined,
                        title,
                        body: text,
                        draftBody: text,
                        isEditing: false,
                        createdAt: row?.createdAt,
                        updatedAt: row?.updatedAt,
                        isForCurrentResume: cvRequestId ? rowCvRequestId === cvRequestId : undefined,
                    } satisfies CoverLetterItem;
                })
                .filter(Boolean) as CoverLetterItem[];

            // Newest first
            nextItems.sort((a, b) => String(b.updatedAt ?? b.createdAt ?? '').localeCompare(String(a.updatedAt ?? a.createdAt ?? '')));

            setItems(nextItems);
        } catch (e: any) {
            // Backward compatible fallback: if list endpoint isn't available for some reason, try old single fetch.
            try {
                if (!cvRequestId) throw e;
                const raw = await getCoverLetter({ requestId: cvRequestId });
                const text = extractCoverLetterText(raw);
                const title = extractCoverLetterTitle(raw, t.coverLetterFallback);
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
                setFetchError(getErrorMessage(inner ?? e, t.failedToLoad));
            }
        } finally {
            setIsFetching(false);
            setHasFetchedOnce(true);
        }
    };

    useEffect(() => {
        setHasFetchedOnce(false);
        void fetchCoverLetters(resumeRequestId ? { cvRequestId: resumeRequestId } : undefined);
         
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
            setFetchError(getErrorMessage(e, t.failedToLoad));
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

    const handleProtectedAddNew = () => guardAction(handleAddNew, 'cover_letter');

    const handleCreated = (args: {
        values: CreateCoverLetterValues;
        coverLetterText: string;
        requestId: string | null;
        rawResponse?: unknown;
    }) => {
        const { coverLetterText, requestId: createdRequestId, rawResponse } = args;

        if (createdRequestId) {
            const body = normalizeCoverLetter(coverLetterText);
            const title = extractCoverLetterTitle(rawResponse, t.coverLetterFallback);

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
            void fetchCoverLetters({ cvRequestId: nextResumeId });
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
                    title: t.coverLetterFallback,
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
            {planDialog}
            {fetchError && <MuiAlert severity='error' message={fetchError} hideDismissButton />}

            {!resumeRequestId && !isFetching && !fetchError && (
                <MuiAlert
                    severity='info'
                    message={t.showingSaved}
                    hideDismissButton
                />
            )}

            {resumeRequestId && fetchScope === 'merged' && !isFetching && !fetchError && (
                <MuiAlert
                    severity='info'
                    message={t.showingMerged}
                    hideDismissButton
                />
            )}

            <Stack direction='row' justifyContent='flex-end'>
                <MuiButton
                    onClick={handleProtectedAddNew}
                    text={t.addNew}
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
                        {t.loadingCoverLetter}
                    </Typography>
                </Stack>
            )}

            {!isFetching && resumeRequestId && hasFetchedOnce && items.length === 0 && !fetchError && (
                <Typography variant='body2' color='text.secondary'>
                    {t.noCoverLetterForRequest}
                </Typography>
            )}

            {!isFetching && !resumeRequestId && fetchScope === 'user' && hasFetchedOnce && items.length === 0 && !fetchError && (
                <Typography variant='body2' color='text.secondary'>
                    {t.noSavedCoverLetters}
                </Typography>
            )}

            {items.map((item) => (
                <CoverLetterCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    t={t}
                    resumeRequestId={resumeRequestId}
                    isFetching={isFetching}
                    onStartEdit={startEdit}
                    onSave={save}
                    onCancel={cancel}
                    onUpdateDraft={updateDraft}
                    onCopy={handleCopy}
                    onRefresh={() => fetchCoverLetters(resumeRequestId ? { cvRequestId: resumeRequestId } : undefined)}
                />
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
