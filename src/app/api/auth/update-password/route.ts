import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

type UpdatePasswordRequestBody = {
    userId?: string | number;
    [key: string]: unknown;
};

async function handleUpdatePassword(request: Request) {
    try {
        const input = (await request.json()) as UpdatePasswordRequestBody;
        const userId = input?.userId;

        if (userId === undefined || userId === null || String(userId).trim() === '') {
            return NextResponse.json({ error: { message: 'userId is required' } }, { status: 400 });
        }

        const { userId: _userId, ...payload } = input;

        const { data } = await apiClientServer.post(
            `Apps/UpdatePassword/${encodeURIComponent(String(userId))}`,
            payload,
        );

        return NextResponse.json({ data });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}

export async function POST(request: Request) {
    return handleUpdatePassword(request);
}

export async function PUT(request: Request) {
    return handleUpdatePassword(request);
}
