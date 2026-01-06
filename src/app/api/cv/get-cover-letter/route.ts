import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableAxiosError = (error: unknown) => {
    const err = error as AxiosError | undefined;
    const status = err?.response?.status;

    if (!status) return true;

    // Timeouts
    if (err?.code === 'ECONNABORTED' || err?.code === 'ETIMEDOUT') return true;

    if (status === 408 || status === 429) return true;

    if (status >= 500 && status <= 599) return true;

    return false;
};

async function withRetry<T>(
    fn: (attempt: number) => Promise<T>,
    {
        maxAttempts = 3,
        baseDelayMs = 300,
        maxDelayMs = 2000,
    }: { maxAttempts?: number; baseDelayMs?: number; maxDelayMs?: number } = {},
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn(attempt);
        } catch (err) {
            lastError = err;
            const shouldRetry = attempt < maxAttempts && isRetryableAxiosError(err);
            if (!shouldRetry) break;

            const exponential = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
            const jitter = Math.floor(Math.random() * 150);
            await sleep(exponential + jitter);
        }
    }

    throw lastError;
}

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
    return trimmed;
};

const toText = (value: unknown): string | null => {
    if (typeof value === 'string') {
        const trimmed = value.replace(/\r\n/g, '\n').trim();
        return trimmed ? trimmed : null;
    }

    if (!value || typeof value !== 'object') return null;

    const obj = value as Record<string, unknown>;
    const directCandidates = [
        obj.uiContent,
        obj.coverLetter,
        obj.cover_letter,
        obj.letter,
        obj.body,
        obj.content,
        obj.text,
        obj.message,
        obj.result,
        (obj.data as any)?.uiContent,
        (obj.data as any)?.result,
        (obj.data as any)?.text,
        (obj.data as any)?.content,
        (obj.result as any)?.coverLetter,
        (obj.result as any)?.text,
        (obj.result as any)?.content,
    ];

    for (const c of directCandidates) {
        if (typeof c === 'string') {
            const trimmed = c.replace(/\r\n/g, '\n').trim();
            if (trimmed) return trimmed;
        }
    }

    return null;
};

const tryParseJson = (value: unknown) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return value;
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
    try {
        return JSON.parse(trimmed) as unknown;
    } catch {
        return value;
    }
};

const extractStatus = (payload: unknown): number | null => {
    const asNumber = (v: unknown): number | null => {
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        if (typeof v === 'string') {
            const trimmed = v.trim();
            if (!trimmed) return null;
            const n = Number(trimmed);
            if (Number.isFinite(n)) return n;
        }
        return null;
    };

    const parsed = tryParseJson(payload);
    if (!parsed || typeof parsed !== 'object') return null;

    const obj = parsed as Record<string, unknown>;

    const direct =
        obj.status ??
        obj.Status ??
        obj.main_request_status ??
        obj.mainRequestStatus ??
        (obj.result as any)?.status ??
        (obj.result as any)?.Status ??
        (obj.data as any)?.status ??
        (obj.data as any)?.Status ??
        (obj.data as any)?.main_request_status ??
        null;

    const normalized = asNumber(direct);
    if (normalized !== null) return normalized;

    // Wrapper like { result: { value: ..., statusCode: 200 } } - not "status:2" but keep here for future.
    return null;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = normalizeValue(searchParams.get('RequestId') ?? searchParams.get('requestId'));

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        // Poll until upstream reports status === 2 (Done) or we time out.
        // Important: do NOT stop early just because some text exists; caller expects status-driven readiness.
        const start = Date.now();
        const maxTotalMs = 55_000;
        const maxAttempts = 30;

        let lastPayload: unknown = null;
        let lastParsed: unknown = null;
        let lastStatus: number | null = null;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const response = await withRetry(() =>
                apiClientServer.get(`Apps/get-cover-letter?RequestId=${encodeURIComponent(requestId)}`, {
                    headers: {
                        Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
                    },
                }),
            );

            lastPayload = response.data as unknown;
            lastParsed = tryParseJson(lastPayload);
            lastStatus = extractStatus(lastParsed);

            if (lastStatus === 2) break;

            if (Date.now() - start > maxTotalMs) break;

            const delay = Math.min(4000, 1200 + attempt * 200);
            await sleep(delay);
        }

        const parsed = lastParsed;

        const normalizedBody =
            parsed === null || parsed === undefined
                ? { success: false, uiContent: null, message: 'Empty response from upstream', status: lastStatus }
                : typeof parsed === 'string'
                  ? { success: true, uiContent: parsed.trim() || null, raw: parsed, status: lastStatus }
                  : parsed;

        if (normalizedBody && typeof normalizedBody === 'object') {
            const body = normalizedBody as Record<string, unknown>;
            const uiContent = toText(body) ?? toText(body.processedContent ?? body.raw ?? body.result ?? body.data);
            if (uiContent !== null) body.uiContent = uiContent;
            if (typeof body.status !== 'number' && lastStatus !== null) body.status = lastStatus;
        }

        return NextResponse.json(normalizedBody, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}


