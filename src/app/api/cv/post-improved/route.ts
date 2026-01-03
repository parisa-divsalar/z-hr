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

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        const { searchParams } = new URL(request.url);
        normalizeValue(payload?.requestId ?? searchParams.get('requestId'));

        const userIdFromCookie = normalizeValue((await cookies()).get('accessToken')?.value);
        const userId = normalizeValue(payload?.userId ?? searchParams.get('userId')) ?? userIdFromCookie;
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const lang = normalizeValue(payload?.lang ?? searchParams.get('lang')) ?? 'en';

        const cvSection = normalizeValue(payload?.cvSection ?? searchParams.get('cvSection'));
        if (!cvSection) {
            return NextResponse.json({ message: 'cvSection is required' }, { status: 400 });
        }

        const paragraph = normalizeValue(payload?.paragraph ?? payload?.bodyOfResume);
        if (!paragraph) {
            return NextResponse.json({ message: 'paragraph is required' }, { status: 400 });
        }

        const requestBody = new FormData();
        requestBody.append('cvSection', cvSection);
        requestBody.append('paragraph', paragraph);

        const response = await apiClientServer.post(
            `Apps/improve-cv-part-cv-section?userId=${encodeURIComponent(userId)}&lang=${encodeURIComponent(lang)}`,
            requestBody,
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
