import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    return value;
};

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        const { searchParams } = new URL(request.url);
        const requestId = normalizeValue(payload?.requestId ?? searchParams.get('requestId'));

        const userIdFromCookie = normalizeValue((await cookies()).get('accessToken')?.value);
        const userId = normalizeValue(payload?.userId ?? searchParams.get('userId')) ?? userIdFromCookie;
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const lang = normalizeValue(payload?.lang ?? searchParams.get('lang')) ?? 'en';

        const bodyOfResume = payload?.bodyOfResume;

        const requestBody: Record<string, unknown> = { userId };
        if (requestId) requestBody.requestId = requestId;
        if (bodyOfResume !== undefined) requestBody.bodyOfResume = bodyOfResume;

        const response = await apiClientServer.post(
            `Apps/improve-cv-part?userId=${encodeURIComponent(userId)}&lang=${encodeURIComponent(lang)}`,
            requestBody,
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}

