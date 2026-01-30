import { NextResponse } from 'next/server';

/**
 * GET /api/learning-hub/status
 * فقط برای دیباگ: می‌فهمی RAPIDAPI_KEY از .env.local لود شده یا نه.
 * مقدار کلید را برنمی‌گرداند.
 */
export async function GET() {
  const hasKey = Boolean(process.env.RAPIDAPI_KEY?.trim());
  return NextResponse.json({
    hasRapidApiKey: hasKey,
    hint: hasKey
      ? 'RAPIDAPI_KEY is set. If sync still fails, check RapidAPI subscription and restart the server.'
      : 'RAPIDAPI_KEY is missing. Add it to .env.local in the project ROOT (same folder as package.json), then restart the server (npm run dev).',
  });
}
