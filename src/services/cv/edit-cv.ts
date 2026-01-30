import { apiClientClient } from '@/services/api-client';

export type EditCVParams = {
    userId?: string | null;
    requestId: string;
    bodyOfResume: unknown;
    section?: string;
    sectionText?: unknown;
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
 * Update CV via the Next.js API route (proxy to Apps/EditCV).
 * The API route will refresh and return the latest CV after a successful update.
 */
export async function editCV(params: EditCVParams) {
    const { data } = await apiClientClient.put('cv/edit-cv', {
        userId: params.userId ?? undefined,
        requestId: params.requestId,
        bodyOfResume: params.bodyOfResume,
        section: params.section ?? undefined,
        sectionText: params.sectionText ?? undefined,
    });

    if (Array.isArray(data)) {
        return data.map((record: RawCVRecord) => normalizeCvRecord(record));
    }

    return normalizeCvRecord(data as RawCVRecord);
}
