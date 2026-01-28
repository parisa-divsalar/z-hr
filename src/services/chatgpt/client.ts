import OpenAI from 'openai';

let cachedClient: OpenAI | null = null;

/**
 * Lazily create (and cache) the OpenAI client.
 * We intentionally do not throw at import-time so API routes can return a useful error.
 */
export function getOpenAIClient(): OpenAI {
    if (cachedClient) return cachedClient;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error(
            'OPENAI_API_KEY is not set in environment variables. Please check your .env.local file.'
        );
    }

    cachedClient = new OpenAI({ apiKey });
    return cachedClient;
}

