import { apiClientClient } from '@/services/api-client';

export type EditCVParams = {
    userId?: string | null;
    requestId: string;
    bodyOfResume: unknown;
    section?: string;
    sectionText?: unknown;
};

type RawCVRecord = Record<string, unknown>;

const unwrapApiData = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return payload;
    const anyPayload = payload as any;
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
        bodyOfResume: tryParseBodyOfResume(bodyOfResume),
    };
};

/**
 * Update CV via the Next.js API route (proxy to Apps/EditCV).
 * The API route will refresh and return the latest CV after a successful update.
 */
export async function editCV(params: EditCVParams) {
    /**
     * Admin tooling: when `userId` is explicitly provided we want to edit CVs
     * for that user even if the browser currently has an auth cookie for a
     * different user. Using `credentials: 'omit'` prevents cookie auth from
     * taking precedence on the server routes.
     */
    const unwrapped = await (async () => {
        const payload = {
            userId: params.userId ?? undefined,
            requestId: params.requestId,
            bodyOfResume: params.bodyOfResume,
            section: params.section ?? undefined,
            sectionText: params.sectionText ?? undefined,
        };

        if (params.userId) {
            const res = await fetch('/api/cv/edit-cv', {
                method: 'PUT',
                cache: 'no-store',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error((json as any)?.error || `HTTP ${res.status}`);
            }
            return unwrapApiData(json);
        }

        const { data } = await apiClientClient.put('cv/edit-cv', payload);
        return unwrapApiData(data);
    })();

    if (Array.isArray(unwrapped)) {
        return unwrapped.map((record: RawCVRecord) => normalizeCvRecord(record));
    }

    return normalizeCvRecord(unwrapped as RawCVRecord);
}
