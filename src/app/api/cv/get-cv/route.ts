import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

const normalizeId = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    return value;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = normalizeId(searchParams.get('requestId') ?? searchParams.get('RequestId'));
        const userIdFromQuery = normalizeId(searchParams.get('userId'));
        const userIdFromCookie = normalizeId((await cookies()).get('accessToken')?.value);
        const userId = userIdFromQuery ?? userIdFromCookie;

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await apiClientServer.get(`Apps/GetCV?userId=${userId}&requestId=${requestId}`);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
