import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') ?? 'Databases';

        const response = await apiClientServer.get(`SkillsBy-category/${category}`);
        const data = response.data;

        return NextResponse.json({ data });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
