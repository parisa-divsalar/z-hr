import { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const requestId = normalizeValue(searchParams.get('requestId') ?? searchParams.get('RequestId'));

        if (!requestId) {
            return NextResponse.json({ message: 'requestId is required' }, { status: 400 });
        }

        const response = await apiClientServer.get(`Request/cv-analysis-detailed/${encodeURIComponent(requestId)}`);

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
