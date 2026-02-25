'use client';

import type { ReactNode } from 'react';

import { useTranslatedSummary } from '../hooks/useTranslatedSummary';
import type { Locale } from '@/store/common/type';

type Props = {
    text: string;
    locale: Locale;
    children?: (displayText: string) => ReactNode;
};

/**
 * Renders text; when locale is 'fa', fetches and shows Persian translation via API.
 * Use this for dynamic resume content (certificates, experience, additionalInfo) so that
 * when user selects Persian in the header, all content is shown in Persian.
 */
export default function TranslatedText({ text, locale, children }: Props) {
    const { displayText } = useTranslatedSummary(text, locale);
    if (children) return <>{children(displayText)}</>;
    return <>{displayText}</>;
}
