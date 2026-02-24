'use client';

import { useEffect, useRef, useState } from 'react';

type Locale = 'en' | 'fa';

const cache = new Map<string, string>();

export function useTranslatedSummary(text: string, locale: Locale): { displayText: string; isLoading: boolean } {
    const [translated, setTranslated] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const lastTextRef = useRef('');
    const trimmed = String(text ?? '').trim();

    useEffect(() => {
        if (locale !== 'fa' || !trimmed) {
            setTranslated(null);
            setIsLoading(false);
            lastTextRef.current = '';
            return;
        }

        const cached = cache.get(trimmed);
        if (cached !== undefined) {
            setTranslated(cached);
            setIsLoading(false);
            lastTextRef.current = trimmed;
            return;
        }

        if (lastTextRef.current === trimmed) return;
        lastTextRef.current = trimmed;
        setIsLoading(true);
        setTranslated(null);

        fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: trimmed }),
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Translate failed'))))
            .then((data: { translated?: string }) => {
                const result = typeof data?.translated === 'string' ? data.translated.trim() : trimmed;
                if (result) cache.set(trimmed, result);
                setTranslated(result || trimmed);
            })
            .catch(() => setTranslated(null))
            .finally(() => setIsLoading(false));
    }, [trimmed, locale]);

    if (locale !== 'fa' || !trimmed) {
        return { displayText: trimmed, isLoading: false };
    }
    if (isLoading || translated === null) {
        return { displayText: trimmed, isLoading };
    }
    return { displayText: translated || trimmed, isLoading: false };
}
