export type MoreFeaturesSelection = Record<string, boolean>;

const STORAGE_KEY = 'wizard:moreFeaturesSelection:v1';

const safeParse = (raw: string | null): Record<string, MoreFeaturesSelection> => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, MoreFeaturesSelection>;
  } catch {
    return {};
  }
};

const safeStringKey = (requestId: string | null | undefined) => String(requestId ?? '').trim();

export const readMoreFeaturesSelection = (requestId: string | null | undefined): MoreFeaturesSelection => {
  try {
    if (typeof window === 'undefined') return {};
    const key = safeStringKey(requestId);
    if (!key) return {};
    const db = safeParse(window.sessionStorage.getItem(STORAGE_KEY));
    const row = db[key];
    return row && typeof row === 'object' && !Array.isArray(row) ? row : {};
  } catch {
    return {};
  }
};

export const writeMoreFeaturesSelection = (
  requestId: string | null | undefined,
  patch: MoreFeaturesSelection,
): void => {
  try {
    if (typeof window === 'undefined') return;
    const key = safeStringKey(requestId);
    if (!key) return;
    const db = safeParse(window.sessionStorage.getItem(STORAGE_KEY));
    const prev = db[key] && typeof db[key] === 'object' && !Array.isArray(db[key]) ? db[key] : {};
    db[key] = { ...prev, ...patch };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore storage errors
  }
};

export const featureKeyFromTitle = (title: unknown): string => {
  const t = String(title ?? '').trim().toLowerCase();
  return t ? t.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') : '';
};


