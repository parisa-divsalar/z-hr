'use client';

import { useEffect, useMemo, useState } from 'react';

import { CircularProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'next/navigation';

import { HistoryEditeRoot } from '@/app/(private)/history-edite/styled';
import { THistoryChannel } from '@/components/History/type';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import { getMainTranslations } from '@/locales/main';
import { useAuthStore } from '@/store/auth';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';

import GapSection from './Components/GapSection';
import PreviewEdite from './Components/PreviewEdite';

const HistoryEdite = () => {
    const searchParams = useSearchParams();
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).historyEdite.page;
    const id = useMemo(() => searchParams.get('id'), [searchParams]);
    const mode = useMemo(() => searchParams.get('mode'), [searchParams]);
    const userId = useMemo(() => searchParams.get('userId'), [searchParams]);
    const accessToken = useAuthStore((s) => s.accessToken);
    const setRequestId = useWizardStore((s) => s.setRequestId);

    const [row, setRow] = useState<THistoryChannel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // In editor mode we don't need the history row; ResumeEditor will load CV by requestId.
        if (mode === 'editor') return;
        if (!id) {
            setRow(null);
            setError(t.missingHistoryId);
            return;
        }
        setIsLoading(true);
        setError(null);
        fetch(`/api/history?id=${encodeURIComponent(id)}`, {
            cache: 'no-store',
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((json) => {
                const data = json?.data as THistoryChannel | undefined;
                if (!data?.id) throw new Error('Invalid response');
                setRow(data);
            })
            .catch(() => {
                setRow(null);
                setError(t.failedToLoadHistory);
            })
            .finally(() => setIsLoading(false));
    }, [id, accessToken, mode, t.missingHistoryId, t.failedToLoadHistory]);

    useEffect(() => {
        if (mode !== 'editor') return;
        const requestId = String(id ?? '').trim();
        if (!requestId) return;
        setRequestId(requestId);
    }, [id, mode, setRequestId]);

    const normalized = useMemo(() => {
        const requestId = String(id ?? '').trim();
        const apiUserId = String(userId ?? '').trim();
        return {
            requestId: requestId || null,
            apiUserId: apiUserId || null,
        };
    }, [id, userId]);

    return (
        <HistoryEditeRoot>
            {mode === 'editor' ? (
                <ResumeEditor
                    setStage={() => undefined}
                    setActiveStep={() => undefined}
                    requestIdOverride={normalized.requestId}
                    apiUserId={normalized.apiUserId}
                    /**
                     * History edit is an "open existing CV" flow.
                     * We must NOT poll cv-analysis-detailed (it can hang for already-processed/old rows).
                     */
                    disableAutoPoll
                />
            ) : (
                <>
            <Stack sx={{ mb: 2 }}>
                {error && <MuiAlert severity='error' message={error} />}
                {isLoading && (
                    <Stack direction='row' justifyContent='center' sx={{ py: 2 }}>
                        <CircularProgress size={24} />
                    </Stack>
                )}
            </Stack>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 12 }}>
                    <PreviewEdite historyRow={row ?? undefined} />
                </Grid>

                {/*<Grid size={{ xs: 12, md: 12 }}>*/}
                {/*  <HistoryQuestions />*/}
                {/*</Grid>*/}

                <Grid size={{ xs: 12, md: 12 }}>
                    <GapSection />
                </Grid>
            </Grid>
                </>
            )}
        </HistoryEditeRoot>
    );
};

export default HistoryEdite;
