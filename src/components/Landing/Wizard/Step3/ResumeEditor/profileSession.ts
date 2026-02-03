const WIZARD_PROFILE_SESSION_KEY = 'wizardProfile:v1';

export type WizardProfileSession = {
    fullName?: string;
    dateOfBirth?: string;
    visaStatus?: string;
    mainSkill?: string;
    updatedAt?: number;
};

export const saveWizardProfileSession = (data: WizardProfileSession) => {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(WIZARD_PROFILE_SESSION_KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
    } catch {
        // ignore
    }
};

export const loadWizardProfileSession = (): WizardProfileSession | null => {
    try {
        if (typeof window === 'undefined') return null;
        const raw = sessionStorage.getItem(WIZARD_PROFILE_SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as WizardProfileSession;
    } catch {
        return null;
    }
};

export const buildHeadline = (mainSkill?: string, visaStatus?: string) => {
    const headlineParts = [
        mainSkill ? `Wizard Status: ${String(mainSkill).trim()}` : '',
        visaStatus ? `Visa: ${String(visaStatus).trim()}` : '',
    ].filter(Boolean);
    return headlineParts.join(' • ');
};

export const normalizeVisaStatusValue = (value?: unknown): string => {
    const raw = String(value ?? '')
        .replace(/\r/g, '')
        .trim();
    if (!raw) return '';

    const lines = raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

    for (const line of lines) {
        const m = line.match(/^(?:visa\s*status|visa)\s*:\s*(.*)$/i);
        if (m) return String(m[1] ?? '').trim();
    }

    return String(lines[0] ?? raw).trim();
};

export const extractFromHeadline = (headline?: string) => {
    const text = String(headline ?? '').trim();
    if (!text) return { mainSkill: '', visaStatus: '' };

    const mainSkillMatch = text.match(/Wizard Status:\s*([^•]+?)(?:\s*•|$)/i);
    const visaMatch = text.match(/Visa:\s*([^•]+?)(?:\s*•|$)/i);

    return {
        mainSkill: String(mainSkillMatch?.[1] ?? '').trim(),
        visaStatus: String(visaMatch?.[1] ?? '').trim(),
    };
};

























