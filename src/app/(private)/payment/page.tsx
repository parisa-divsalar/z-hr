'use client';

import { useEffect, useMemo, useState } from 'react';

import { Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MuiBadge from '@/components/UI/MuiBadge';
import MuiButton from '@/components/UI/MuiButton';
import MuiTable from '@/components/UI/MuiTable';

import { MobilePaymentList, MobilePaymentRow, PaymentRoot, PageTitle, TableWrapper } from './styled';

type PaymentStatus = 'success' | 'pending' | 'failed' | 'cancelled';

interface PaymentData {
  amount: string;
  date: string;
  plan: string;
  paymentCode: string;
  status: PaymentStatus;
}

type ApiTransactionRow = {
  id?: number;
  order_id?: string;
  orderId?: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  plan_id?: string;
  planId?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  [k: string]: unknown;
};

function normalizeStatus(raw: unknown): PaymentStatus {
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'success') return 'success';
  if (s === 'pending') return 'pending';
  if (s === 'cancelled') return 'cancelled';
  return 'failed';
}

function formatMoney(amount: unknown, currency: unknown): string {
  const c = String(currency ?? 'AED').trim() || 'AED';
  const n = typeof amount === 'number' ? amount : Number(String(amount ?? '').replace(/,/g, '').trim());
  if (!Number.isFinite(n)) return `${c} —`;
  const rounded = Math.round(n * 100) / 100;
  return `${c} ${rounded}`;
}

function formatDate(iso: unknown): string {
  const d = new Date(String(iso ?? '').trim());
  if (Number.isNaN(d.getTime())) return '—';
  // Keep it simple and consistent with previous mock format: MM/DD/YYYY
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

const PaymentPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/payment/transactions', {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const json = (await res.json().catch(() => ({}))) as { data?: ApiTransactionRow[]; error?: string };
        if (!res.ok) throw new Error(String(json?.error ?? `HTTP ${res.status}`));
        const data = Array.isArray(json?.data) ? json.data : [];
        const mapped = data.map((r) => {
          const orderId = String(r?.order_id ?? r?.orderId ?? '—');
          const plan = String(r?.plan_id ?? r?.planId ?? '').trim() || '—';
          const dateIso = r?.created_at ?? r?.createdAt ?? r?.updated_at ?? r?.updatedAt ?? '';
          const status = normalizeStatus(r?.status);
          return {
            amount: formatMoney(r?.amount, r?.currency),
            date: formatDate(dateIso),
            plan,
            paymentCode: orderId,
            status,
          } satisfies PaymentData;
        });
        if (!cancelled) setRows(mapped);
      } catch (e) {
        if (!cancelled) {
          setRows([]);
          setError(e instanceof Error ? e.message : 'Failed to load payments');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const paymentData = useMemo(() => rows, [rows]);

  const handleViewClick = (paymentCode: string) => {
    console.log('View payment:', paymentCode);
  };

  const columns = [
    {
      id: 'amount',
      label: 'Amount',
      sortable: true,
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      id: 'plan',
      label: 'Plan',
      sortable: true,
    },
    {
      id: 'paymentCode',
      label: 'Payment Code',
      sortable: false,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (value: PaymentStatus) => {
        const badgeColor = value === 'cancelled' ? 'pending' : value;
        const paletteKey =
          value === 'success' ? 'success' : value === 'pending' || value === 'cancelled' ? 'warning' : 'error';
        const paletteColor = theme.palette[paletteKey];
        const backgroundColor =
          value === 'success' ? theme.palette.success.light : paletteColor.light || paletteColor.main;

        return (
          <MuiBadge
            label={value}
            color={badgeColor}
            border={`1px solid ${paletteColor.main}`}
            backgroundColor={backgroundColor}
            textColor={paletteColor.main}
          />
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      align: 'center' as const,
      sortable: false,
      render: (_: any, row: PaymentData) => (
        <MuiButton color='secondary' variant='outlined' size='small' onClick={() => handleViewClick(row.paymentCode)}>
          View
        </MuiButton>
      ),
    },
  ];

  return (
    <PaymentRoot>
      <PageTitle>
        <Typography component='h5' fontWeight='500' color='text.primary'>
          Payment
        </Typography>
      </PageTitle>

      <Stack gap={2}>
        <Typography variant='subtitle1' fontWeight={700} color='text.primary'>
          Payment history
        </Typography>

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        ) : error ? (
          <Typography variant="body2" color="error.main">
            {error}
          </Typography>
        ) : paymentData.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payments found.
          </Typography>
        ) : null}

        {isMobile ? (
          <MobilePaymentList>
            {paymentData.map((row) => (
              <MobilePaymentRow key={row.paymentCode}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary'>
                    Amount
                  </Typography>
                  <Typography variant='subtitle1'>{row.amount}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary'>
                    Date
                  </Typography>
                  <Typography variant='subtitle1'>{row.date}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary'>
                    Plan
                  </Typography>
                  <Typography variant='subtitle1'>{row.plan}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary'>
                    Payment Code
                  </Typography>
                  <Typography variant='subtitle1'>{row.paymentCode}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='body2' color='text.secondary'>
                    Status
                  </Typography>
                  {(() => {
                    const badgeColor = row.status === 'cancelled' ? 'pending' : row.status;
                    const paletteKey =
                      row.status === 'success'
                        ? 'success'
                        : row.status === 'pending' || row.status === 'cancelled'
                          ? 'warning'
                          : 'error';
                    const paletteColor = theme.palette[paletteKey];
                    const backgroundColor =
                      row.status === 'success'
                        ? theme.palette.success.light
                        : theme.palette[row.status === 'pending' || row.status === 'cancelled' ? 'warning' : 'error'].light;
                    return (
                      <MuiBadge
                        label={row.status}
                        color={badgeColor}
                        border={`1px solid ${paletteColor.main}`}
                        backgroundColor={backgroundColor}
                        textColor={paletteColor.main}
                      />
                    );
                  })()}
                </Stack>
                <Stack direction='row' justifyContent='flex-end'>
                  <MuiButton
                    color='secondary'
                    variant='outlined'
                    size='small'
                    onClick={() => handleViewClick(row.paymentCode)}
                  >
                    View
                  </MuiButton>
                </Stack>
              </MobilePaymentRow>
            ))}
          </MobilePaymentList>
        ) : (
          <TableWrapper>
            <MuiTable
              columns={columns}
              data={paymentData}
              pagination={true}
              defaultRowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableWrapper>
        )}
      </Stack>
    </PaymentRoot>
  );
};

export default PaymentPage;
