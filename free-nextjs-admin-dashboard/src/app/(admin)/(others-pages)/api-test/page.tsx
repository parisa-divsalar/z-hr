'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import React, { useState } from 'react';

const ZHR_API_URL = process.env.NEXT_PUBLIC_ZHR_API_URL || 'http://localhost:3000';

type TestResult = {
  loading: boolean;
  success?: boolean;
  message?: string;
  detail?: string;
};

export default function ApiTestPage() {
  const [ping, setPing] = useState<TestResult>({ loading: false });
  const [chatgpt, setChatgpt] = useState<TestResult>({ loading: false });
  const [jobs, setJobs] = useState<TestResult>({ loading: false });

  const runPing = async () => {
    setPing({ loading: true });
    try {
      const res = await fetch(`${ZHR_API_URL}/api/admin/test-ping`, { cache: 'no-store' });
      const data = await res.json();
      setPing({
        loading: false,
        success: data.ok === true,
        message: data.ok ? 'اتصال به API پروژه Z-HR برقرار است.' : 'پاسخ غیرمنتظره.',
        detail: data.message,
      });
    } catch (e) {
      setPing({
        loading: false,
        success: false,
        message: 'خطا در اتصال به Z-HR API.',
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const runChatGPT = async () => {
    setChatgpt({ loading: true });
    try {
      const res = await fetch(`${ZHR_API_URL}/api/admin/test-chatgpt`, { cache: 'no-store' });
      const data = await res.json();
      setChatgpt({
        loading: false,
        success: data.success === true,
        message: data.success ? 'ChatGPT API متصل و در دسترس است.' : (data.message || 'خطا'),
        detail: data.reply || data.error,
      });
    } catch (e) {
      setChatgpt({
        loading: false,
        success: false,
        message: 'خطا در تست ChatGPT.',
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const runJobs = async () => {
    setJobs({ loading: true });
    try {
      const res = await fetch(`${ZHR_API_URL}/api/admin/test-jobs`, { cache: 'no-store' });
      const data = await res.json();
      setJobs({
        loading: false,
        success: data.success === true,
        message: data.success
          ? `API مشاغل (Adzuna) متصل است. ${data.count} شغل دریافت شد.`
          : (data.message || 'API کلید ندارد یا خطا دارد.'),
        detail:
          data.sample?.title != null
            ? `${data.sample.title} @ ${data.sample.company} (${data.sample.source})`
            : data.error,
      });
    } catch (e) {
      setJobs({
        loading: false,
        success: false,
        message: 'خطا در تست API مشاغل.',
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const TestCard = ({
    title,
    description,
    result,
    onRun,
    runLabel,
  }: {
    title: string;
    description: string;
    result: TestResult;
    onRun: () => void;
    runLabel: string;
  }) => (
    <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={onRun}
          disabled={result.loading}
        >
          {result.loading ? 'در حال تست...' : runLabel}
        </Button>
        {result.success !== undefined && !result.loading && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              result.success
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {result.success ? '✓ متصل' : '✗ خطا'}
          </span>
        )}
      </div>
      {result.message && !result.loading && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{result.message}</p>
      )}
      {result.detail && !result.loading && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{result.detail}</p>
      )}
    </div>
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="تست API ها" />
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        با دکمه‌های زیر اتصال به API های متصل به پروژه Z-HR را تست کنید. مطمئن شوید اپ اصلی روی{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{ZHR_API_URL}</code> در حال اجرا است.
      </p>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <TestCard
          title="اتصال به Z-HR API"
          description="بررسی می‌کند پنل ادمین به سرور اصلی Z-HR متصل است."
          result={ping}
          onRun={runPing}
          runLabel="تست اتصال"
        />
        <TestCard
          title="ChatGPT API"
          description="بررسی می‌کند OPENAI_API_KEY در .env.local تنظیم شده و درخواست به OpenAI ارسال می‌شود."
          result={chatgpt}
          onRun={runChatGPT}
          runLabel="تست ChatGPT"
        />
        <TestCard
          title="Adzuna / Jobs API"
          description="بررسی می‌کند ADZUNA_APP_ID و ADZUNA_APP_KEY تنظیم شده و یک شغل نمونه دریافت می‌شود."
          result={jobs}
          onRun={runJobs}
          runLabel="تست Jobs API"
        />
      </div>
    </div>
  );
}
