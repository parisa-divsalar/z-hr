'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import React, { useEffect, useState } from 'react';

const ZHR_API_URL = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';

type DbOverview = {
  summary: Record<string, number>;
  tables: Record<string, unknown[]>;
  source: string;
  generatedAt: string;
};

const TABLE_LABELS: Record<string, string> = {
  users: 'کاربران',
  cvs: 'رزومه‌ها',
  skills: 'مهارت‌ها',
  user_skills: 'مهارت‌های کاربران',
  interview_sessions: 'جلسات مصاحبه',
  registration_logs: 'لاگ ثبت‌نام',
  cover_letters: 'نامه‌های پوششی',
  wizard_data: 'داده ویزارد',
  resume_drafts: 'پیش‌نویس رزومه',
  resume_section_outputs: 'خروجی بخش‌های رزومه',
};

export default function DatabasePage() {
  const [data, setData] = useState<DbOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTable, setActiveTable] = useState<string | null>(null);

  useEffect(() => {
    const fetchDb = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${ZHR_API_URL}/api/admin/database`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
        if (json.tables && Object.keys(json.tables).length > 0 && !activeTable) {
          setActiveTable(Object.keys(json.tables)[0]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'خطا در دریافت داده');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDb();
  }, []);

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Database (Z-HR)" />
        <div className="flex items-center justify-center rounded-lg border border-stroke bg-white p-12 dark:border-strokedark dark:bg-boxdark">
          <div className="text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات دیتابیس...</p>
            <p className="mt-2 text-xs text-gray-400">اطمینان حاصل کنید اپلیکیشن اصلی Z-HR روی {ZHR_API_URL} در حال اجرا است.</p>
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
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">خطا در اتصال به دیتابیس</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
          <p className="mt-4 text-xs text-red-600 dark:text-red-400">
            برای مشاهده داده‌ها ابتدا پروژه اصلی Z-HR را اجرا کنید (مثلاً <code className="bg-red-100 dark:bg-red-900 px-1 rounded">npm run dev</code> در root پروژه).
            سپس در فایل <code className="bg-red-100 dark:bg-red-900 px-1 rounded">.env.local</code> این پنل، متغیر <code className="bg-red-100 dark:bg-red-900 px-1 rounded">NEXT_PUBLIC_ZHR_API_URL</code> را روی آدرس اپ اصلی (مثلاً http://localhost:3000) قرار دهید.
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">خلاصه دیتابیس</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">منبع: {data.source} · به‌روزرسانی: {new Date(data.generatedAt).toLocaleString('fa-IR')}</p>
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
          <div className="border-b border-stroke px-4 py-3 dark:border-strokedark">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {activeTable ? (TABLE_LABELS[activeTable] || activeTable) : 'انتخاب جدول'}
            </h3>
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
                  {(data.tables[activeTable] as unknown[]).map((row, idx) => (
                    <tr key={idx} className="border-t border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4/50">
                      {Object.entries(row as object).map(([k, v]) => (
                        <td key={k} className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xs truncate" title={typeof v === 'string' ? v : JSON.stringify(v)}>
                          {typeof v === 'object' && v !== null ? JSON.stringify(v).slice(0, 80) + (JSON.stringify(v).length > 80 ? '…' : '') : String(v ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {activeTable ? 'این جدول خالی است.' : 'یک جدول از بالا انتخاب کنید.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
