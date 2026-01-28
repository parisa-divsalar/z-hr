import { apiClientClient } from '@/services/api-client';

export type GetCVParams = {
    userId?: string | null;
    requestId?: string | null;
};

type RawCVRecord = Record<string, unknown>;

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

const normalizeCvRecord = (record: RawCVRecord) => ({
    ...record,
    bodyOfResume: tryParseBodyOfResume(record.bodyOfResume),
});

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

    if (Array.isArray(data)) {
        return data.map((record: RawCVRecord) => normalizeCvRecord(record));
    }

    return normalizeCvRecord(data as RawCVRecord);
}


























