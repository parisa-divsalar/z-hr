import CacheError from '@/services/cache-error';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { API_SERVER_BASE_URL } from '@/services/api-client';
import { NextRequest, NextResponse } from 'next/server';

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

        const response = await fetch(sendFileUrl, {
            method: 'POST',
            headers: {
                accept: 'text/plain',
            },
            body: formDataClient,
        });

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
