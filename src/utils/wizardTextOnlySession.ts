import type { WizardData } from '@/store/wizard';

const STORAGE_KEY = 'wizardTextOnlyPayload:v1';

export const saveWizardTextOnlySession = (data: WizardData) => {
    try {
        if (typeof window === 'undefined') return;
        // Text-only flow must not contain File/Blob references. We still store as-is,
        // but the caller should only use this when no files/voices exist.
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // ignore storage errors (quota, privacy mode, etc.)
    }
};

export const loadWizardTextOnlySession = (): WizardData | null => {
    try {
        if (typeof window === 'undefined') return null;
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed as WizardData;
    } catch {
        return null;
    }
};

export const clearWizardTextOnlySession = () => {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
};


