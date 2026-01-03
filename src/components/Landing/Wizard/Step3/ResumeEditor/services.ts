import { apiClientClient } from '@/services/api-client';

const POLL_INTERVAL = 3000;

const normalizeValue = (value: unknown): string | null => {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    if (!str) return null;
    if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
    return str;
};

export const extractPollingRequestId = (response: any): string | null => {
    const tryParseJsonString = (value: unknown): any | null => {
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        try {
            return JSON.parse(trimmed);
        } catch {
            return null;
        }
    };

    const direct =
        response?.RequestId ??
        response?.requestId ??
        response?.requestID ??
        response?.result?.RequestId ??
        response?.result?.requestId ??
        response?.data?.RequestId ??
        response?.data?.requestId;

    const normalizedDirect = normalizeValue(direct);
    if (normalizedDirect) return normalizedDirect;

    const resultContainer = response?.result ?? response?.data?.result ?? null;
    const resultValueDirect = resultContainer?.value ?? resultContainer?.Value ?? null;
    const normalizedResultValue = normalizeValue(resultValueDirect);
    if (normalizedResultValue) return normalizedResultValue;

    const parsedResult = tryParseJsonString(resultContainer);
    if (parsedResult && typeof parsedResult === 'object') {
        const parsedValue =
            (parsedResult as any).value ??
            (parsedResult as any).Value ??
            (parsedResult as any).RequestId ??
            (parsedResult as any).requestId ??
            (parsedResult as any).requestID ??
            null;
        const normalizedParsedValue = normalizeValue(parsedValue);
        if (normalizedParsedValue) return normalizedParsedValue;
    }

    const parameters: any[] =
        (Array.isArray(response?.parameters) ? response.parameters : null) ??
        (Array.isArray(response?.result?.parameters) ? response.result.parameters : null) ??
        (Array.isArray(response?.data?.parameters) ? response.data.parameters : null) ??
        [];

    for (const entry of parameters) {
        if (!entry || typeof entry !== 'object') continue;
        const name = String((entry as any).name ?? (entry as any).key ?? '')
            .trim()
            .toLowerCase();
        if (!name) continue;
        if (name === 'requestid' || name === 'request_id' || name === 'request-id') {
            const value = (entry as any).value ?? (entry as any).Value ?? (entry as any).val;
            const normalized = normalizeValue(value);
            if (normalized) return normalized;
        }
    }

    return null;
};

export const extractImprovedText = (response: any): string | null => {
    if (typeof response === 'string') return response.trim() || null;
    const processed =
        response?.processedContent ??
        response?.ProcessedContent ??
        response?.result?.processedContent ??
        response?.result?.ProcessedContent ??
        response?.data?.processedContent ??
        response?.data?.ProcessedContent;
    if (typeof processed === 'string') {
        const trimmed = processed.trim();
        if (trimmed) return trimmed;
    }
    const candidates = [
        response?.bodyOfResume,
        response?.BodyOfResume,
        response?.improvedText,
        response?.text,
        response?.result,
        response?.result?.bodyOfResume,
        response?.result?.BodyOfResume,
        response?.result?.improvedText,
        response?.result?.text,
        response?.data,
        response?.data?.bodyOfResume,
        response?.data?.BodyOfResume,
        response?.data?.text,
    ];
    for (const candidate of candidates) {
        if (typeof candidate === 'string') {
            const trimmed = candidate.trim();
            if (trimmed) return trimmed;
        }
    }
    return null;
};

export const pollCvAnalysisAndCreateCv = async (
    requestId: string,
    bodyOfResume: any,
    userId?: string | null,
    onProgress?: (subRequests: any[]) => void,
): Promise<void> => {
    const poll = async (): Promise<void> => {
        const res = await apiClientClient.get(`cv/cv-analysis-detailed?requestId=${requestId}`);

        const status = res.data.main_request_status;
        const subRequests = Array.isArray(res.data?.sub_requests) ? res.data.sub_requests : [];

        onProgress?.(subRequests);

        if (status === 2) {
            await apiClientClient.post('cv/add-cv', {
                userId: userId ?? undefined,
                requestId,
                bodyOfResume,
            });

            await apiClientClient.get(`cv/get-cv?requestId=${requestId}`);
            return;
        }

        setTimeout(poll, POLL_INTERVAL);
    };

    await poll();
};
