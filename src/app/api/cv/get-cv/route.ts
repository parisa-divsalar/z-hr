import CacheError from '@/services/cache-error';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiClientServer } from '@/services/api-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const userId = (await cookies()).get('accessToken')?.value;

        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get('requestId');

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const response = await apiClientServer.get(`Apps/GetCV?userId=${userId}&requestId=${requestId}`);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
