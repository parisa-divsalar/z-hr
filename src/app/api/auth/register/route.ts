import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const input = await request.json();
        const response = await apiClientServer.post(`Register`, input);
        const data = await response.data;

        return NextResponse.json({ data });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
