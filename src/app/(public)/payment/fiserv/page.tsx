'use client';

import { useEffect, useMemo, useState } from 'react';

import { Alert, Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import MuiButton from '@/components/UI/MuiButton';

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';

type PlansApiResponse = {
  plans?: Array<{ id: PlanId; name: string; price: string; priceTone: 'free' | 'paid' }>;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = String(fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: 'Test', lastName: 'User' };
  if (parts.length === 1) return { firstName: parts[0], lastName: 'User' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export default function FiservPaymentPage() {
  const searchParams = useSearchParams();
  const planIdRaw = (searchParams.get('plan') ?? '').trim().toLowerCase();
  const planId = (planIdRaw === 'starter' || planIdRaw === 'pro' || planIdRaw === 'plus' || planIdRaw === 'elite'
    ? planIdRaw
    : null) as PlanId | null;

  const [planName, setPlanName] = useState<string>('');
  const [planPriceLabel, setPlanPriceLabel] = useState<string>('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+971501234567');
  const [address1, setAddress1] = useState('Dubai, UAE');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (planId) return 'Secure checkout (Fiserv)';
    return 'Secure checkout (Fiserv) — missing plan';
  }, [planId]);

  useEffect(() => {
    let cancelled = false;
    if (!planId) return;

    (async () => {
      setLoadingPlan(true);
      try {
        const res = await fetch('/api/plans', { headers: { Accept: 'application/json' }, cache: 'no-store' });
        const json = (await res.json().catch(() => ({}))) as PlansApiResponse;
        if (cancelled) return;
        const plans = Array.isArray(json?.plans) ? json.plans : [];
        const plan = plans.find((p) => p.id === planId);
        setPlanName(plan?.name ?? planId);
        setPlanPriceLabel(plan?.price ?? '');
      } catch {
        // ignore — price is for display only
      } finally {
        if (!cancelled) setLoadingPlan(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [planId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/users/me', { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json().catch(() => ({}))) as any;
        const data = json?.data ?? null;
        if (!data || cancelled) return;

        const nextEmail = String(data?.email ?? '').trim();
        const nextName = String(data?.name ?? '').trim();

        if (nextEmail && !email) setEmail(nextEmail);
        if (nextName && (firstName === 'Test' || lastName === 'User')) {
          const s = splitName(nextName);
          setFirstName(s.firstName);
          setLastName(s.lastName);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    setError(null);
    if (!planId) {
      setError('Missing plan id. Open this page with ?plan=starter|pro|plus|elite');
      return;
    }
    if (!email.trim()) {
      setError('Email is required for production checkout.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/payment/fiserv/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          planId,
          customer: { firstName, lastName, email, phone, address1, city: 'Dubai', country: 'AE', postalCode: '00000' },
        }),
      });

      const json = (await res.json().catch(() => ({}))) as any;
      if (!res.ok) throw new Error(String(json?.error ?? `HTTP ${res.status}`));

      const checkoutUrl = String(json?.checkoutUrl ?? '').trim();
      if (!checkoutUrl) throw new Error('No checkoutUrl returned from server.');

      window.location.assign(checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start checkout');
    } finally {
      setSubmitting(false);
    }
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
        <Typography variant='h4' fontWeight={800}>
          {title}
        </Typography>

        {planId ? (
          <Typography variant='body2' color='text.secondary'>
            Plan: <b>{loadingPlan ? 'Loading…' : planName || planId}</b>
            {planPriceLabel ? (
              <>
                {' '}
                — Price: <b>{planPriceLabel}</b>
              </>
            ) : null}
          </Typography>
        ) : (
          <Alert severity='warning'>No plan selected. Example: `/payment/fiserv?plan=plus`</Alert>
        )}

        {error ? <Alert severity='error'>{error}</Alert> : null}

        <Stack gap={1.5} mt={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
            <TextField
              label='First name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              inputProps={{ autoComplete: 'given-name' }}
            />
            <TextField
              label='Last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              inputProps={{ autoComplete: 'family-name' }}
            />
          </Stack>

          <TextField
            label='Email (required)'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            inputProps={{ autoComplete: 'email' }}
          />

          <TextField
            label='Mobile phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            inputProps={{ autoComplete: 'tel' }}
          />

          <TextField
            label='Address'
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            fullWidth
            inputProps={{ autoComplete: 'street-address' }}
          />
        </Stack>

        <MuiButton
          color='primary'
          variant='contained'
          disabled={submitting || !planId}
          onClick={onSubmit}
          sx={{ mt: 1, py: 1.25, fontWeight: 800, borderRadius: 2 }}
        >
          {submitting ? (
            <Stack direction='row' gap={1} alignItems='center' justifyContent='center'>
              <CircularProgress size={18} color='inherit' />
              <span>Starting checkout…</span>
            </Stack>
          ) : (
            'Continue to payment'
          )}
        </MuiButton>

        <Typography variant='caption' color='text.secondary'>
          Note: this creates a real checkout request on your configured Fiserv environment. Make sure your env vars are set.
        </Typography>
      </Stack>
    </Box>
  );
}

