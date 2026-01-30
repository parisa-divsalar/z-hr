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

  const userId = selectedUser?.id != null ? Number(selectedUser.id) : null;
  const userDetailData = useMemo(() => {
    if (!data || userId == null) return null;
    const tables = data.tables as Record<string, unknown[]>;
    return {
      login_logs: filterByUserId(tables.login_logs ?? [], userId),
      ai_interactions: filterByUserId(tables.ai_interactions ?? [], userId),
      cvs: filterByUserId(tables.cvs ?? [], userId),
      wizard_data: filterByUserId(tables.wizard_data ?? [], userId),
      user_skills: filterByUserId(tables.user_skills ?? [], userId),
      interview_sessions: filterByUserId(tables.interview_sessions ?? [], userId),
      resume_drafts: filterByUserId(tables.resume_drafts ?? [], userId),
      registration_logs: (tables.registration_logs ?? []).filter(
        (r: any) => r.email === selectedUser?.email || r.user_id === userId
      ),
    };
  }, [data, userId, selectedUser?.email]);

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
      const res = await fetch(`${ZHR_API_URL}/api/learning-hub/sync`, { cache: 'no-store' });
      const json = await res.json();
      setLearningHubSyncMessage(json.message || (json.added != null ? `${json.added} new course(s) added.` : json.error || 'Done.'));
      await fetchDb(false);
    } catch (e) {
      setLearningHubSyncMessage(e instanceof Error ? e.message : 'Learning Hub sync failed');
    } finally {
      setLearningHubSyncing(false);
    }
  };

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

  const tableKeys = Object.keys(data.tables);

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
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white overflow-hidden dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-4 py-3 dark:border-strokedark flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {activeTable ? (TABLE_LABELS[activeTable] || activeTable) : 'Select table'}
            </h3>
            {activeTable === 'users' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Click a row to view all logs and data for that user.</p>
            )}
          </div>
          <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
            {activeTable && data.tables[activeTable] && (data.tables[activeTable] as unknown[]).length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-100 dark:bg-meta-4">
                  <tr>
                    {(Object.keys((data.tables[activeTable] as unknown[])[0] as object) as string[]).map((col) => (
                      <th key={col} className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.tables[activeTable] as unknown[]).map((row, idx) => {
                    const isUserRow = activeTable === 'users';
                    const userRow = row as UserRow;
                    return (
                      <tr
                        key={idx}
                        className={`border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/50 ${isUserRow ? 'cursor-pointer' : ''}`}
                        onClick={isUserRow ? () => setSelectedUser(userRow) : undefined}
                      >
                        {Object.entries(row as object).map(([k, v]) => (
                          <td key={k} className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-md break-words whitespace-pre-wrap align-top text-xs">
                            {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—')}
                          </td>
                        ))}
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
        </div>

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
                    { key: 'ai_interactions', label: 'ChatGPT input/output', data: userDetailData.ai_interactions },
                    { key: 'cvs', label: 'Resumes', data: userDetailData.cvs },
                    { key: 'wizard_data', label: 'Wizard data', data: userDetailData.wizard_data },
                    { key: 'user_skills', label: 'User skills', data: userDetailData.user_skills },
                    { key: 'interview_sessions', label: 'Interview sessions', data: userDetailData.interview_sessions },
                    { key: 'resume_drafts', label: 'Resume drafts', data: userDetailData.resume_drafts },
                    { key: 'registration_logs', label: 'Registration logs', data: userDetailData.registration_logs },
                  ].map(({ key, label, data }) => (
                    <div key={key} className="rounded-lg border border-stroke dark:border-strokedark overflow-hidden">
                      <div className="bg-gray-100 dark:bg-meta-4 px-3 py-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                        {label} ({data.length})
                      </div>
                      {data.length > 0 ? (
                        <div className="max-h-80 overflow-auto overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-gray-50 dark:bg-meta-4/50 sticky top-0 z-10">
                              <tr>
                                {(Object.keys(data[0] as object) as string[]).map((col) => (
                                  <th key={col} className="px-2 py-1.5 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap border-b border-stroke dark:border-strokedark">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((row: any, i) => (
                                <tr key={i} className="border-b border-stroke dark:border-strokedark hover:bg-gray-50/50 dark:hover:bg-meta-4/30">
                                  {Object.entries(row).map(([k, v]) => (
                                    <td key={k} className="px-2 py-1.5 text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap align-top min-w-0 max-w-xl">
                                      {typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—')}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
