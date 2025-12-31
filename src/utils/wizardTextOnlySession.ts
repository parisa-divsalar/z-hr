import type { WizardData } from '@/store/wizard';

const STORAGE_KEY = 'wizardTextOnlyPayload:v1';

export const saveWizardTextOnlySession = (data: WizardData) => {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...(data as any), __updatedAt: Date.now() }));
    } catch {}
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
