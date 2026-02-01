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
        message: data.ok ? 'Connected to Z-HR API.' : 'Unexpected response.',
        detail: data.message,
      });
    } catch (e) {
      setPing({
        loading: false,
        success: false,
        message: 'Failed to connect to Z-HR API.',
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
        message: data.success ? 'ChatGPT API connected.' : (data.message || 'Error'),
        detail: data.reply || data.error,
      });
    } catch (e) {
      setChatgpt({
        loading: false,
        success: false,
        message: 'ChatGPT test failed.',
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
          ? `Jobs API (Adzuna) connected. ${data.count} job(s) fetched.`
          : (data.message || 'API key missing or error.'),
        detail:
          data.sample?.title != null
            ? `${data.sample.title} @ ${data.sample.company} (${data.sample.source})`
            : data.error,
      });
    } catch (e) {
      setJobs({
        loading: false,
        success: false,
        message: 'Jobs API test failed.',
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
          {result.loading ? 'Testing...' : runLabel}
        </Button>
        {result.success !== undefined && !result.loading && (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              result.success
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {result.success ? '✓ Connected' : '✗ Error'}
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
      <PageBreadcrumb pageTitle="API Tests" />
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Use the buttons below to test connections to Z-HR APIs. Ensure the main app is running at{' '}
        <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">{ZHR_API_URL}</code>.
      </p>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <TestCard
          title="Z-HR API connection"
          description="Checks that the admin panel can reach the main Z-HR server."
          result={ping}
          onRun={runPing}
          runLabel="Test connection"
        />
        <TestCard
          title="ChatGPT API"
          description="Checks that OPENAI_API_KEY is set in .env.local and requests reach OpenAI."
          result={chatgpt}
          onRun={runChatGPT}
          runLabel="Test ChatGPT"
        />
        <TestCard
          title="Adzuna / Jobs API"
          description="Checks that ADZUNA_APP_ID and ADZUNA_APP_KEY are set and a sample job is fetched."
          result={jobs}
          onRun={runJobs}
          runLabel="Test Jobs API"
        />
      </div>
    </div>
  );
}
