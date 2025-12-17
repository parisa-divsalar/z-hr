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

        const requestId = normalizeValue(payload.requestId ?? new URL(request.url).searchParams.get('requestId'));
        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const userIdFromCookie = normalizeValue((await cookies()).get('accessToken')?.value);
        const userId = payload?.userId ?? userIdFromCookie;
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const bodyOfResume = payload.bodyOfResume ?? payload;
        if (!bodyOfResume) {
            return NextResponse.json({ message: 'bodyOfResume is required' }, { status: 400 });
        }

        const response = await apiClientServer.post('Apps/AddCV', {
            userId,
            requestId,
            bodyOfResume,
        });

        if (response.status === 200) {
            const refreshedCv = await apiClientServer.get(`Apps/GetCV?userId=${userId}&requestId=${requestId}`);
            return NextResponse.json(refreshedCv.data);
        }

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
