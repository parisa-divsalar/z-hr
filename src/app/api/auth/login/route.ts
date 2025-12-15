import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export async function POST(request: Request) {
    try {
        const input = await request.json();
        const { data } = await apiClientServer.post('Apps/Login', input);

        const response = NextResponse.json({ data });

        response.cookies.set('accessToken', JSON.stringify(data.userId), {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 روز
        });

        return response;
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
