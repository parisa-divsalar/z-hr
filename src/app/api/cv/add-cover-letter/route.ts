import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { apiClientServer } from '@/services/api-client';
import CacheError from '@/services/cache-error';

type CreateCoverLetterBody = {
    jobDescription: string;
    cvContent: string;
    companyName: string;
    positionTitle: string;
};

const normalizeValue = (value?: string | null) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
    return trimmed;
};

const parseUserIdFromToken = (tokenValue: string | undefined): string | null => {
    if (!tokenValue) return null;
    try {
        const parsed = JSON.parse(tokenValue);
        if (parsed) return String(parsed);
        return null;
    } catch {
        return tokenValue;
    }
};

const parseUserId = async (req: NextRequest) => {
    const fromQuery = normalizeValue(req.nextUrl.searchParams.get('userId'));
    if (fromQuery) return fromQuery;

    const tokenValue = (await cookies()).get('accessToken')?.value;
    const fromCookie = normalizeValue(parseUserIdFromToken(tokenValue));
    return fromCookie;
};

const parseLang = (req: NextRequest) => normalizeValue(req.nextUrl.searchParams.get('lang')) ?? 'en';

const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const readRequiredString = (payload: Record<string, unknown>, key: keyof CreateCoverLetterBody) => {
    const value = payload[key];
    return typeof value === 'string' ? normalizeValue(value) : null;
};

export async function POST(req: NextRequest) {
    try {
        const userId = await parseUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const lang = parseLang(req);

        const rawPayload = await req.json().catch(() => null);
        if (!isRecord(rawPayload)) {
            return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
        }

        const jobDescription = readRequiredString(rawPayload, 'jobDescription');
        const cvContent = readRequiredString(rawPayload, 'cvContent');
        const companyName = readRequiredString(rawPayload, 'companyName');
        const positionTitle = readRequiredString(rawPayload, 'positionTitle');

        const missing = [
            !jobDescription && 'jobDescription',
            !cvContent && 'cvContent',
            !companyName && 'companyName',
            !positionTitle && 'positionTitle',
        ].filter(Boolean) as string[];

        if (missing.length) {
            return NextResponse.json({ message: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
        }

        const requestBody: CreateCoverLetterBody = {
            jobDescription: jobDescription!,
            cvContent: cvContent!,
            companyName: companyName!,
            positionTitle: positionTitle!,
        };

        const formData = new FormData();
        formData.append('jobDescription', requestBody.jobDescription);
        formData.append('cvContent', requestBody.cvContent);
        formData.append('companyName', requestBody.companyName);
        formData.append('positionTitle', requestBody.positionTitle);

        const response = await apiClientServer.post(
            `Apps/create-cover-letter?userId=${encodeURIComponent(userId)}&lang=${encodeURIComponent(lang)}`,
            formData,
            {
                headers: {
                    Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
                },
            },
        );

        return NextResponse.json(response.data);
    } catch (error) {
        return CacheError(error as AxiosError);
    }
}

export async function GET(req: NextRequest) {
    const userId = normalizeValue(req.nextUrl.searchParams.get('userId'));
    const lang = parseLang(req);

    return NextResponse.json(
        {
            message: 'Method Not Allowed. Use POST with a JSON body.',
            example: {
                url: `/api/cv/add-cover-letter?userId=${userId ?? '<userId>'}&lang=${lang}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: {
                    companyName: 'Example Company',
                    positionTitle: 'Example Position',
                    cvContent: 'Paste CV content here...',
                    jobDescription: 'Paste job description here...',
                },
            },
        },
        { status: 405 },
    );
}
