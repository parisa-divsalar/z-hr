import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export async function PUT(request: NextRequest) {
    try {
        const userId = (await cookies()).get('accessToken')?.value;

        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get('requestId');

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const bodyOfResume = await request.json();

        const response = await apiClientServer.put(`Apps/EditCV?userId=${userId}&requestId=${requestId}`, bodyOfResume);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
