import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { API_SERVER_BASE_URL } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export const runtime = 'nodejs';
export const maxDuration = 300; // 7 minutes (seconds) - allows long processing on supported platforms

const SEND_FILE_TIMEOUT_MS = 7 * 60 * 1000;

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

export async function POST(req: NextRequest) {
    try {
        const formDataClient = await req.formData();
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SEND_FILE_TIMEOUT_MS);

        let response: Response;
        try {
            response = await fetch(sendFileUrl, {
                method: 'POST',
                headers: {
                    accept: 'text/plain',
                },
                body: formDataClient,
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeoutId);
        }

        const resultText = await response.text();

        if (!response.ok) {
            console.log('SendFile response error', response.status, resultText);
            return NextResponse.json({ error: resultText }, { status: response.status });
        }

        return NextResponse.json({ result: resultText });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
