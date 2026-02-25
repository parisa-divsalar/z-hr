import { NextRequest, NextResponse } from 'next/server';

import { getOpenAIClient } from '@/services/chatgpt/client';

const MYMEMORY_MAX_CHARS = 450;
const MAX_TOTAL_CHARS = 8000;

/** Decode numeric HTML entities (e.g. &#10; -> newline) so they display correctly. */
function decodeHtmlNumericEntities(text: string): string {
    return String(text ?? '').replace(/&#(\d+);/g, (_, code) => {
        const n = parseInt(code, 10);
        return n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : `&#${code};`;
    });
}

/**
 * Translates a chunk using OpenAI (fallback when MyMemory fails). Preserves newlines.
 */
async function translateChunkWithOpenAI(chunk: string): Promise<string> {
    const trimmed = String(chunk ?? '').trim();
    if (!trimmed) return trimmed;

    try {
        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a professional translator. Translate the following text from English to Persian (Farsi). Preserve line breaks (\\n) and paragraph structure. Return only the translation, no explanation.',
                },
                { role: 'user', content: trimmed },
            ],
            temperature: 0.2,
            max_tokens: 4096,
        });
        const content = response.choices[0]?.message?.content?.trim();
        if (content) return decodeHtmlNumericEntities(content);
    } catch (e) {
        console.warn('OpenAI translate fallback error', e);
    }
    return trimmed;
}

/**
 * Translates a single chunk from English to Farsi using MyMemory free API.
 * Returns empty string if translation failed (caller can use OpenAI fallback).
 */
async function translateChunkEnToFaMyMemory(chunk: string): Promise<string> {
    const trimmed = String(chunk ?? '').trim();
    if (!trimmed) return trimmed;

    const toTranslate = trimmed.length > MYMEMORY_MAX_CHARS ? trimmed.slice(0, MYMEMORY_MAX_CHARS) : trimmed;
    const params = new URLSearchParams({
        q: toTranslate,
        langpair: 'en|fa',
    });
    const url = `https://api.mymemory.translated.net/get?${params.toString()}`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return '';

    const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
    const translated = data.responseData?.translatedText;
    if (typeof translated === 'string' && translated.trim()) {
        const result = decodeHtmlNumericEntities(translated.trim());
        return trimmed.length > MYMEMORY_MAX_CHARS ? `${result}…` : result;
    }
    return '';
}

/** Try MyMemory first; if it fails or returns empty, use OpenAI. */
async function translateChunkEnToFa(chunk: string): Promise<string> {
    const trimmed = String(chunk ?? '').trim();
    if (!trimmed) return trimmed;

    const fromMyMemory = await translateChunkEnToFaMyMemory(chunk);
    if (fromMyMemory && fromMyMemory !== trimmed) return fromMyMemory;

    return translateChunkWithOpenAI(chunk);
}

/**
 * Splits long text into chunks of at most MYMEMORY_MAX_CHARS, preferring paragraph/sentence boundaries.
 */
function chunkText(text: string, maxChunk = MYMEMORY_MAX_CHARS): string[] {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return [];
    if (trimmed.length <= maxChunk) return [trimmed];

    const chunks: string[] = [];
    let remaining = trimmed.slice(0, MAX_TOTAL_CHARS);
    if (trimmed.length > MAX_TOTAL_CHARS) remaining += '…';

    while (remaining.length > 0) {
        const slice = remaining.slice(0, maxChunk);
        if (slice.length < maxChunk) {
            chunks.push(slice);
            break;
        }
        const lastBreak = Math.max(
            slice.lastIndexOf('\n\n'),
            slice.lastIndexOf('\n'),
            slice.lastIndexOf('. '),
            slice.lastIndexOf(' ')
        );
        if (lastBreak > maxChunk * 0.4) {
            chunks.push(slice.slice(0, lastBreak + 1));
            remaining = remaining.slice(lastBreak + 1);
        } else {
            chunks.push(slice);
            remaining = remaining.slice(slice.length);
        }
    }
    return chunks;
}

/**
 * Translates text from English to Farsi. For long text, chunks and translates in sequence.
 */
async function translateEnToFa(text: string): Promise<string> {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return trimmed;

    const chunks = chunkText(trimmed);
    if (chunks.length === 1) return translateChunkEnToFa(chunks[0]);

    const results: string[] = [];
    for (const chunk of chunks) {
        const translated = await translateChunkEnToFa(chunk);
        results.push(translated);
    }
    return results.join('\n\n');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const text = typeof body?.text === 'string' ? body.text : '';
        if (!text.trim()) {
            return NextResponse.json({ translated: '' });
        }
        const translated = await translateEnToFa(text);
        return NextResponse.json({ translated });
    } catch (e) {
        console.warn('Translate API error', e);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
