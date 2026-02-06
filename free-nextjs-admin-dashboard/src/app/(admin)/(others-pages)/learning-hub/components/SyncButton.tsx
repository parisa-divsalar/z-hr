'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';
const SYNC_ENDPOINT = `${API_BASE}/api/learning-hub/sync`;
const POLL_INTERVAL_MS = 5000;

type SyncStatusResponse = {
  status?: string;
  state?: string;
  syncing?: boolean;
  isSyncing?: boolean;
  inProgress?: boolean;
  completed?: boolean;
};

const isSyncComplete = (data: SyncStatusResponse | null) => {
  if (!data) {
    return false;
  }

  if (typeof data.completed === 'boolean') {
    return data.completed;
  }

  if (typeof data.syncing === 'boolean') {
    return !data.syncing;
  }

  if (typeof data.isSyncing === 'boolean') {
    return !data.isSyncing;
  }

  if (typeof data.inProgress === 'boolean') {
    return !data.inProgress;
  }

  const status = data.status ?? data.state;
  if (typeof status === 'string') {
    const normalized = status.toLowerCase();
    return ['complete', 'completed', 'done', 'idle', 'success'].includes(normalized);
  }

  return false;
};

const parseSyncStatus = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  return (await response.json()) as SyncStatusResponse;
};

const SyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const pollSyncStatus = useCallback(async () => {
    const response = await fetch(SYNC_ENDPOINT, { method: 'GET' });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Sync status failed: ${response.status}`);
    }

    const data = await parseSyncStatus(response);
    if (isSyncComplete(data)) {
      setIsSyncing(false);
      clearPollTimer();
    }
  }, [clearPollTimer]);

  const startPolling = useCallback(() => {
    clearPollTimer();
    pollTimerRef.current = window.setInterval(() => {
      pollSyncStatus().catch((pollError: unknown) => {
        const message = pollError instanceof Error ? pollError.message : 'Sync status failed.';
        console.error(pollError);
        setError(message);
        setIsSyncing(false);
        clearPollTimer();
      });
    }, POLL_INTERVAL_MS);
  }, [clearPollTimer, pollSyncStatus]);

  const handleSync = useCallback(async () => {
    setError(null);
    const response = await fetch(SYNC_ENDPOINT, { method: 'POST' });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Sync request failed: ${response.status}`);
    }

    setIsSyncing(true);
    startPolling();
  }, [startPolling]);

  useEffect(() => {
    if (!isSyncing) {
      clearPollTimer();
      return;
    }

    pollSyncStatus().catch((pollError: unknown) => {
      const message = pollError instanceof Error ? pollError.message : 'Sync status failed.';
      console.error(pollError);
      setError(message);
      setIsSyncing(false);
      clearPollTimer();
    });

    return () => {
      clearPollTimer();
    };
  }, [clearPollTimer, isSyncing, pollSyncStatus]);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => {
          handleSync().catch((syncError: unknown) => {
            const message = syncError instanceof Error ? syncError.message : 'Sync request failed.';
            console.error(syncError);
            setError(message);
            setIsSyncing(false);
            clearPollTimer();
          });
        }}
        disabled={isSyncing}
        aria-busy={isSyncing}
      >
        {isSyncing ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Syncing...
          </>
        ) : (
          'Sync'
        )}
      </button>
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </div>
  );
};

export default SyncButton;
