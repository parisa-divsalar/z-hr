'use client';

import { useMemo, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';

type PaymentResultMessage = {
  type: 'payment_result';
  status: 'success' | 'failed' | 'cancelled';
  planId?: string;
  at: number;
};

const CHANNEL_NAME = 'zcv-payment';

export default function TestPaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') ?? undefined;

  const [sent, setSent] = useState<PaymentResultMessage | null>(null);

  const title = useMemo(() => {
    if (planId) return `Test payment gateway (plan: ${planId})`;
    return 'Test payment gateway';
  }, [planId]);

  const sendResult = (status: PaymentResultMessage['status']) => {
    const payload: PaymentResultMessage = { type: 'payment_result', status, planId, at: Date.now() };

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

    setSent(payload);

    // Close this tab (works only if opened via JS)
    setTimeout(() => {
      try {
        window.close();
      } catch {
        // ignore
      }
    }, 250);
  };

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
        <Typography variant='h4' fontWeight={700}>
          {title}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          This page is completely test-only. Click a button to simulate a payment result. The previous tab should show a success dialog without refreshing.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} mt={1}>
          <MuiButton color='primary' variant='contained' onClick={() => sendResult('success')}>
            Simulate Success
          </MuiButton>
          <MuiButton color='error' variant='outlined' onClick={() => sendResult('failed')}>
            Simulate Failed
          </MuiButton>
          <MuiButton color='secondary' variant='text' onClick={() => sendResult('cancelled')}>
            Cancel
          </MuiButton>
        </Stack>

        {sent ? (
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f6f7ff', border: '1px solid #e5e7ff' }}>
            <Typography variant='subtitle2' fontWeight={700}>
              Sent:
            </Typography>
            <Typography variant='body2' sx={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>
              {JSON.stringify(sent)}
            </Typography>
            <Typography variant='body2' color='text.secondary' mt={1}>
              If this tab didn&apos;t close automatically, you can close it manually.
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}






