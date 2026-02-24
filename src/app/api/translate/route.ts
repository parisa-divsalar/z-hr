import { NextRequest, NextResponse } from 'next/server';

const MYMEMORY_MAX_CHARS = 450;

/**
 * Translates text from English to Farsi using MyMemory free API.
 * Used when locale is 'fa' to show resume summary (and similar content) in Farsi.
 */
async function translateEnToFa(text: string): Promise<string> {
    const trimmed = String(text ?? '').trim();
    if (!trimmed) return trimmed;

    const toTranslate = trimmed.length > MYMEMORY_MAX_CHARS ? trimmed.slice(0, MYMEMORY_MAX_CHARS) : trimmed;
    const params = new URLSearchParams({
        q: toTranslate,
        langpair: 'en|fa',
    });
    const url = `https://api.mymemory.translated.net/get?${params.toString()}`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return trimmed;

    const data = (await res.json()) as { responseData?: { translatedText?: string }; responseStatus?: number };
    const translated = data.responseData?.translatedText;
    if (typeof translated === 'string' && translated.trim()) {
        const result = translated.trim();
        return trimmed.length > MYMEMORY_MAX_CHARS ? `${result}…` : result;
    }
    return trimmed;
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
