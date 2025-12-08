import CacheError from '@/services/cache-error';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { apiClientServer } from '@/services/api-client';

export async function GET() {
    try {
        const response = await apiClientServer.get(`SlillsCategories`);
        const data = await response.data;

        return NextResponse.json({ data });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
