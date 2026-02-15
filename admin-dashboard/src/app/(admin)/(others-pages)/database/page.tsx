'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const ZHR_API_URL = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';

type DbOverview = {
  summary: Record<string, number>;
  tables: Record<string, unknown[]>;
  source: string;
  generatedAt: string;
};

type UserRow = { id?: number; email?: string; name?: string; fake_user_id?: string; [k: string]: unknown };

function filterByUserId(arr: unknown[], userId: number, idKey = 'user_id'): unknown[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter((row: any) => row[idKey] === userId || row[idKey] === String(userId));
}

function toMMDDYYYY(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function sizeMBFromCvRow(row: any): string {
  const str = typeof row?.content === 'string' ? row.content : JSON.stringify(row?.content ?? '');
  const bytes = new TextEncoder().encode(str).length;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function tryParseJson(value: unknown): any | null {
  if (value == null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function extractFullNameFromWizardRow(wizardRow: any): string {
  const parsed = tryParseJson(wizardRow?.data);
  return String(parsed?.fullName ?? '').trim();
}

const TABLE_LABELS: Record<string, string> = {
  users: 'Users',
  cvs: 'Resumes',
  skills: 'Skills',
  user_skills: 'User Skills',
  interview_sessions: 'Interview Sessions',
  registration_logs: 'Registration Logs',
  login_logs: 'Login Logs (user data summary)',
  ai_interactions: 'ChatGPT Input/Output (per interaction)',
  cover_letters: 'Cover Letters',
  wizard_data: 'Wizard Data',
  resume_drafts: 'Resume Drafts',
  resume_section_outputs: 'Resume Section Outputs',
  job_positions: 'Job positions (all)',
  job_positions_active: 'Job positions (active)',
  job_positions_new: 'Job positions (newly added)',
  learning_hub_courses: 'Learning Hub courses',
  more_features: 'More Features',
  user_states: 'User States',
  user_state_history: 'User State History',
  user_state_logs: 'User State Logs',
  plans: 'Plans',
  resume_feature_pricing: 'Resume Feature Pricing',
  coin: 'Coin',
  coin_packages: 'Coin Packages',
  fiserv_transactions: 'Fiserv Transactions',
  history: 'History',
};

export default function DatabasePage() {
  const [data, setData] = useState<DbOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [learningHubSyncing, setLearningHubSyncing] = useState(false);
  const [learningHubSyncMessage, setLearningHubSyncMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [expandedCvRequestId, setExpandedCvRequestId] = useState<string | null>(null);

  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [rowMode, setRowMode] = useState<'add' | 'edit'>('add');
  const [rowJson, setRowJson] = useState('');
  const [rowSaving, setRowSaving] = useState(false);
  const [rowActionError, setRowActionError] = useState<string | null>(null);
  const [rowEditingWhere, setRowEditingWhere] = useState<Record<string, unknown> | null>(null);
  const [plansView, setPlansView] = useState<'matrix' | 'rows'>('matrix');
  const [userStateAudit, setUserStateAudit] = useState<any | null>(null);
  const [userStateAuditLogs, setUserStateAuditLogs] = useState<any[]>([]);
  const [userStateAuditLoading, setUserStateAuditLoading] = useState(false);
  const [userStateAuditError, setUserStateAuditError] = useState<string | null>(null);
  const [userStateBefore, setUserStateBefore] = useState<any | null>(null);

  const tableColumns = useMemo(() => {
    if (!activeTable || !data?.tables?.[activeTable]) return [] as string[];
    if (activeTable === 'user_states') return ['id', 'name', 'slug', 'order', 'description'];
    if (activeTable === 'resume_feature_pricing')
      return [
        'id',
        'feature_name',
        'cost_percentage',
        'cost_per_action_aed',
        'coin_per_action',
        'price_per_action_aed',
        'cost_per_coin_aed',
        'price_per_coin_aed',
        'target_margin_percent',
        'total_cost_per_user_aed',
        'target_ltv_aed',
        'created_at',
        'updated_at',
      ];
    const rows = data.tables[activeTable] as unknown[];
    if (!Array.isArray(rows) || rows.length === 0) return [] as string[];
    const cols: string[] = [];
    const addCols = (row: any) => {
      if (!row || typeof row !== 'object') return;
      for (const key of Object.keys(row)) {
        if (!cols.includes(key)) cols.push(key);
      }
    };
    addCols(rows[0]);
    for (let i = 1; i < rows.length; i += 1) addCols(rows[i]);
    return cols;
  }, [activeTable, data]);

  const fetchDb = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ZHR_API_URL}/api/admin/database`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setActiveTable((prev) => (prev ? prev : json.tables && Object.keys(json.tables).length > 0 ? Object.keys(json.tables)[0] : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error fetching data');
      setData(null);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDb();
  }, [fetchDb]);

  useEffect(() => {
    if (!data || activeTable !== 'user_states') return;
    const logs = (data.tables?.user_state_logs as any[]) ?? [];
    setUserStateAuditLogs(logs.slice().reverse());
  }, [activeTable, data]);

  const userId = selectedUser?.id != null ? Number(selectedUser.id) : null;
  const userDetailData = useMemo(() => {
    if (!data || userId == null) return null;
    const tables = data.tables as Record<string, unknown[]>;
    const cvs = filterByUserId(tables.cvs ?? [], userId) as any[];
    const cvRequestIds = new Set(
      (cvs ?? [])
        .map((cv: any) => String(cv?.request_id ?? cv?.requestId ?? '').trim())
        .filter((rid: string) => Boolean(rid))
    );
    const coverLettersAll = (tables.cover_letters ?? []) as any[];
    // Prefer user_id filter when available; fallback to matching by resume request_id.
    const coverLetters = coverLettersAll.filter((row: any) => {
      const rowUserId = row?.user_id ?? row?.userId ?? null;
      if (rowUserId != null && (rowUserId === userId || rowUserId === String(userId))) return true;
      const rid = String(row?.cv_request_id ?? row?.request_id ?? row?.requestId ?? '').trim();
      return rid ? cvRequestIds.has(rid) : false;
    });
    const history = filterByUserId(tables.history ?? [], userId) as any[];
    const historyById = new Map<string, any>(history.map((h: any) => [String(h?.id ?? ''), h]));
    const wizardData = filterByUserId(tables.wizard_data ?? [], userId, 'user_id') as any[];
    const wizardByRequestId = new Map<string, any>(
      wizardData
        .map((w: any) => [String(w?.request_id ?? w?.requestId ?? ''), w] as const)
        .filter(([k]) => Boolean(k))
    );

    // Fallback: if history table is empty (or missing some items), derive from cvs so UI doesn't look broken.
    const derivedFromCvs = (cvs ?? [])
      .map((cv: any) => {
        const rid = String(cv?.request_id ?? cv?.requestId ?? '').trim();
        if (!rid) return null;
        const existing = historyById.get(rid);
        if (existing) return existing;
        const wizardRow = wizardByRequestId.get(rid);
        const fullName = extractFullNameFromWizardRow(wizardRow);
        return {
          id: rid,
          user_id: userId,
          name: fullName || String(cv?.title ?? "User's Resume"),
          date: toMMDDYYYY(String(cv?.created_at ?? new Date().toISOString())),
          Percentage: String(cv?.Percentage ?? '0%'),
          position: '',
          level: '',
          title: String(cv?.title ?? ''),
          Voice: '0',
          Photo: '0',
          Video: '0',
          size: sizeMBFromCvRow(cv),
          description: 'Resume',
          is_bookmarked: false,
        };
      })
      .filter(Boolean) as any[];

    return {
      login_logs: filterByUserId(tables.login_logs ?? [], userId),
      ai_interactions: filterByUserId(tables.ai_interactions ?? [], userId),
      cvs,
      cover_letters: coverLetters,
      wizard_data: wizardData,
      user_skills: filterByUserId(tables.user_skills ?? [], userId),
      interview_sessions: filterByUserId(tables.interview_sessions ?? [], userId),
      resume_drafts: filterByUserId(tables.resume_drafts ?? [], userId),
      fiserv_transactions: (() => {
        const all = (tables.fiserv_transactions ?? []) as any[];
        const byUid = filterByUserId(all, userId) as any[];
        const email = String(selectedUser?.email ?? '').trim().toLowerCase();
        const byEmail = email
          ? all.filter((r: any) => String(r?.customer_email ?? '').trim().toLowerCase() === email)
          : [];
        const merged = [...byUid, ...byEmail];
        // Deduplicate by order_id (preferred) then by id.
        const seen = new Set<string>();
        const out: any[] = [];
        for (const r of merged) {
          const k = String(r?.order_id ?? r?.orderId ?? r?.id ?? '').trim();
          if (!k || seen.has(k)) continue;
          seen.add(k);
          out.push(r);
        }
        // Newest first
        return out.sort((a: any, b: any) => {
          const ta = Date.parse(String(a?.updated_at ?? a?.created_at ?? '')) || 0;
          const tb = Date.parse(String(b?.updated_at ?? b?.created_at ?? '')) || 0;
          return tb - ta;
        });
      })(),
      history: [...history, ...derivedFromCvs],
      registration_logs: (tables.registration_logs ?? []).filter(
        (r: any) => r.email === selectedUser?.email || r.user_id === userId
      ),
    };
  }, [data, userId, selectedUser?.email]);

  const truncate = (value: unknown, maxLen = 140) => {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    if (!s) return '';
    return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
  };

  const safeJsonString = (value: unknown) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  const runSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch(`${ZHR_API_URL}/api/jobs/sync`, { cache: 'no-store' });
      const json = await res.json();
      setSyncMessage(json.message || (json.added != null ? `${json.added} new job(s) added.` : json.error || 'Done.'));
      await fetchDb(false);
    } catch (e) {
      setSyncMessage(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const runLearningHubSync = async () => {
    setLearningHubSyncing(true);
    setLearningHubSyncMessage(null);
    try {
      // Primary Learning Hub sync endpoint (Udemy via RapidAPI).
      // This is the one documented in admin-dashboard/env.example and docs.
      const res = await fetch(`${ZHR_API_URL}/api/learning-hub/sync`, { cache: 'no-store' });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // Ignore JSON parse errors; we'll fall back to HTTP status below.
      }

      if (!res.ok) {
        const msg =
          json?.message ||
          json?.error ||
          `HTTP ${res.status} while syncing Learning Hub courses`;
        setLearningHubSyncMessage(msg);
      } else {
        setLearningHubSyncMessage(
          json?.message ||
            (json?.added != null
              ? `${json.added} new course(s) added. Total: ${json.total ?? '—'}.`
              : 'Done.')
        );
      }
      // Refresh DB view either way (even on sync error) so counts/tables reflect reality.
      await fetchDb(false);
    } catch (e) {
      setLearningHubSyncMessage(e instanceof Error ? e.message : 'Learning Hub sync failed');
    } finally {
      setLearningHubSyncing(false);
    }
  };

  const getCrudTable = useCallback((table: string | null) => {
    if (!table) return null;
    if (table === 'job_positions_active' || table === 'job_positions_new') return 'job_positions';
    return table;
  }, []);

  const buildWhere = useCallback((table: string, row: any, idx: number) => {
    if (table === 'history') {
      const id = String(row?.id ?? '').trim();
      const user_id = Number(row?.user_id);
      if (id && Number.isFinite(user_id)) return { id, user_id };
      return { _index: idx };
    }
    if (row?.id != null && String(row.id).trim() !== '') return { id: row.id };
    if (row?.request_id != null && String(row.request_id).trim() !== '') return { request_id: row.request_id };
    if (row?.source_url != null && String(row.source_url).trim() !== '') return { source_url: row.source_url };
    if (row?.sourceUrl != null && String(row.sourceUrl).trim() !== '') return { sourceUrl: row.sourceUrl };
    if (row?.email != null && String(row.email).trim() !== '') return { email: row.email };
    return { _index: idx };
  }, []);

  const openAddRow = useCallback(() => {
    const t = getCrudTable(activeTable);
    if (!t) return;
    if (activeTable === 'plans' && plansView === 'matrix') return;
    // coin_packages might be a "static" helper view if backend isn't providing rows yet.
    if (activeTable === 'coin_packages' && !(data?.tables as any)?.coin_packages) return;
    setRowMode('add');
    setRowEditingWhere(null);
    setRowActionError(null);
    if (t === 'history') {
      setRowJson(
        JSON.stringify(
          {
            user_id: 0,
            name: '',
            date: '',
            Percentage: '',
            position: '',
            level: '',
            title: '',
            Voice: '',
            Photo: '',
            size: '',
            Video: '',
            description: '',
            is_bookmarked: false,
          },
          null,
          2
        )
      );
    } else if (t === 'resume_feature_pricing') {
      setRowJson(
        JSON.stringify(
          {
            feature_name: '',
            cost_percentage: 0,
            cost_per_action_aed: 0,
            coin_per_action: 0,
            price_per_action_aed: 0,
            cost_per_coin_aed: 5,
            price_per_coin_aed: 8,
            target_margin_percent: 40,
            total_cost_per_user_aed: 161,
            target_ltv_aed: 268,
          },
          null,
          2
        )
      );
    } else {
      setRowJson(JSON.stringify({}, null, 2));
    }
    setRowModalOpen(true);
  }, [activeTable, data?.tables, getCrudTable, plansView]);

  const openEditRow = useCallback(
    (table: string, row: any, idx: number) => {
      const t = getCrudTable(table);
      if (!t) return;
      if (table === 'user_states') {
        setUserStateBefore(row ?? null);
        setUserStateAudit(null);
        setUserStateAuditError(null);
      }
      setRowMode('edit');
      setRowActionError(null);
      setRowEditingWhere(buildWhere(t, row, idx));
      setRowJson(JSON.stringify(row, null, 2));
      setRowModalOpen(true);
    },
    [buildWhere, getCrudTable]
  );

  const saveRow = useCallback(async () => {
    const tableForCrud = getCrudTable(activeTable);
    if (!tableForCrud) return;
    if (activeTable === 'plans' && plansView === 'matrix') return;
    if (activeTable === 'coin_packages' && !(data?.tables as any)?.coin_packages) return;

    setRowSaving(true);
    setRowActionError(null);
    try {
      const parsed = JSON.parse(rowJson);
      if (rowMode === 'add') {
        const res = await fetch(`${ZHR_API_URL}/api/admin/table/${encodeURIComponent(tableForCrud)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ row: parsed }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      } else {
        const where = rowEditingWhere;
        if (!where) throw new Error('Missing row identifier (where)');
        const res = await fetch(`${ZHR_API_URL}/api/admin/table/${encodeURIComponent(tableForCrud)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ where, patch: parsed }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      }

      if (activeTable === 'user_states') {
        try {
          setUserStateAuditLoading(true);
          setUserStateAuditError(null);
          const auditRes = await fetch(`${ZHR_API_URL}/api/user-states/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              before: userStateBefore,
              after: parsed,
              editor: 'admin',
            }),
          });
          const auditJson = await auditRes.json().catch(() => ({}));
          if (!auditRes.ok) throw new Error(auditJson?.error || `HTTP ${auditRes.status}`);
          setUserStateAudit(auditJson?.audit ?? null);
          setUserStateAuditLogs((prev) => [auditJson?.log, ...prev].filter(Boolean));
        } catch (e) {
          setUserStateAuditError(e instanceof Error ? e.message : 'Audit failed');
        } finally {
          setUserStateAuditLoading(false);
        }
      }

      setRowModalOpen(false);
      await fetchDb(false);
    } catch (e) {
      setRowActionError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setRowSaving(false);
    }
  }, [activeTable, data?.tables, fetchDb, getCrudTable, plansView, rowEditingWhere, rowJson, rowMode, userStateBefore]);

  const deleteRow = useCallback(
    async (table: string, row: any, idx: number) => {
      const t = getCrudTable(table);
      if (!t) return;
      const where = buildWhere(t, row, idx);
      const ok = window.confirm(`Delete this row permanently?\n\nTable: ${t}\nWhere: ${JSON.stringify(where)}`);
      if (!ok) return;

      setRowSaving(true);
      setRowActionError(null);
      try {
        const res = await fetch(`${ZHR_API_URL}/api/admin/table/${encodeURIComponent(t)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ where }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
        await fetchDb(false);
      } catch (e) {
        setRowActionError(e instanceof Error ? e.message : 'Delete failed');
      } finally {
        setRowSaving(false);
      }
    },
    [buildWhere, fetchDb, getCrudTable]
  );

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Database (Z-HR)" />
        <div className="flex items-center justify-center rounded-lg border border-stroke bg-white p-12 dark:border-strokedark dark:bg-boxdark">
          <div className="text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading database...</p>
            <p className="mt-2 text-xs text-gray-400">Ensure the main Z-HR app is running at {ZHR_API_URL}.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Database (Z-HR)" />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Database connection error</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
          <p className="mt-4 text-xs text-red-600 dark:text-red-400">
            Run the main Z-HR project first (e.g. <code className="bg-red-100 dark:bg-red-900 px-1 rounded">npm run dev</code> in the project root).
            Then set <code className="bg-red-100 dark:bg-red-900 px-1 rounded">NEXT_PUBLIC_ZHR_API_URL</code> in this panel&apos;s <code className="bg-red-100 dark:bg-red-900 px-1 rounded">.env.local</code> to the main app URL (e.g. http://localhost:3000).
          </p>
        </div>
      </div>
    );
  }

  const coinTable = [
    {
      feature: 'AI resume builder',
      coinPrice: 12,
      starterCount: 1,
      starterCoins: 12,
      proCount: 2,
      proCoins: 24,
      plusCount: 4,
      plusCoins: 48,
      eliteCount: 6,
      eliteCoins: 72,
    },
    {
      feature: 'AI Cover Letter',
      coinPrice: 10,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 10,
      plusCount: 4,
      plusCoins: 40,
      eliteCount: 12,
      eliteCoins: 120,
    },
    {
      feature: 'Images input',
      coinPrice: 8,
      starterCount: 0,
      starterCoins: 0,
      proCount: 3,
      proCoins: 24,
      plusCount: 8,
      plusCoins: 64,
      eliteCount: 12,
      eliteCoins: 96,
    },
    {
      feature: 'Voice input',
      coinPrice: 10,
      starterCount: 0,
      starterCoins: 0,
      proCount: 2,
      proCoins: 20,
      plusCount: 6,
      plusCoins: 60,
      eliteCount: 10,
      eliteCoins: 100,
    },
    {
      feature: 'Video input',
      coinPrice: 16,
      starterCount: 0,
      starterCoins: 0,
      proCount: 0,
      proCoins: 0,
      plusCount: 1,
      plusCoins: 16,
      eliteCount: 3,
      eliteCoins: 48,
    },
    {
      feature: 'File input',
      coinPrice: 12,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 12,
      plusCount: 2,
      plusCoins: 24,
      eliteCount: 4,
      eliteCoins: 48,
    },
    {
      feature: 'Wizard Edit',
      coinPrice: 6,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 6,
      plusCount: 4,
      plusCoins: 24,
      eliteCount: 4,
      eliteCoins: 24,
    },
    {
      feature: 'Learning Hub',
      coinPrice: 4,
      starterCount: 0,
      starterCoins: 0,
      proCount: 2,
      proCoins: 8,
      plusCount: 4,
      plusCoins: 16,
      eliteCount: 10,
      eliteCoins: 40,
    },
    {
      feature: 'Skill gape',
      coinPrice: 6,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 6,
      plusCount: 3,
      plusCoins: 18,
      eliteCount: 6,
      eliteCoins: 36,
    },
    {
      feature: 'Voice interview',
      coinPrice: 12,
      starterCount: 0,
      starterCoins: 0,
      proCount: 0,
      proCoins: 0,
      plusCount: 1,
      plusCoins: 12,
      eliteCount: 2,
      eliteCoins: 24,
    },
    {
      feature: 'Video interview',
      coinPrice: 20,
      starterCount: 0,
      starterCoins: 0,
      proCount: 0,
      proCoins: 0,
      plusCount: 1,
      plusCoins: 20,
      eliteCount: 2,
      eliteCoins: 40,
    },
    {
      feature: 'Question interview',
      coinPrice: 4,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 4,
      plusCount: 3,
      plusCoins: 12,
      eliteCount: 2,
      eliteCoins: 8,
    },
    {
      feature: 'Position Suggestion',
      coinPrice: 8,
      starterCount: 0,
      starterCoins: 0,
      proCount: 1,
      proCoins: 8,
      plusCount: 5,
      plusCoins: 40,
      eliteCount: 6,
      eliteCoins: 48,
    },
    {
      feature: 'Price',
      coinPrice: '',
      starterCount: '0',
      starterCoins: '12',
      proCount: '100 AED',
      proCoins: '122 AED',
      plusCount: '250 AED',
      plusCoins: '394 AED',
      eliteCount: '500 AED',
      eliteCoins: '704 AED',
    },
  ];
  const coinActiveCount = coinTable.filter((row) => Number(row.coinPrice) > 0).length;
  const planTable = [
    {
      feature: 'Best for',
      starter: 'Perfect for students & first resume',
      pro: 'For serious job seekers & career switchers',
      plus: 'Active job seekers, mid-level professionals, career changers',
      elite: 'For professionals, power users & international / Dubai career moves',
    },
    { feature: 'Starter (Free Plan)', starter: 'Starter (Free Plan)', pro: 'Pro', plus: 'Plus', elite: 'Elite' },
    { feature: 'ATS-friendly', starter: '✅', pro: '✅', plus: '✅', elite: '✅' },
    { feature: 'With watermark', starter: '✅', pro: '❌', plus: '❌', elite: '❌' },
    { feature: 'templates', starter: 'defult', pro: '3 templates', plus: '3 templates', elite: '3 templates' },
    { feature: 'Job Description Match', starter: '❌', pro: '✅', plus: '✅', elite: '✅' },
    { feature: 'languages supported', starter: 'English', pro: 'English', plus: 'English', elite: 'English' },
    { feature: 'format', starter: 'PDF', pro: 'PDF/Word download', plus: 'PDF/Word download', elite: 'PDF/Word download' },
    { feature: 'AI resume builder', starter: '1', pro: '2', plus: '4', elite: '6' },
    { feature: 'AI Cover Letter', starter: '0', pro: '1', plus: '4', elite: '12' },
    { feature: 'Images input', starter: '0', pro: '3', plus: '8', elite: '12' },
    { feature: 'Voice input', starter: '0', pro: '2', plus: '6', elite: '10' },
    { feature: 'video input', starter: '0', pro: '0', plus: '1', elite: '3' },
    { feature: 'file input', starter: '0', pro: '1', plus: '2', elite: '4' },
    { feature: 'Wizard Edit', starter: '0', pro: '1', plus: '4', elite: '4' },
    { feature: 'learning Hub', starter: '0', pro: '2', plus: '4', elite: '10' },
    { feature: 'skill gape', starter: '0', pro: '1 resume', plus: '3 resume', elite: '6 resume' },
    { feature: 'voice interview', starter: '0', pro: '0', plus: '1', elite: '2' },
    { feature: 'video interview', starter: '0', pro: '0', plus: '1', elite: '2' },
    { feature: 'Question interview', starter: '0', pro: '1', plus: '3', elite: '2' },
    { feature: 'Position Suggestion', starter: '0', pro: '1', plus: '5', elite: '6' },
    { feature: 'Processing Speed', starter: '#4', pro: '#3', plus: '#2', elite: '#1' },
    { feature: 'Price', starter: '0', pro: '100 AED', plus: '250 AED', elite: '500 AED' },
    { feature: 'coin', starter: '', pro: '', plus: '', elite: '' },
  ];
  const coinPackagesSeedRows = [
    { package_name: 'Mini Pack', coin_amount: 10, price_aed: 75, aed_per_coin: 7.5, calculator_value_aed: 80, user_saving_percent: 6 },
    { package_name: 'Starter Pack', coin_amount: 20, price_aed: 140, aed_per_coin: 7, calculator_value_aed: 160, user_saving_percent: 13 },
    { package_name: 'Pro Pack', coin_amount: 35, price_aed: 227.5, aed_per_coin: 6.5, calculator_value_aed: 280, user_saving_percent: 19 },
    { package_name: 'Elite Pack', coin_amount: 55, price_aed: 330, aed_per_coin: 6, calculator_value_aed: 440, user_saving_percent: 25 },
  ];
  const coinPackagesInsertSql = `INSERT INTO coin_packages
(package_name, coin_amount, price_aed, aed_per_coin, calculator_value_aed, user_saving_percent)
VALUES
('Mini Pack', 10, 75, 7.5, 80, 6),
('Starter Pack', 20, 140, 7, 160, 13),
('Pro Pack', 35, 227.5, 6.5, 280, 19),
('Elite Pack', 55, 330, 6, 440, 25);`;
  const coinPackagesHasLiveTable = Boolean((data.tables as any)?.coin_packages);
  const coinPackagesCount = coinPackagesHasLiveTable
    ? (((data.tables as any)?.coin_packages as unknown[]) ?? []).length
    : coinPackagesSeedRows.length;

  return (
    <div>
      <PageBreadcrumb pageTitle="Database (Z-HR)" />
      <div className="space-y-6">
        <div className="rounded-lg border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Database summary</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Source: {data.source} · Updated: {new Date(data.generatedAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" size="sm" onClick={runSync} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync Job positions'}
              </Button>
              <Button variant="primary" size="sm" onClick={runLearningHubSync} disabled={learningHubSyncing}>
                {learningHubSyncing ? 'Syncing...' : 'Sync Learning Hub courses'}
              </Button>
            </div>
          </div>
          {syncMessage && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{syncMessage}</p>
          )}
          {learningHubSyncMessage && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{learningHubSyncMessage}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Object.entries(data.summary).map(([key, count]) => (
              <div
                key={key}
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                  activeTable === key
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 bg-gray-50 dark:border-strokedark dark:bg-meta-4'
                }`}
                onClick={() => setActiveTable(key)}
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{TABLE_LABELS[key] || key}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{count}</p>
              </div>
            ))}
            {!('coin' in data.summary) && (
              <div
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                  activeTable === 'coin'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 bg-gray-50 dark:border-strokedark dark:bg-meta-4'
                }`}
                onClick={() => setActiveTable('coin')}
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{TABLE_LABELS.coin}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{coinActiveCount}</p>
              </div>
            )}
            {!('coin_packages' in data.summary) && (
              <div
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                  activeTable === 'coin_packages'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 bg-gray-50 dark:border-strokedark dark:bg-meta-4'
                }`}
                onClick={() => setActiveTable('coin_packages')}
              >
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{TABLE_LABELS.coin_packages}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{coinPackagesCount}</p>
              </div>
            )}
          </div>
        </div>

        {activeTable === 'coin' && (
          <div className="rounded-lg border border-stroke bg-white overflow-hidden dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
              <h3 className="font-semibold text-gray-900 dark:text-white">Coin</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap" rowSpan={2}>
                      Feature
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap" rowSpan={2}>
                      Coin price
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-center" colSpan={2}>
                      Starter (Free Plan)
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-center" colSpan={2}>
                      Pro
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-center" colSpan={2}>
                      Plus
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap text-center" colSpan={2}>
                      Elite
                    </th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Count</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Coins</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Count</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Coins</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Count</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Coins</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Count</th>
                    <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {coinTable.map((row) => (
                    <tr key={row.feature} className="border-t border-stroke dark:border-strokedark">
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.feature}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.coinPrice || '—'}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.starterCount}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.starterCoins}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.proCount}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.proCoins}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.plusCount}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.plusCoins}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.eliteCount}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.eliteCoins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTable === 'coin_packages' && !coinPackagesHasLiveTable && (
          <div className="rounded-lg border border-stroke bg-white overflow-hidden dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
              <h3 className="font-semibold text-gray-900 dark:text-white">Coin Packages</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Seed preview (static). When backend exposes the table, live rows will be shown automatically.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">package_name</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">coin_amount</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">price_aed</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">aed_per_coin</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">calculator_value_aed</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">user_saving_percent</th>
                  </tr>
                </thead>
                <tbody>
                  {coinPackagesSeedRows.map((row) => (
                    <tr key={row.package_name} className="border-t border-stroke dark:border-strokedark">
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.package_name}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.coin_amount}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.price_aed}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.aed_per_coin}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.calculator_value_aed}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.user_saving_percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-stroke px-4 py-4 dark:border-strokedark">
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">SQL seed</div>
              <pre className="text-xs whitespace-pre overflow-auto rounded border border-stroke bg-gray-50 p-3 text-gray-800 dark:border-strokedark dark:bg-meta-4/40 dark:text-gray-200">
                {coinPackagesInsertSql}
              </pre>
            </div>
          </div>
        )}

        {activeTable === 'plans' && plansView === 'matrix' && (
          <div className="rounded-lg border border-stroke bg-white overflow-hidden dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Plan</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPlansView('matrix')} disabled>
                    Matrix
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setPlansView('rows')} disabled={false}>
                    Manage rows
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Feature</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Starter (Free Plan)</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Pro</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Plus</th>
                    <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {planTable.map((row) => (
                    <tr key={row.feature} className="border-t border-stroke dark:border-strokedark">
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.feature}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.starter || '—'}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.pro || '—'}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.plus || '—'}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{row.elite || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTable !== 'coin' && (activeTable !== 'plans' || plansView === 'rows') && (activeTable !== 'coin_packages' || coinPackagesHasLiveTable) && (
          <div className="rounded-lg border border-stroke bg-white overflow-hidden dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-3 dark:border-strokedark flex items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {activeTable ? (TABLE_LABELS[activeTable] || activeTable) : 'Select table'}
              </h3>
              <div className="flex items-center gap-3">
                {activeTable === 'users' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click a row to view all logs and data for that user.</p>
                )}
                {activeTable === 'plans' && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPlansView('matrix')} disabled={false}>
                      Matrix
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPlansView('rows')} disabled>
                      Rows
                    </Button>
                  </div>
                )}
                {activeTable &&
                  activeTable !== 'coin' &&
                  !(activeTable === 'plans' && plansView === 'matrix') &&
                  !(activeTable === 'coin_packages' && !coinPackagesHasLiveTable) && (
                  <Button variant="primary" size="sm" onClick={openAddRow} disabled={rowSaving}>
                    Add row
                  </Button>
                )}
              </div>
            </div>
            {rowActionError && (
              <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
                <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  {rowActionError}
                </div>
              </div>
            )}
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              {activeTable && data.tables[activeTable] && (data.tables[activeTable] as unknown[]).length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-100 dark:bg-meta-4">
                    <tr>
                      {activeTable === 'user_states' ? (
                        <>
                          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">id</th>
                          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">name</th>
                          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">slug</th>
                          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">order</th>
                          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">description</th>
                        </>
                      ) : (
                        tableColumns.map((col) => (
                          <th key={col} className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {col}
                          </th>
                        ))
                      )}
                      <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.tables[activeTable] as unknown[]).map((row: any, idx) => {
                      const isUserRow = activeTable === 'users';
                      const userRow = row as UserRow;
                      const key = `${String(row?.id ?? idx)}:${String(row?.user_id ?? '')}:${idx}`;
                      return (
                        <tr
                          key={key}
                          className={`border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/50 ${isUserRow ? 'cursor-pointer' : ''}`}
                          onClick={isUserRow ? () => setSelectedUser(userRow) : undefined}
                        >
                          {activeTable === 'user_states' ? (
                            <>
                              <td className="px-4 py-2 text-gray-600 dark:text-gray-400 align-top text-xs">{String(row?.id ?? '—')}</td>
                              <td className="px-4 py-2 text-gray-600 dark:text-gray-400 align-top text-xs">{String(row?.name ?? '—')}</td>
                              <td className="px-4 py-2 text-gray-600 dark:text-gray-400 align-top text-xs">{String(row?.slug ?? '—')}</td>
                              <td className="px-4 py-2 text-gray-600 dark:text-gray-400 align-top text-xs">{String(row?.order ?? '—')}</td>
                              <td className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xl break-words whitespace-pre-wrap align-top text-xs">
                                {String(row?.description ?? '—')}
                              </td>
                            </>
                          ) : (
                            tableColumns.map((k) => {
                              const v = (row as any)?.[k];
                              const display = v == null ? 'null' : typeof v === 'object' ? JSON.stringify(v) : String(v);
                              return (
                                <td key={k} className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-md break-words whitespace-pre-wrap align-top text-xs">
                                  {display}
                                </td>
                              );
                            })
                          )}
                          <td
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => openEditRow(activeTable, row, idx)}
                                disabled={rowSaving}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 ring-red-200 hover:bg-red-50 dark:text-red-300 dark:ring-red-900/50 dark:hover:bg-red-950/30"
                                onClick={() => deleteRow(activeTable, row, idx)}
                                disabled={rowSaving}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {activeTable ? 'This table is empty.' : 'Select a table above.'}
                </div>
              )}
            </div>
            {activeTable === 'user_states' && (
              <div className="border-t border-stroke px-4 py-4 dark:border-strokedark">
                <div className="rounded-lg border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4/40">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">User State Edit Log</h4>
                    {userStateAuditLoading && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Analyzing changes…</span>
                    )}
                  </div>
                  {userStateAuditError && (
                    <div className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                      {userStateAuditError}
                    </div>
                  )}
                  {userStateAudit && (
                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <div className="rounded border border-stroke bg-white px-3 py-2 text-sm text-gray-700 dark:border-strokedark dark:bg-boxdark dark:text-gray-200">
                        <span className="font-semibold">Summary:</span> {String(userStateAudit.summary ?? '')}
                      </div>
                      <div className="rounded border border-stroke bg-white px-3 py-2 text-xs text-gray-700 dark:border-strokedark dark:bg-boxdark dark:text-gray-200">
                        <div className="font-semibold mb-2">Changes</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {(Array.isArray(userStateAudit.changes) ? userStateAudit.changes : []).map((c: any, i: number) => (
                            <li key={`c-${i}`}>
                              <span className="font-semibold">{String(c?.field ?? '')}:</span> {String(c?.before ?? '')} → {String(c?.after ?? '')}
                              {c?.impact ? ` (impact: ${c.impact})` : ''}
                              {c?.reason ? ` — ${c.reason}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded border border-stroke bg-white px-3 py-2 text-xs text-gray-700 dark:border-strokedark dark:bg-boxdark dark:text-gray-200">
                        <div className="font-semibold mb-2">Merge Guidance</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {(Array.isArray(userStateAudit.mergeGuidance) ? userStateAudit.mergeGuidance : []).map((m: string, i: number) => (
                            <li key={`m-${i}`}>{String(m)}</li>
                          ))}
                        </ul>
                      </div>
                      {userStateAudit.suggestedDescription && (
                        <div className="rounded border border-stroke bg-white px-3 py-2 text-xs text-gray-700 dark:border-strokedark dark:bg-boxdark dark:text-gray-200">
                          <div className="font-semibold mb-2">Suggested Description</div>
                          <div>{String(userStateAudit.suggestedDescription)}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {userStateAuditLogs.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Recent Edits</div>
                      <div className="space-y-2">
                        {userStateAuditLogs.map((log: any, i: number) => (
                          <div key={`log-${i}`} className="rounded border border-stroke bg-white px-3 py-2 text-xs text-gray-700 dark:border-strokedark dark:bg-boxdark dark:text-gray-200">
                            <div className="flex items-center justify-between">
                              <span>{String(log?.state_name ?? 'User State')}</span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">{String(log?.created_at ?? '')}</span>
                            </div>
                            {log?.audit?.summary && <div className="mt-1">{String(log.audit.summary)}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {rowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => !rowSaving && setRowModalOpen(false)}>
            <div
              className="w-full max-w-3xl bg-white dark:bg-boxdark shadow-xl overflow-hidden flex flex-col max-h-[90vh] rounded-lg border border-stroke dark:border-strokedark"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stroke px-4 py-3 dark:border-strokedark">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {rowMode === 'add' ? 'Add row' : 'Edit row'}
                </h3>
                <Button variant="primary" size="sm" onClick={() => setRowModalOpen(false)} disabled={rowSaving}>
                  Close
                </Button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paste/modify JSON. Key fields are inferred automatically (or fallback to row index). Key fields cannot be changed via edit.
                </p>
                {rowActionError && (
                  <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                    {rowActionError}
                  </div>
                )}
                <textarea
                  className="w-full min-h-[320px] rounded border border-stroke bg-transparent px-3 py-2 text-sm text-gray-800 dark:text-gray-200 dark:border-strokedark"
                  value={rowJson}
                  onChange={(e) => setRowJson(e.target.value)}
                  spellCheck={false}
                />
              </div>

              <div className="border-t border-stroke px-4 py-3 dark:border-strokedark flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setRowModalOpen(false)} disabled={rowSaving}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={saveRow} disabled={rowSaving}>
                  {rowSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {selectedUser != null && userId != null && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setSelectedUser(null)}>
            <div
              className="w-full max-w-4xl bg-white dark:bg-boxdark shadow-xl overflow-hidden flex flex-col max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-stroke px-4 py-3 dark:border-strokedark">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  User details: {selectedUser.email ?? selectedUser.name ?? `ID ${userId}`}
                </h3>
                <Button variant="primary" size="sm" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {userDetailData &&
                  [
                    { key: 'login_logs', label: 'Login logs', data: userDetailData.login_logs },
                    { key: 'fiserv_transactions', label: 'Payments (Fiserv)', data: (userDetailData as any).fiserv_transactions ?? [] },
                    { key: 'ai_interactions', label: 'ChatGPT input/output', data: userDetailData.ai_interactions },
                    { key: 'cvs', label: 'Resumes', data: userDetailData.cvs },
                    { key: 'cover_letters', label: 'Cover letters', data: (userDetailData as any).cover_letters ?? [] },
                    { key: 'wizard_data', label: 'Wizard data', data: userDetailData.wizard_data },
                    { key: 'user_skills', label: 'User skills', data: userDetailData.user_skills },
                    { key: 'interview_sessions', label: 'Interview sessions', data: userDetailData.interview_sessions },
                    { key: 'resume_drafts', label: 'Resume drafts', data: userDetailData.resume_drafts },
                    { key: 'history', label: 'History', data: (userDetailData as any).history ?? [] },
                    { key: 'registration_logs', label: 'Registration logs', data: userDetailData.registration_logs },
                  ].map(({ key, label, data }) => (
                    <div key={key} className="rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
                      <div className="bg-gray-100 dark:bg-meta-4 px-3 py-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                        {label} ({data.length})
                      </div>
                      {data.length > 0 ? (
                        <div className="max-h-80 overflow-auto overflow-x-auto">
                          {key === 'cvs' ? (
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-gray-50 dark:bg-meta-4/50 sticky top-0 z-10">
                                <tr>
                                  <th className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    id
                                  </th>
                                  <th className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    request_id
                                  </th>
                                  <th className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    updated_at
                                  </th>
                                  <th className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    preview
                                  </th>
                                  <th className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {(data as any[])
                                  .slice()
                                  .sort((a, b) => {
                                    const ta = Date.parse(String(a?.updated_at ?? a?.created_at ?? '')) || 0;
                                    const tb = Date.parse(String(b?.updated_at ?? b?.created_at ?? '')) || 0;
                                    return tb - ta;
                                  })
                                  .map((row: any, i) => {
                                    const reqId = String(row?.request_id ?? row?.requestId ?? row?.id ?? i);
                                    const isOpen = expandedCvRequestId === reqId;
                                    const requestIdForEditor = String(row?.request_id ?? row?.requestId ?? '').trim();
                                    const editorHref =
                                      requestIdForEditor && userId != null
                                        ? `${ZHR_API_URL}/admin/resume-editor?userId=${encodeURIComponent(
                                            String(userId)
                                          )}&requestId=${encodeURIComponent(requestIdForEditor)}`
                                        : null;
                                    const preview =
                                      truncate(row?.title, 60) ||
                                      truncate(row?.summary, 120) ||
                                      truncate(row?.content, 160) ||
                                      '—';
                                    return (
                                      <React.Fragment key={reqId}>
                                        <tr className="border-b border-stroke dark:border-strokedark hover:bg-gray-50/50 dark:hover:bg-meta-4/30">
                                          <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top">
                                            {String(row?.id ?? '—')}
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top">
                                            {String(row?.request_id ?? row?.requestId ?? '—')}
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top">
                                            {String(row?.updated_at ?? row?.updatedAt ?? row?.created_at ?? row?.createdAt ?? '—')}
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap align-top max-w-xl">
                                            {preview}
                                          </td>
                                          <td className="px-2 py-1.5 text-gray-600 dark:text-gray-400 whitespace-nowrap align-top">
                                            <button
                                              className="text-primary underline"
                                              onClick={() => setExpandedCvRequestId(isOpen ? null : reqId)}
                                            >
                                              {isOpen ? 'Hide' : 'View'}
                                            </button>
                                            {editorHref && (
                                              <>
                                                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                                                <a
                                                  className="text-primary underline"
                                                  href={editorHref}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  title="Open in Resume Editor"
                                                >
                                                  Edit
                                                </a>
                                              </>
                                            )}
                                          </td>
                                        </tr>
                                        {isOpen && (
                                          <tr className="border-b border-stroke dark:border-strokedark">
                                            <td colSpan={5} className="px-2 py-2 bg-gray-50 dark:bg-meta-4/30">
                                              <div className="grid grid-cols-1 gap-3">
                                                <div>
                                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    content
                                                  </p>
                                                  <pre className="text-[11px] leading-4 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200">
                                                    {safeJsonString(row?.content ?? '')}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    analysis_result
                                                  </p>
                                                  <pre className="text-[11px] leading-4 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200">
                                                    {safeJsonString(row?.analysis_result ?? row?.analysisResult ?? '')}
                                                  </pre>
                                                </div>
                                                <div>
                                                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    cover_letter (for this resume)
                                                  </p>
                                                  {(() => {
                                                    const all = ((userDetailData as any)?.cover_letters ?? []) as any[];
                                                    const rid = String(row?.request_id ?? row?.requestId ?? '').trim();
                                                    const cl = all.find((x: any) => String(x?.cv_request_id ?? x?.request_id ?? x?.requestId ?? '').trim() === rid);
                                                    const jsonObj = cl?.cover_letter_json ?? cl?.coverLetterJson ?? null;
                                                    const subject = String(jsonObj?.subject ?? cl?.subject ?? '').trim();
                                                    const content =
                                                      String(jsonObj?.content ?? cl?.cover_letter ?? cl?.coverLetter ?? '').trim();
                                                    if (!subject && !content) {
                                                      return (
                                                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                                          —
                                                        </div>
                                                      );
                                                    }
                                                    return (
                                                      <div className="space-y-2">
                                                        {subject && (
                                                          <div className="text-[11px] text-gray-700 dark:text-gray-200">
                                                            <span className="font-medium">Subject:</span> {subject}
                                                          </div>
                                                        )}
                                                        <pre className="text-[11px] leading-4 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-200">
                                                          {content}
                                                        </pre>
                                                      </div>
                                                    );
                                                  })()}
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                              </tbody>
                            </table>
                          ) : (
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-gray-50 dark:bg-meta-4/50 sticky top-0 z-10">
                                <tr>
                                  {(Object.keys(data[0] as object) as string[]).map((col) => (
                                    <th
                                      key={col}
                                      className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {data.map((row: any, i: number) => (
                                  <tr
                                    key={i}
                                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50/50 dark:hover:bg-meta-4/30"
                                  >
                                    {Object.entries(row).map(([k, v]) => (
                                      <td
                                        key={k}
                                        className="px-2 py-1.5 text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap align-top min-w-0 max-w-xl"
                                      >
                                        {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—')}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      ) : (
                        <p className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">No records</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
