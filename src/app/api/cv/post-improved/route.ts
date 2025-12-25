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

const tryParseJson = (value: string): unknown => {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const extractRequestId = (data: unknown): string | null => {
    if (!data || typeof data !== 'object') return null;
    const anyData = data as any;
    return (
        normalizeValue(anyData?.RequestId) ??
        normalizeValue(anyData?.requestId) ??
        normalizeValue(anyData?.requestID) ??
        normalizeValue(anyData?.result?.RequestId) ??
        normalizeValue(anyData?.result?.requestId) ??
        normalizeValue(anyData?.data?.RequestId) ??
        normalizeValue(anyData?.data?.requestId)
    );
};

const extractImprovedText = (data: unknown): string | null => {
    if (typeof data === 'string') return data.trim() || null;
    if (!data || typeof data !== 'object') return null;

    const anyData = data as any;
    const directCandidates: unknown[] = [
        anyData?.improvedText,
        anyData?.text,
        anyData?.bodyOfResume,
        anyData?.BodyOfResume,
        anyData?.result?.improvedText,
        anyData?.result?.text,
        anyData?.result?.bodyOfResume,
        anyData?.result?.BodyOfResume,
        anyData?.result?.value,
        anyData?.value,
    ];

    for (const candidate of directCandidates) {
        if (typeof candidate === 'string') {
            const trimmed = candidate.trim();
            if (!trimmed) continue;

            // Some backends return JSON encoded strings (e.g. {"<requestId>":"<text>"}).
            const parsed = tryParseJson(trimmed);
            if (parsed && typeof parsed === 'object') {
                const values = Object.values(parsed as Record<string, unknown>).filter(
                    (v) => typeof v === 'string' && String(v).trim(),
                ) as string[];
                if (values.length === 1) return values[0].trim();
            }

            return trimmed;
        }
    }

    return null;
};

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        const { searchParams } = new URL(request.url);
        // NOTE: requestId is kept for backward compatibility (older clients might send it),
        // but the upstream endpoint in Swagger requires only `paragraph` in the request body.
        normalizeValue(payload?.requestId ?? searchParams.get('requestId'));

        const userIdFromCookie = normalizeValue((await cookies()).get('accessToken')?.value);
        const userId = normalizeValue(payload?.userId ?? searchParams.get('userId')) ?? userIdFromCookie;
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const lang = normalizeValue(payload?.lang ?? searchParams.get('lang')) ?? 'en';

        const paragraph = normalizeValue(payload?.paragraph ?? payload?.bodyOfResume);
        if (!paragraph) {
            return NextResponse.json({ message: 'paragraph is required' }, { status: 400 });
        }

        const requestBody = new FormData();
        requestBody.append('paragraph', paragraph);

        const response = await apiClientServer.post(
            `Apps/improve-cv-part?userId=${encodeURIComponent(userId)}&lang=${encodeURIComponent(lang)}`,
            requestBody,
        );

        const raw = response.data;
        const requestId = extractRequestId(raw);
        const improvedText = extractImprovedText(raw);

        return NextResponse.json({
            ...(raw && typeof raw === 'object' ? raw : { raw }),
            requestId: requestId ?? undefined,
            improvedText: improvedText ?? undefined,
        });
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}
