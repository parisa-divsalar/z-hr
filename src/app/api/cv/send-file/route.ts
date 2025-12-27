import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { API_SERVER_BASE_URL } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export const runtime = 'nodejs';
export const maxDuration = 300; // 7 minutes (seconds) - allows long processing on supported platforms

const SEND_FILE_TIMEOUT_MS = 7 * 60 * 1000;

export async function POST(req: NextRequest) {
    try {
        const formDataClient = await req.formData();
        const tokenValue = (await cookies()).get('accessToken')?.value;

        if (!tokenValue) {
            return NextResponse.json({ error: 'No access token' }, { status: 401 });
        }

        let userId: string | null = null;
        try {
            const parsed = JSON.parse(tokenValue);
            userId = parsed ? String(parsed) : null;
        } catch {
            userId = tokenValue;
        }

        if (!userId) {
            return NextResponse.json({ error: 'No access token' }, { status: 401 });
        }

        const sendFileUrl = new URL('Apps/SendFile', API_SERVER_BASE_URL);
        sendFileUrl.searchParams.set('userId', userId);
        sendFileUrl.searchParams.set('lang', 'en');

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
