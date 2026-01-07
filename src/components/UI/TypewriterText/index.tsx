'use client';

import { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from 'framer-motion';

type Props = {
    text: string;
    /** When true, starts typing. */
    active?: boolean;
    /** Type only once per `text` value. */
    once?: boolean;
    /** Delay before typing starts. */
    initialDelayMs?: number;
    /** Delay for non-whitespace tokens (words/punctuation). */
    tokenDelayMs?: number;
    /** Delay for whitespace tokens. */
    spaceDelayMs?: number;
    /** Optional cursor while typing. */
    showCursor?: boolean;
    cursorChar?: string;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function TypewriterText({
    text,
    active = true,
    once = true,
    initialDelayMs = 0,
    tokenDelayMs = 28,
    spaceDelayMs = 10,
    showCursor = false,
    cursorChar = '▍',
}: Props) {
    const shouldReduceMotion = useReducedMotion();
    const [display, setDisplay] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const startedForTextRef = useRef<string | null>(null);

    useEffect(() => {
        if (!active) {
            if (!once) startedForTextRef.current = null;
            setIsTyping(false);
            return;
        }

        const normalized = String(text ?? '');
        if (shouldReduceMotion) {
            setDisplay(normalized);
            setIsTyping(false);
            startedForTextRef.current = normalized;
            return;
        }

        if (once && startedForTextRef.current === normalized) return;
        startedForTextRef.current = normalized;

        let cancelled = false;
        const run = async () => {
            setIsTyping(true);
            setDisplay('');
            if (initialDelayMs > 0) await sleep(initialDelayMs);

            const tokens = normalized.split(/(\s+)/); // keep whitespace tokens
            let acc = '';
            for (const token of tokens) {
                if (cancelled) return;
                acc += token;
                setDisplay(acc);
                await sleep(/\s+/.test(token) ? spaceDelayMs : tokenDelayMs);
            }

            if (!cancelled) setIsTyping(false);
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [active, text, once, initialDelayMs, tokenDelayMs, spaceDelayMs, shouldReduceMotion]);

    return (
        <span aria-label={String(text ?? '')}>
            {display}
            {showCursor && isTyping ? cursorChar : null}
        </span>
    );
}


