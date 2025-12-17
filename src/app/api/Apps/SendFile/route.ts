import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { API_SERVER_BASE_URL } from '@/services/api-client';

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
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ExternalResponseError';
    }
}

const createForwardHeaders = (contentType?: 'json' | 'form') => {
    // Keep this minimal to avoid leaking hop-specific / browser headers to the API server.
    // Also, DO NOT manually set multipart boundaries: let fetch do it when body is FormData.
    const headers = new Headers();
    headers.set('accept', 'text/plain');
    if (contentType === 'json') {
        headers.set('content-type', 'application/json');
    }
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

    const incomingContentType = req.headers.get('content-type') || '';
    const isMultipart = incomingContentType.includes('multipart/form-data');
    const isJson = !isMultipart;

    const body = isJson ? JSON.stringify(await req.json()) : await req.formData();
    const response = await fetch(sendFileUrl, {
        method: 'POST',
        headers: createForwardHeaders(isJson ? 'json' : 'form'),
        body,
    });

    const resultText = await response.text();

    if (!response.ok) {
        console.log('SendFile response error', response.status, resultText);
        throw new ExternalResponseError(response.status, resultText || 'SendFile request failed');
    }

    return resultText;
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
        console.error('SendFile error', error);
        return errorResponse('Unable to forward file');
    }
}
