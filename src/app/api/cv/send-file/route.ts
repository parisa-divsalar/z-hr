import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import axios, { AxiosError } from 'axios';

import { API_SERVER_BASE_URL } from '@/services/api-client';

export const runtime = 'nodejs';
export const maxDuration = 300; // 7 minutes (seconds) - allows long processing on supported platforms

const SEND_FILE_TIMEOUT_MS = 7 * 60 * 1000;

const normalizeUpstreamText = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
    return trimmed;
};

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

const parseUserIdFromQuery = (req: NextRequest) => {
    const param = req.nextUrl.searchParams.get('userId');
    return param?.trim() ?? null;
};

const parseLangFromQuery = (req: NextRequest) => {
    const param = req.nextUrl.searchParams.get('lang');
    return param?.trim() || 'en';
};

const isAxiosError = (err: unknown): err is AxiosError => Boolean((err as AxiosError | undefined)?.isAxiosError);

export async function POST(req: NextRequest) {
    try {
        const userIdFromQuery = parseUserIdFromQuery(req);
        const lang = parseLangFromQuery(req);
        const tokenValue = (await cookies()).get('accessToken')?.value;
        const userIdFromCookie = parseUserIdFromToken(tokenValue);
        const userId = userIdFromQuery ?? userIdFromCookie;

        if (!userId) {
            return NextResponse.json({ error: 'No access token or userId query provided' }, { status: 401 });
        }

        const sendFileUrl = new URL('Apps/SendFile', API_SERVER_BASE_URL);
        sendFileUrl.searchParams.set('userId', userId);
        sendFileUrl.searchParams.set('lang', lang);

        const body = await req.arrayBuffer();
        const headers = new Headers();
        const contentType = req.headers.get('content-type');
        if (contentType) headers.set('content-type', contentType);
        headers.set('accept', req.headers.get('accept') || 'text/plain');
        if (!headers.get('user-agent')) headers.set('user-agent', 'z-cv-nextjs/cvSendFile');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SEND_FILE_TIMEOUT_MS);

        try {
            const upstream = await axios.request<string>({
                url: sendFileUrl.toString(),
                method: 'POST',
                data: Buffer.from(body),
                headers: Object.fromEntries(headers.entries()),
                timeout: SEND_FILE_TIMEOUT_MS,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                signal: controller.signal,
                responseType: 'text',
                validateStatus: () => true,
            });

            const resultText = typeof upstream.data === 'string' ? upstream.data : String(upstream.data ?? '');

            if (upstream.status < 200 || upstream.status >= 300) {
                console.log('SendFile response error', upstream.status, resultText);
                return NextResponse.json({ error: resultText }, { status: upstream.status });
            }

            return NextResponse.json({ result: normalizeUpstreamText(resultText) });
        } finally {
            clearTimeout(timeoutId);
        }
    } catch (error) {
        const err = error as any;
        const message = error instanceof Error ? error.message : 'Unknown error';
        const cause = err?.cause;
        const causeMessage =
            cause instanceof Error ? cause.message : typeof cause === 'string' ? cause : cause ? JSON.stringify(cause) : '';
        const details = causeMessage && causeMessage !== message ? ` (${causeMessage})` : '';

        const contentType = req.headers.get('content-type');
        const contentLength = req.headers.get('content-length');
        console.error('cv/send-file error', {
            upstreamHost: new URL(API_SERVER_BASE_URL).host,
            code: isAxiosError(error) ? error.code : undefined,
            message,
            contentType,
            contentLength,
        });

        return NextResponse.json({ error: `Unable to forward file: ${message}${details}` }, { status: 500 });
    }
}
