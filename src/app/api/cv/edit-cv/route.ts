import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    return value;
};

export async function PUT(request: NextRequest) {
    let requestId: string | null = null;
    let userId: string | null = null;
    let bodyOfResume: unknown = null;
    try {
        const payload = await request.json();

        const { searchParams } = new URL(request.url);
        requestId = normalizeValue(payload?.requestId ?? searchParams.get('requestId'));

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const userIdFromCookie = normalizeValue((await cookies()).get('accessToken')?.value);
        userId = normalizeValue(payload?.userId ?? searchParams.get('userId')) ?? userIdFromCookie;
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        bodyOfResume = payload?.bodyOfResume ?? payload;
        if (!bodyOfResume) {
            return NextResponse.json({ message: 'bodyOfResume is required' }, { status: 400 });
        }

        const response = await apiClientServer.put(`Apps/EditCV?userId=${userId}&requestId=${requestId}`, {
            bodyOfResume,
        });

        if (response.status === 200) {
            const refreshedCv = await apiClientServer.get(`Apps/GetCV?userId=${userId}&requestId=${requestId}`);
            return NextResponse.json(refreshedCv.data);
        }

        return NextResponse.json(response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        const raw = axiosError?.response?.data as any;
        const message =
            typeof raw === 'string'
                ? raw
                : typeof raw?.message === 'string'
                  ? raw.message
                  : typeof raw?.error === 'string'
                    ? raw.error
                    : '';

        if (message.toLowerCase().includes('no cvs found matching the criteria')) {
            try {
                await apiClientServer.post('Apps/AddCV', {
                    userId: userId ?? undefined,
                    requestId: requestId ?? undefined,
                    bodyOfResume: bodyOfResume ?? undefined,
                });

                if (userId && requestId) {
                    const refreshedCv = await apiClientServer.get(`Apps/GetCV?userId=${userId}&requestId=${requestId}`);
                    return NextResponse.json(refreshedCv.data);
                }

                return NextResponse.json(
                    { message: 'CV created but missing userId/requestId for refresh' },
                    { status: 200 },
                );
            } catch (fallbackError) {
                return CacheError(fallbackError as AxiosError);
            }
        }

        return CacheError(axiosError);
    }
}
