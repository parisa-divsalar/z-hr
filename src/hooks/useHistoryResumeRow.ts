import { useEffect, useState } from 'react';

import type { THistoryChannel } from '@/components/History/type';
import { useAuthStore } from '@/store/auth';

type UseHistoryResumeRowState = {
    row: THistoryChannel | null;
    isLoading: boolean;
    error: string | null;
};

/**
 * Load the "resume summary" row that powers History cards.
 * We reuse it in Resume Generator pages to avoid mock data.
 *
 * Note: `/api/history` will auto-materialize a missing row from `cvs.json`,
 * so this also works right after resume creation.
 */
export function useHistoryResumeRow(requestId: string | null) {
    const accessToken = useAuthStore((s) => s.accessToken);
    const [state, setState] = useState<UseHistoryResumeRowState>({
        row: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        const id = String(requestId ?? '').trim();
        if (!id) {
            setState({ row: null, isLoading: false, error: null });
            return;
        }

        const controller = new AbortController();
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        fetch(`/api/history?id=${encodeURIComponent(id)}`, {
            cache: 'no-store',
            signal: controller.signal,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((json) => {
                const row = (json?.data ?? null) as THistoryChannel | null;
                if (!row?.id) throw new Error('Invalid response');
                setState({ row, isLoading: false, error: null });
            })
            .catch((e) => {
                if (controller.signal.aborted) return;
                const message = e instanceof Error ? e.message : 'Failed to load resume info';
                setState({ row: null, isLoading: false, error: message });
            });

        return () => controller.abort();
    }, [requestId, accessToken]);

    return state;
}

