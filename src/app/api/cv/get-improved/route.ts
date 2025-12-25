import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = normalizeValue(searchParams.get('RequestId') ?? searchParams.get('requestId'));

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const response = await apiClientServer.get(
            `Apps/get-improved-cv-part?RequestId=${encodeURIComponent(requestId)}`,
        );

        return NextResponse.json(response.data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
