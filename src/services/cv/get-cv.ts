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

    const { data } = await apiClientClient.get('cv/get-cv', {
        params: queryParams,
    });

    const unwrapped = unwrapApiData(data);

    if (Array.isArray(unwrapped)) {
        return unwrapped.map((record: RawCVRecord) => normalizeCvRecord(record));
    }

    return normalizeCvRecord(unwrapped as RawCVRecord);
}







































