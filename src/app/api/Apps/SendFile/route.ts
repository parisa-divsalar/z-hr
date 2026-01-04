import https from 'https';

import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


import { API_SERVER_BASE_URL } from '@/services/api-client';

export const runtime = 'nodejs';
export const maxDuration = 420; // 7 minutes (seconds) - allows long processing on supported platforms

const SEND_FILE_TIMEOUT_MS = 7 * 60 * 1000;
const httpsAgent = new https.Agent({ keepAlive: true });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseUserIdFromToken = (tokenValue: string | undefined): string | null => {
    if (!tokenValue) return null;
    try {
        const parsed = JSON.parse(tokenValue);
        if (parsed) return String(parsed);
        return null;
    } catch {
        return tokenValue;
    }
};

class ExternalResponseError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ExternalResponseError';
    }
}

const isAxiosError = (err: unknown): err is AxiosError => Boolean((err as AxiosError | undefined)?.isAxiosError);
const isRetryableNetworkError = (err: unknown) => {
    if (!isAxiosError(err)) return false;
    const code = err.code;
    return code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'ECONNABORTED' || code === 'EAI_AGAIN';
};

const normalizeUpstreamText = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
    return trimmed;
};

const createForwardHeaders = (req: NextRequest) => {
    const headers = new Headers();

    const contentType = req.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);

    headers.set('accept', req.headers.get('accept') || 'text/plain');

    return headers;
};

const createSendFileUrl = (userId: string, lang: string) => {
    const url = new URL('Apps/SendFile', API_SERVER_BASE_URL);
    url.searchParams.set('userId', userId);
    url.searchParams.set('lang', lang);
    return url;
};

const forwardFileToApi = async (req: NextRequest, userId: string, lang: string) => {
    const sendFileUrl = createSendFileUrl(userId, lang);
    const body = await req.arrayBuffer();
    const bodyByteLength = body.byteLength;
    const contentType = req.headers.get('content-type') || undefined;
    const upstreamHost = new URL(API_SERVER_BASE_URL).host;

    const deadline = Date.now() + SEND_FILE_TIMEOUT_MS;

    const headers = createForwardHeaders(req);
    if (!headers.get('user-agent')) headers.set('user-agent', 'z-cv-nextjs/AppsSendFile');

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const remainingMs = Math.max(1000, deadline - Date.now());
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), remainingMs);

        try {
            const response = await axios.request<string>({
                url: sendFileUrl.toString(),
                method: 'POST',
                data: Buffer.from(body),
                headers: Object.fromEntries(headers.entries()),
                timeout: remainingMs,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                httpsAgent,
                signal: controller.signal,
                responseType: 'text',
                validateStatus: () => true,
            });

            const resultText = typeof response.data === 'string' ? response.data : String(response.data ?? '');

            if (response.status < 200 || response.status >= 300) {
                console.log('SendFile response error', response.status, resultText);
                throw new ExternalResponseError(response.status, resultText || 'SendFile request failed');
            }

            return normalizeUpstreamText(resultText);
        } catch (err) {
            const shouldRetry = attempt < maxAttempts && isRetryableNetworkError(err) && !controller.signal.aborted;

            if (shouldRetry) {
                console.warn('SendFile network error, retrying', {
                    attempt,
                    code: isAxiosError(err) ? err.code : undefined,
                    upstreamHost,
                    contentType,
                    bodyByteLength,
                });
                await sleep(250 * 2 ** (attempt - 1));
                continue;
            }

            throw err;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // Unreachable, but keeps TS happy.
    throw new Error('SendFile failed');
};

const parseUserIdFromQuery = (req: NextRequest) => {
    const param = req.nextUrl.searchParams.get('userId');
    return param?.trim() ?? null;
};

const parseLangFromQuery = (req: NextRequest) => {
    const param = req.nextUrl.searchParams.get('lang');
    return param?.trim() || 'en';
};

const errorResponse = (body: string, status = 500) => NextResponse.json({ error: body }, { status });

export async function POST(req: NextRequest) {
    const queryUserId = parseUserIdFromQuery(req);
    const lang = parseLangFromQuery(req);
    const tokenValue = (await cookies()).get('accessToken')?.value;
    const tokenUserId = parseUserIdFromToken(tokenValue);
    const userId = queryUserId ?? tokenUserId;

    if (!userId) {
        return errorResponse('No access token or userId query provided', 401);
    }

    try {
        const result = await forwardFileToApi(req, userId, lang);
        return NextResponse.json({ result });
    } catch (error) {
        if (error instanceof ExternalResponseError) {
            return errorResponse(error.message, error.status);
        }

        const contentType = req.headers.get('content-type');
        const contentLength = req.headers.get('content-length');
        console.error('SendFile error', {
            upstreamHost: new URL(API_SERVER_BASE_URL).host,
            code: isAxiosError(error) ? error.code : undefined,
            message: error instanceof Error ? error.message : String(error),
            contentType,
            contentLength,
        });

        const err = error as any;
        const message = error instanceof Error ? error.message : 'Unknown error';
        const cause = err?.cause;
        const causeMessage =
            cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : cause ? JSON.stringify(cause) : '';
        const details = causeMessage && causeMessage !== message ? ` (${causeMessage})` : '';
        return errorResponse(`Unable to forward file: ${message}${details}`);
    }
}
