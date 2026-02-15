'use client';

import { useEffect, useMemo, useState } from 'react';

import { Alert, Box, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

type PaymentResultMessage = {
  type: 'payment_result';
  status: 'success' | 'failed' | 'cancelled';
  planId?: string;
  at: number;
  orderId?: string;
};

const CHANNEL_NAME = 'zcv-payment';

function mapStatus(raw: string | null): PaymentResultMessage['status'] {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'success') return 'success';
  if (s === 'cancelled') return 'cancelled';
  return 'failed';
}

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const status = mapStatus(searchParams.get('status'));
  const planId = searchParams.get('plan') ?? undefined;
  const orderId = searchParams.get('orderId') ?? undefined;

  const [sent, setSent] = useState(false);

  const payload = useMemo<PaymentResultMessage>(
    () => ({ type: 'payment_result', status, planId, orderId, at: Date.now() }),
    [orderId, planId, status],
  );

  useEffect(() => {
    // 1) BroadcastChannel (best for cross-tab, same-origin)
    try {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage(payload);
      bc.close();
    } catch {
      // ignore
    }

    // 2) postMessage to opener (fallback)
    try {
      window.opener?.postMessage(payload, window.location.origin);
    } catch {
      // ignore
    }

    setSent(true);

    // Close this tab (works only if opened via JS)
    const t = setTimeout(() => {
      try {
        window.close();
      } catch {
        // ignore
      }
    }, 500);

    return () => clearTimeout(t);
  }, [payload]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', px: 2, py: 6 }}>
      <Stack
        sx={{
          width: 'min(720px, 100%)',
          mx: 'auto',
          bgcolor: '#fff',
          border: '1px solid #eee',
          borderRadius: 3,
          p: { xs: 2.5, sm: 4 },
        }}
        gap={2}
      >
        <Typography variant='h4' fontWeight={800}>
          Payment {status === 'success' ? 'successful' : status === 'cancelled' ? 'cancelled' : 'failed'}
        </Typography>

        <Alert severity={status === 'success' ? 'success' : status === 'cancelled' ? 'warning' : 'error'}>
          {sent ? 'Result sent back to the app. You can close this tab.' : 'Sending result back to the app…'}
        </Alert>

        <Stack gap={0.75}>
          {planId ? (
            <Typography variant='body2' color='text.secondary'>
              Plan: <b>{planId}</b>
            </Typography>
          ) : null}
          {orderId ? (
            <Typography variant='body2' color='text.secondary'>
              Order ID: <b>{orderId}</b>
            </Typography>
          ) : null}
        </Stack>

        <Typography variant='caption' color='text.secondary'>
          If this tab doesn&apos;t close automatically, close it manually and return to the previous tab.
        </Typography>
      </Stack>
    </Box>
  );
}

