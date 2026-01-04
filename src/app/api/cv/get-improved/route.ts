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
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = normalizeValue(searchParams.get('RequestId') ?? searchParams.get('requestId'));

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const response = await withRetry(() =>
            apiClientServer.get(`Apps/get-improved-cv-part?RequestId=${encodeURIComponent(requestId)}`, {
                headers: {
                    Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
                },
            }),
        );

        const raw = response.data as unknown;

        const tryParseJson = (value: unknown) => {
            if (typeof value !== 'string') return value;
            const trimmed = value.trim();
            if (!trimmed) return value;
            if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return value;
            try {
                return JSON.parse(trimmed);
            } catch {
                return value;
            }
        };

        const parsed = tryParseJson(raw);

        const normalizedBody =
            parsed === null || parsed === undefined
                ? {
                      success: false,
                      processedContent: null,
                      originalContent: null,
                      message: 'Empty response from upstream',
                  }
                : typeof parsed === 'string'
                  ? {
                        success: true,
                        raw: parsed,
                    }
                  : parsed;

        return NextResponse.json(normalizedBody, {
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
