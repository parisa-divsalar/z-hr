'use client';

import { useEffect, useMemo, useState } from 'react';

import { CircularProgress, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'next/navigation';

import { HistoryEditeRoot } from '@/app/(private)/history-edite/styled';
import ResumeEditor from '@/components/Landing/Wizard/Step3/ResumeEditor';
import MuiAlert from '@/components/UI/MuiAlert';
import { THistoryChannel } from '@/components/History/type';
import { useAuthStore } from '@/store/auth';
import { useWizardStore } from '@/store/wizard';

import GapSection from './Components/GapSection';
import PreviewEdite from './Components/PreviewEdite';

const HistoryEdite = () => {
    const searchParams = useSearchParams();
    const id = useMemo(() => searchParams.get('id'), [searchParams]);
    const mode = useMemo(() => searchParams.get('mode'), [searchParams]);
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
            setError('Missing history id.');
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
                setError('Failed to load this history item.');
            })
            .finally(() => setIsLoading(false));
    }, [id, accessToken, mode]);

    useEffect(() => {
        if (mode !== 'editor') return;
        const requestId = String(id ?? '').trim();
        if (!requestId) return;
        setRequestId(requestId);
    }, [id, mode, setRequestId]);

    return (
        <HistoryEditeRoot>
            {mode === 'editor' ? (
                <ResumeEditor
                    setStage={() => undefined}
                    setActiveStep={() => undefined}
                    requestIdOverride={String(id ?? '').trim() || null}
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
