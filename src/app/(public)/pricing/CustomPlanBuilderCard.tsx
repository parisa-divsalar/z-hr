'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Alert, Box, Divider, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import DeleteIcon from '@/assets/images/icons/clean.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

type ResumeFeaturePricingRow = {
  id?: number | string;
  feature_name?: string;
  coin_per_action?: number | string;
  price_per_coin_aed?: number | string;
  price_per_action_aed?: number | string;
  [k: string]: unknown;
};

type ApiListResponse<T> = { data?: T[]; error?: string; generatedAt?: string };

type CatalogItem = {
  id: string;
  label: string;
  coinPerAction: number;
  pricePerCoinAedCents: number; // integer cents
  pricePerActionAedCents: number; // integer cents (0 means derive from coin price)
};

type PlanRow = {
  id: string;
  itemId: string;
  label: string;
  qty: number;
};

const TAX_RATE = 0.09;
const BORDER = '#F0F0F2';
const TEXT_MUTED = '#9CA3AF';
const TEXT_DARK = '#111827';
const BRAND = '#4D49FC';

function safeStr(v: unknown): string {
  return String(v ?? '').trim();
}

function normalizeKey(v: unknown): string {
  return safeStr(v)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toFiniteNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  if (typeof v === 'string') {
    const n = Number(v.replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(v as any);
  return Number.isFinite(n) ? n : fallback;
}

function toIntCentsFromAed(value: unknown): number {
  const n = toFiniteNumber(value, 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.max(0, Math.round(n * 100));
}

function slugifyId(input: string): string {
  return safeStr(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toPersianDigits(s: string): string {
  return s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d);
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export default function CustomPlanBuilderCard() {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const t = getMainTranslations(locale).pricingPage.customPlan;

  const formatPrice = useCallback(
    (amountAedCents: number) => {
      const safe = Number.isFinite(amountAedCents) ? amountAedCents : 0;
      const aed = Math.round(safe) / 100;
      let label = aed % 1 === 0 ? String(aed.toFixed(0)) : String(aed.toFixed(2));
      if (locale === 'fa') label = toPersianDigits(label);
      const currency = t.currencyAed ?? 'AED';
      return `${label} ${currency}`;
    },
    [locale, t.currencyAed],
  );

  const getDisplayLabel = useCallback(
    (label: string) => {
      if (locale !== 'fa' || !t.featureLabels) return label;
      const map = t.featureLabels as Record<string, string>;
      const exact = map[label];
      if (exact) return exact;
      const normalized = label.trim().toLowerCase();
      const byKey = Object.keys(map).find((k) => k.trim().toLowerCase() === normalized);
      return byKey ? map[byKey] : label;
    },
    [locale, t.featureLabels],
  );

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const catalogById = useMemo(() => Object.fromEntries(catalog.map((x) => [x.id, x])), [catalog]);

  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [qtyInput, setQtyInput] = useState<string>('');

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rows, setRows] = useState<PlanRow[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/pricing/resume-feature-pricing', {
          cache: 'no-store',
          signal,
          headers: { Accept: 'application/json' },
        });
        const json = (await res.json().catch(() => ({}))) as ApiListResponse<ResumeFeaturePricingRow>;
        if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);

        const data = Array.isArray(json?.data) ? json.data : [];
        const nextCatalog: CatalogItem[] = data
          .map((row, idx) => {
            const label = safeStr(row?.feature_name) || t.featureFallback(idx + 1);
            const rawId = safeStr(row?.id) || slugifyId(label) || String(idx + 1);
            const id = rawId || String(idx + 1);
            const coinPerAction = Math.max(0, clampInt(toFiniteNumber(row?.coin_per_action, 0), 0, 9999));
            const pricePerCoinAedCents = toIntCentsFromAed(row?.price_per_coin_aed);
            const pricePerActionAedCents = toIntCentsFromAed(row?.price_per_action_aed);
            return { id, label, coinPerAction, pricePerCoinAedCents, pricePerActionAedCents };
          })
          .filter((x) => Boolean(x.id) && Boolean(x.label))
          .sort((a, b) => {
            const aKey = normalizeKey(a.label);
            const bKey = normalizeKey(b.label);
            const aBoost = aKey === 'job description match' || aKey === 'wizard edit' ? -1 : 0;
            const bBoost = bKey === 'job description match' || bKey === 'wizard edit' ? -1 : 0;
            if (aBoost !== bBoost) return aBoost - bBoost;
            return a.label.localeCompare(b.label);
          });

        setCatalog(nextCatalog);
      } catch (e) {
        if (signal.aborted) return;
        const msg = e instanceof Error ? e.message : 'Failed to load pricing data';
        setError(msg);
        setCatalog([]);
      } finally {
        if (signal.aborted) return;
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, []);

  const rowsWithComputed = useMemo(() => {
    return rows.map((r) => {
      const item = catalogById[r.itemId] as CatalogItem | undefined;
      const coinPerAction = item?.coinPerAction ?? 0;
      const rowCoins = clampInt(r.qty, 0, 9999) * Math.max(0, clampInt(coinPerAction, 0, 9999));
      return { ...r, rowCoins };
    });
  }, [catalogById, rows]);

  const subtotalAedCents = useMemo(() => {
    let sum = 0;
    for (const r of rows) {
      const item = catalogById[r.itemId] as CatalogItem | undefined;
      if (!item) continue;

      const qty = clampInt(r.qty, 0, 9999);
      const coinPerAction = Math.max(0, clampInt(item.coinPerAction, 0, 9999));
      const coins = qty * coinPerAction;

      // Use `price_per_action_aed` if provided, otherwise derive from `price_per_coin_aed * coin_per_action`.
      const derivedFromCoins = item.pricePerCoinAedCents > 0 ? coins * item.pricePerCoinAedCents : 0;
      const totalForRow = item.pricePerActionAedCents > 0 ? qty * item.pricePerActionAedCents : derivedFromCoins;

      sum += Math.max(0, Math.round(totalForRow));
    }
    return Math.max(0, Math.round(sum));
  }, [catalogById, rows]);

  const totalWithTaxAedCents = useMemo(() => {
    const total = subtotalAedCents * (1 + TAX_RATE);
    return Math.max(0, Math.round(total));
  }, [subtotalAedCents]);

  const totalCoins = useMemo(() => {
    let sum = 0;
    for (const r of rowsWithComputed) sum += Math.max(0, clampInt(toFiniteNumber((r as any)?.rowCoins, 0), 0, 9_999_999));
    return Math.max(0, Math.round(sum));
  }, [rowsWithComputed]);

  const canSubmit = useMemo(() => {
    const qty = Number(qtyInput);
    return Boolean(selectedItemId) && Number.isFinite(qty) && qty > 0 && !loading;
  }, [loading, qtyInput, selectedItemId]);

  const resetInputs = useCallback(() => {
    setSelectedItemId('');
    setQtyInput('');
    setEditingRowId(null);
  }, []);

  const handleAddOrSave = useCallback(() => {
    const qty = clampInt(Number(qtyInput), 1, 9999);
    const item = catalogById[selectedItemId] as CatalogItem | undefined;
    if (!item) return;

    setRows((prev) => {
      if (editingRowId) {
        return prev.map((r) => (r.id === editingRowId ? { ...r, itemId: item.id, label: item.label, qty } : r));
      }

      // Merge if item already exists; keeps UI tidy like screenshot.
      const existing = prev.find((r) => r.itemId === item.id);
      if (existing) {
        return prev.map((r) => (r.id === existing.id ? { ...r, qty: clampInt(r.qty + qty, 1, 9999) } : r));
      }

      return [...prev, { id: `r-${Date.now()}`, itemId: item.id, label: item.label, qty }];
    });

    resetInputs();
  }, [catalogById, editingRowId, qtyInput, resetInputs, selectedItemId]);

  const handleEditRow = useCallback((row: PlanRow) => {
    setEditingRowId(row.id);
    setSelectedItemId(row.itemId);
    setQtyInput(String(row.qty));
  }, []);

  const handleDeleteRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setEditingRowId((prev) => (prev === rowId ? null : prev));
  }, []);

  const rowGridTemplateColumns = useMemo(
    () => ({
      xs: '1fr 52px 92px 84px',
      sm: '1fr 64px 110px 92px',
    }),
    [],
  );

  /** Opens payment gateway with exact custom plan total (Total price). */
  const startCustomPlanPayment = useCallback(
    async (totalPriceAedCents: number, coinsToCredit: number) => {
      const popup = window.open('about:blank', '_blank', 'noopener,noreferrer');
      const amountAed = Number.isFinite(totalPriceAedCents) && totalPriceAedCents > 0 ? totalPriceAedCents / 100 : 0;
      if (amountAed <= 0 || !Number.isFinite(coinsToCredit) || coinsToCredit <= 0) {
        throw new Error('Invalid custom plan amount or coins.');
      }

      try {
        const res = await fetch('/api/payment/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            amountAed: Math.round(amountAed * 100) / 100,
            purchasedCoinAmount: Math.round(coinsToCredit),
          }),
          cache: 'no-store',
        });
        const json = await res.json().catch(() => ({} as any));

        if (res.status === 401) {
          try {
            popup?.close();
          } catch {
            // ignore
          }
          router.push(PublicRoutes.login);
          return;
        }

        if (!res.ok) throw new Error(String(json?.error ?? `HTTP ${res.status}`));

        const url = String(json?.paymentUrl ?? '').trim();
        if (!url) throw new Error('Missing paymentUrl');

        if (popup && !popup.closed) {
          popup.location.href = url;
        } else {
          window.location.assign(url);
        }
      } catch (e) {
        try {
          popup?.close();
        } catch {
          // ignore
        }
        throw e;
      }
    },
    [router],
  );

  const handleUpgrade = useCallback(async () => {
    setUpgradeError(null);
    setUpgradeSuccess(null);

    if (totalCoins <= 0) {
      setUpgradeError(t.pleaseAddItem);
      return;
    }

    setUpgradeLoading(true);
    try {
      const res = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ amount: totalCoins, feature: 'custom_plan_builder' }),
        cache: 'no-store',
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (res.status === 401) {
        router.push(PublicRoutes.login);
        return;
      }

      if (res.status === 402) {
        await startCustomPlanPayment(totalWithTaxAedCents, totalCoins);
        setUpgradeSuccess(t.openedPaymentGateway);
        return;
      }

      if (!res.ok) throw new Error(String(json?.error ?? `HTTP ${res.status}`));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('zcv:profile-changed'));
      }
      setUpgradeSuccess(t.paymentDone);
      setRows([]);
      resetInputs();
    } catch (e) {
      setUpgradeError(e instanceof Error ? e.message : t.failedToCompletePayment);
    } finally {
      setUpgradeLoading(false);
    }
  }, [resetInputs, router, startCustomPlanPayment, t, totalCoins, totalWithTaxAedCents]);

  return (
    <Box dir={dir} sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 }, direction: dir }}>
      <Box sx={{ width: 'min(100%, 706px)', textAlign: 'center' }}>
        <Typography sx={{ mb: 4, fontSize: '12px' }} fontWeight={400} color='text.secondary'>
          {t.createYourPlan}
        </Typography>

        {/* Inputs row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: dir === 'rtl' ? 'auto 1fr 1fr' : '1fr 1fr auto' },
            gap: 1.25,
            alignItems: 'center',
            justifyItems: 'stretch',
            mb: 2,
          }}
        >
          <TextField
            select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(String(e.target.value))}
            size='small'
            fullWidth
            SelectProps={{
              displayEmpty: true,
              renderValue: (v) => {
                const id = String(v ?? '');
                if (!id) return <Box sx={{ color: TEXT_MUTED }}>{t.chooseItem}</Box>;
                const raw = catalogById[id]?.label ?? id;
                return getDisplayLabel(raw);
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                borderRadius: '16px',
                backgroundColor: '#fff',
                fontSize: 13.5,
                color: TEXT_DARK,
                '& fieldset': { borderColor: BORDER },
                '&:hover fieldset': { borderColor: BORDER },
                '&.Mui-focused fieldset': { borderColor: BORDER, borderWidth: 1 },
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
              },
            }}
          >
            <MenuItem value='' disabled>
              {t.chooseItem}
            </MenuItem>
            {loading ? (
              <MenuItem value='' disabled>
                {t.loading}
              </MenuItem>
            ) : error ? (
              <MenuItem value='' disabled>
                {t.failedToLoad}
              </MenuItem>
            ) : catalog.length === 0 ? (
              <MenuItem value='' disabled>
                {t.noItems}
              </MenuItem>
            ) : null}
            {catalog.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {getDisplayLabel(item.label)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={qtyInput}
            onChange={(e) => setQtyInput(e.target.value)}
            placeholder={t.numberOfItem}
            size='small'
            fullWidth
            inputMode='numeric'
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                borderRadius: '16px',
                backgroundColor: '#fff',
                fontSize: 13.5,
                color: TEXT_DARK,
                '& fieldset': { borderColor: BORDER },
                '&:hover fieldset': { borderColor: BORDER },
                '&.Mui-focused fieldset': { borderColor: BORDER, borderWidth: 1 },
                '& input::placeholder': { color: TEXT_MUTED, opacity: 1 },
              },
            }}
          />

          <IconButton
            aria-label={editingRowId ? t.saveItem : t.addItem}
            onClick={handleAddOrSave}
            disabled={!canSubmit}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              border: `1px solid ${BORDER}`,
              backgroundColor: '#fff',
              color: '#6B7280',
              justifySelf: { xs: dir === 'rtl' ? 'start' : 'end', sm: 'auto' },
              '&:hover': { backgroundColor: '#fff' },
            }}
          >
            {editingRowId ? <CheckIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Box>

        {/* List card */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            overflow: 'hidden',
            textAlign: dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {rowsWithComputed.length === 0 ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography sx={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600, textAlign: 'center' }}>
                {loading ? t.loadingItems : error ? t.failedToLoadItems : t.noItemsYet}
              </Typography>
            </Box>
          ) : (
            rowsWithComputed.map((row, idx) => (
              <Box key={row.id}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: rowGridTemplateColumns,
                    alignItems: 'center',
                    px: 2,
                    py: 1.25,
                    gap: 1.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: TEXT_DARK,
                      minWidth: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: dir === 'rtl' ? 'right' : 'left',
                    }}
                  >
                    {getDisplayLabel(row.label)}
                  </Typography>

                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, textAlign: 'center' }}>
                    {locale === 'fa' ? toPersianDigits(String(row.qty)) : row.qty}
                  </Typography>

                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, textAlign: 'center' }}>
                    {locale === 'fa' ? toPersianDigits(String(row.rowCoins)) : row.rowCoins} {row.rowCoins === 1 ? t.coin : t.coins}
                  </Typography>

                  <Stack direction='row' spacing={1} justifyContent={dir === 'rtl' ? 'flex-start' : 'flex-end'} sx={{ justifySelf: dir === 'rtl' ? 'start' : 'end' }}>
                    <IconButton
                      size='small'
                      aria-label={t.edit}
                      onClick={() => handleEditRow(row)}
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0,
                        backgroundColor: 'transparent',
                        '&:hover': { backgroundColor: 'transparent' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size='small'
                      aria-label={t.delete}
                      onClick={() => handleDeleteRow(row.id)}
                      sx={{
                        width: 32,
                        height: 32,
                        p: 0,
                        backgroundColor: 'transparent',
                        '&:hover': { backgroundColor: 'transparent' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>

                {idx < rowsWithComputed.length - 1 ? <Divider sx={{ borderColor: BORDER }} /> : null}
              </Box>
            ))
          )}

          <Divider sx={{ borderColor: BORDER }} />

          <Box
            sx={{
              px: 2,
              py: 1.6,
              display: 'flex',
              flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: TEXT_DARK }}>{t.totalPrice}</Typography>

            <Stack direction={dir === 'rtl' ? 'row-reverse' : 'row'} alignItems='center' spacing={3}>
              <Stack direction='row' alignItems='baseline' justifyContent='center' spacing={1} sx={{ mt: 0.1 }}>
                <Typography sx={{ fontSize: 22, color: BRAND, fontWeight: 700, textAlign: 'center' }}>
                  {formatPrice(totalWithTaxAedCents)}
                </Typography>
              </Stack>
              <Stack alignItems='center' sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 11.5, color: TEXT_MUTED, fontWeight: 700, mt: 0.25 }}>
                  {locale === 'fa' ? toPersianDigits(String(totalCoins)) : totalCoins} {t.coins}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: TEXT_MUTED, fontWeight: 600, mt: -0.25 }}>
                  {t.withTax}
                </Typography>
              </Stack>
              <MuiButton
                text={t.upgrade}
                variant='contained'
                color='secondary'
                disabled={upgradeLoading || rowsWithComputed.length === 0}
                onClick={handleUpgrade}
                sx={{ minWidth: 120, marginInlineStart: 16 }}
              />
            </Stack>
          </Box>

          {upgradeError ? (
            <Box sx={{ px: 2, pb: 2 }}>
              <Alert severity='error'>{upgradeError}</Alert>
            </Box>
          ) : null}
          {upgradeSuccess ? (
            <Box sx={{ px: 2, pb: 2 }}>
              <Alert severity='success'>{upgradeSuccess}</Alert>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
