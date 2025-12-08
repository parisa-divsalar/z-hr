import CacheError from '@/services/cache-error';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { apiClientServer } from '@/services/api-client';

export async function POST(request: Request) {
    try {
        const input = await request.json();
        const { data } = await apiClientServer.post('Login', input);

        const response = NextResponse.json({ data });

        response.cookies.set('user', JSON.stringify(data), {
            path: '/',
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
