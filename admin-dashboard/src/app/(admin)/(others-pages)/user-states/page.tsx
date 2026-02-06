'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import React, { useCallback, useEffect, useState } from 'react';

const ZHR_API_URL = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';

type StateTransition = {
  id: string;
  user_id: number;
  prev_state: string | null;
  state: string;
  reason: string;
  meta: any;
  created_at: string;
};

type DbOverview = {
  tables: {
    user_state_history?: StateTransition[];
    users?: Array<{ id: number; email?: string; name?: string }>;
  };
};

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

export default function UserStatesPage() {
  const [stateHistory, setStateHistory] = useState<StateTransition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Map<number, string>>(new Map());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ZHR_API_URL}/api/admin/database`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DbOverview = await res.json();
      
      const history = json.tables.user_state_history ?? [];
      const usersList = json.tables.users ?? [];
      
      // Create user ID to email map
      const userMap = new Map<number, string>();
      usersList.forEach((u) => {
        userMap.set(u.id, u.email || u.name || `User ${u.id}`);
      });
      setUsers(userMap);
      
      // Sort by created_at descending (most recent first)
      const sorted = [...history].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setStateHistory(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getUserDisplay = (userId: number): string => {
    return users.get(userId) || `User ${userId}`;
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="User State Audit" />
        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
          <p className="text-gray-500 dark:text-gray-400">Loading state history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="User State Audit" />
        <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <Button variant="primary" size="md" onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="User State Audit" />
      
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {stateHistory.length} state transition{stateHistory.length !== 1 ? 's' : ''} (most recent first)
        </p>
        <Button variant="primary" size="sm" onClick={fetchData}>
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-50 text-left dark:border-strokedark dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-gray-900 dark:text-white">User</th>
                <th className="px-4 py-4 font-medium text-gray-900 dark:text-white">From State</th>
                <th className="px-4 py-4 font-medium text-gray-900 dark:text-white">To State</th>
                <th className="px-4 py-4 font-medium text-gray-900 dark:text-white">Reason</th>
                <th className="px-4 py-4 font-medium text-gray-900 dark:text-white">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {stateHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No state transitions recorded yet
                  </td>
                </tr>
              ) : (
                stateHistory.map((transition) => (
                  <tr
                    key={transition.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex flex-col">
                        <span className="font-medium">{getUserDisplay(transition.user_id)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">ID: {transition.user_id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {transition.prev_state ? (
                        <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
                          {transition.prev_state}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">none</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      <span className="inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {transition.state}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="max-w-md">
                        {transition.reason}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(transition.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
