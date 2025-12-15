import CacheError from '@/services/cache-error';
import { AxiosError } from 'axios';
import { apiClientServer } from '@/services/api-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = searchParams.get('requestId');
        console.log('requestId requestId', requestId);

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const response = await apiClientServer.get(`Request/cv-analysis-detailed/${requestId.split('"')[1]}`);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
