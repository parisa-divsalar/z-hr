import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import CacheError from '@/services/cache-error';
import { AxiosError } from 'axios';
import { apiClientServer } from '@/services/api-client';

const normalizeRequestId = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    return value;
};

export async function POST(request: NextRequest) {
    try {
        const requestId = normalizeRequestId(request.nextUrl.searchParams.get('requestId'));
        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const userId = (await cookies()).get('accessToken')?.value;
        const bodyOfResume = await request.json();

        const body = {
            userId,
            requestId,
            bodyOfResume,
        };

        const response = await apiClientServer.post('Apps/AddCV', body);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}


