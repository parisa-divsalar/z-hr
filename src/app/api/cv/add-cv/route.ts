import CacheError from '@/services/cache-error';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiClientServer } from '@/services/api-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = (await cookies()).get('accessToken')?.value;
        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get('requestId')?.split('"')[1];
        const bodyOfResume = await request.json();

        const body = {
            userId,
            requestId,
            bodyOfResume,
        };

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        console.log('body =========>', body);

        const response = await apiClientServer.post('Apps/AddCV', body);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
