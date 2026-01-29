import { NextResponse } from 'next/server';

import { getOpenAIClient } from '@/services/chatgpt/client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * GET /api/admin/test-chatgpt
 * Tests that OpenAI/ChatGPT API is configured and reachable.
 * Sends a minimal request and returns OK or error.
 */
export async function GET() {
  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      max_tokens: 10,
    });
    const reply = completion.choices[0]?.message?.content?.trim() ?? '';
    const ok = reply.toUpperCase() === 'OK' || reply.length > 0;
    return NextResponse.json(
      {
        success: ok,
        message: ok ? 'ChatGPT API connected successfully.' : 'Unexpected reply from API.',
        reply: reply || '(empty)',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message, message: 'ChatGPT API test failed.' },
      { status: 200, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
