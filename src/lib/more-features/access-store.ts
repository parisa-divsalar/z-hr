import fs from 'fs';
import path from 'path';

export type MoreFeaturesAccess = {
  unlockedKeys: string[];
  enabledKeys: string[];
};

type AccessRow = {
  user_id: number;
  unlocked_keys: string[];
  enabled_keys: string[];
  created_at: string;
  updated_at: string;
};

function safeStr(v: unknown): string {
  return String(v ?? '').trim();
}

export function featureKeyFromName(name: unknown): string {
  // Keep consistent with client `featureKeyFromTitle` (lowercase + underscores)
  const t = safeStr(name).toLowerCase();
  return t ? t.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') : '';
}

function resolveRepoRootDir(): string {
  const cwd = process.cwd();
  const candidates = [cwd, path.resolve(cwd, '..'), path.resolve(cwd, '../..'), path.resolve(cwd, '../../..')];
  for (const dir of candidates) {
    try {
      if (fs.existsSync(path.join(dir, 'data-seed'))) return dir;
      if (fs.existsSync(path.join(dir, 'data'))) return dir;
    } catch {
      // ignore
    }
  }
  return cwd;
}

function getDataDir(): string {
  const repoRoot = resolveRepoRootDir();
  const defaultDataDir = path.resolve(repoRoot, 'data');
  const envDbPath = safeStr(process.env.DATABASE_PATH);
  return envDbPath ? path.dirname(envDbPath) : defaultDataDir;
}

function getAccessFilePath(): string {
  return path.join(getDataDir(), 'user_more_feature_access.json');
}

function readRows(): AccessRow[] {
  const file = getAccessFilePath();
  try {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]', 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AccessRow[]) : [];
  } catch {
    return [];
  }
}

function writeRows(rows: AccessRow[]): void {
  const file = getAccessFilePath();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(rows, null, 2), 'utf-8');
}

function uniqKeys(keys: unknown): string[] {
  const arr = Array.isArray(keys) ? keys : [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const k of arr) {
    const key = featureKeyFromName(k);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function getMoreFeaturesAccessByUserId(userId: number): MoreFeaturesAccess {
  const uid = Number(userId);
  if (!Number.isFinite(uid) || uid <= 0) return { unlockedKeys: [], enabledKeys: [] };
  const rows = readRows();
  const row = rows.find((r) => Number(r?.user_id) === uid) ?? null;
  return {
    unlockedKeys: uniqKeys(row?.unlocked_keys),
    enabledKeys: uniqKeys(row?.enabled_keys),
  };
}

export function isMoreFeatureUnlocked(userId: number, featureNameOrKey: unknown): boolean {
  const key = featureKeyFromName(featureNameOrKey);
  if (!key) return false;
  const access = getMoreFeaturesAccessByUserId(userId);
  return access.unlockedKeys.includes(key);
}

export function unlockAndEnableMoreFeature(userId: number, featureNameOrKey: unknown): MoreFeaturesAccess {
  const uid = Number(userId);
  const key = featureKeyFromName(featureNameOrKey);
  if (!Number.isFinite(uid) || uid <= 0 || !key) return getMoreFeaturesAccessByUserId(uid);

  const rows = readRows();
  const now = new Date().toISOString();
  const idx = rows.findIndex((r) => Number(r?.user_id) === uid);
  const prev = idx >= 0 ? rows[idx] : null;
  const unlocked = uniqKeys([...(prev?.unlocked_keys ?? []), key]);
  const enabled = uniqKeys([...(prev?.enabled_keys ?? []), key]);
  const next: AccessRow = {
    user_id: uid,
    unlocked_keys: unlocked,
    enabled_keys: enabled,
    created_at: prev?.created_at ?? now,
    updated_at: now,
  };
  if (idx >= 0) rows[idx] = next;
  else rows.push(next);
  writeRows(rows);
  return { unlockedKeys: unlocked, enabledKeys: enabled };
}

export function disableMoreFeature(userId: number, featureNameOrKey: unknown): MoreFeaturesAccess {
  const uid = Number(userId);
  const key = featureKeyFromName(featureNameOrKey);
  if (!Number.isFinite(uid) || uid <= 0 || !key) return getMoreFeaturesAccessByUserId(uid);

  const rows = readRows();
  const idx = rows.findIndex((r) => Number(r?.user_id) === uid);
  if (idx === -1) return { unlockedKeys: [], enabledKeys: [] };

  const prev = rows[idx];
  const now = new Date().toISOString();
  const enabled = uniqKeys((prev?.enabled_keys ?? []).filter((k) => featureKeyFromName(k) !== key));
  const unlocked = uniqKeys(prev?.unlocked_keys ?? []);
  rows[idx] = {
    ...prev,
    unlocked_keys: unlocked,
    enabled_keys: enabled,
    updated_at: now,
  };
  writeRows(rows);
  return { unlockedKeys: unlocked, enabledKeys: enabled };
}

