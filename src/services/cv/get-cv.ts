import { apiClientClient } from '@/services/api-client';

export type GetCVParams = {
    userId?: string | null;
    requestId?: string | null;
};

type RawCVRecord = Record<string, unknown>;

const unwrapApiData = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return payload;
    const anyPayload = payload as any;
    // Our Next.js route handlers usually return `{ data: ... }`.
    return anyPayload.data ?? payload;
};

const tryParseBodyOfResume = (value: unknown) => {
    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        console.warn('Failed to parse bodyOfResume payload', error);
        return value;
    }
};

const extractResumeBody = (record: RawCVRecord) => {
    const anyRecord = record as any;
    return (
        anyRecord.bodyOfResume ??
        anyRecord.BodyOfResume ??
        anyRecord.content ??
        anyRecord.Content ??
        anyRecord.cv ??
        anyRecord.resume ??
        anyRecord.data?.content
    );
};

const normalizeCvRecord = (record: RawCVRecord) => {
    const bodyOfResume = extractResumeBody(record);
    return {
        ...record,
        // Backward compatibility: most of the editor pipeline expects `bodyOfResume`.
        bodyOfResume: tryParseBodyOfResume(bodyOfResume),
    };
};

/**
 * Fetch CV records from the backend via the Next.js API route.
 * Allows querying by `userId`, `requestId` or both, but the call will
 * succeed even when no filters are provided.
 */
export async function getCV(params: GetCVParams = {}) {
    const queryParams: Record<string, string> = {};

    if (params.userId) {
        queryParams.userId = params.userId;
    }

    if (params.requestId) {
        queryParams.requestId = params.requestId;
    }

    /**
     * Admin tooling: when `userId` is explicitly provided we want to fetch CVs
     * for that user even if the browser currently has an auth cookie for a
     * different user. Using `credentials: 'omit'` prevents cookie auth from
     * taking precedence on the server routes.
     */
    const unwrapped = await (async () => {
        if (params.userId) {
            const qs = new URLSearchParams(queryParams);
            const res = await fetch(`/api/cv/get-cv?${qs.toString()}`, {
                method: 'GET',
                cache: 'no-store',
                credentials: 'omit',
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error((json as any)?.error || `HTTP ${res.status}`);
            }
            return unwrapApiData(json);
        }

        const { data } = await apiClientClient.get('cv/get-cv', {
            params: queryParams,
        });
        return unwrapApiData(data);
    })();

    if (Array.isArray(unwrapped)) {
        return unwrapped.map((record: RawCVRecord) => normalizeCvRecord(record));
    }

    return normalizeCvRecord(unwrapped as RawCVRecord);
}







































