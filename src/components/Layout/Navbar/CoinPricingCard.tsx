import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Box, ButtonBase, Divider, Stack, Typography } from '@mui/material';

import CoinIcon from '@/assets/images/design/coin.svg';
import MuiButton from '@/components/UI/MuiButton';

type TabKey = 'asset' | 'features' | 'coin';

type PricingListItem = {
  id: string;
  label: string;
  badge?: string;
  initialQty: number;
};

const ASSET_ITEMS: PricingListItem[] = [
  { id: 'file', label: 'File', initialQty: 1 },
  { id: 'image', label: 'Image', initialQty: 0 },
  { id: 'video', label: 'Video', initialQty: 0 },
  { id: 'voice', label: 'Voice', initialQty: 0 },
];

type ResumeFeaturePricingRow = {
  id?: number | string;
  feature_name?: string;
  coin_per_action?: number | string;
  price_per_coin_aed?: number | string;
  price_per_action_aed?: number | string;
  [k: string]: unknown;
};

type CoinPackageRow = {
  id?: number | string;
  package_name?: string;
  coin_amount?: number | string;
  price_aed?: number | string;
  aed_per_coin?: number | string;
  [k: string]: unknown;
};

type CoinPack = { id: string; label: string; coins: number };

type ApiListResponse<T> = { data?: T[]; error?: string };

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

function slugifyId(input: string): string {
  return safeStr(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

type PlanId = 'starter' | 'pro' | 'plus' | 'elite';

function normalizePlanId(name: string | undefined): PlanId | null {
  const n = String(name ?? '').trim().toLowerCase();
  if (!n) return null;
  if (n.includes('starter') || n.includes('free')) return 'starter';
  if (n.includes('pro')) return 'pro';
  if (n.includes('plus')) return 'plus';
  if (n.includes('elite')) return 'elite';
  return null;
}

function mergeQuantities(prev: Record<string, number>, items: PricingListItem[]) {
  const next: Record<string, number> = {};
  for (const item of items) next[item.id] = prev[item.id] ?? item.initialQty ?? 0;
  return next;
}

const TabButton = memo(function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      role='tab'
      aria-selected={active}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        px: 1.25,
        py: 1,
        borderBottom: active ? '2px solid #4C5FFF' : '2px solid transparent',
        color: active ? 'text.primary' : 'text.secondary',
        fontWeight: active ? 600 : 500,
        fontSize: 14,
        lineHeight: 1.2,
        userSelect: 'none',
      }}
    >
      {label}
    </Box>
  );
});

const CoinPackList = memo(function CoinPackList({
  packs,
  selectedId,
  onSelect,
}: {
  packs: CoinPack[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Stack spacing={1.25} sx={{ width: '100%' }}>
      {packs.map((pack) => {
        const selected = pack.id === selectedId;
        return (
          <ButtonBase
            key={pack.id}
            onClick={() => onSelect(pack.id)}
            disableRipple
            sx={{
              width: '100%',
              borderRadius: 2,
              py: 0.25,
              '&:hover': { backgroundColor: '#F7F7FB' },
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.25,
                px: 0.5,
              }}
            >
              <Stack direction='row' alignItems='center' spacing={1.25} sx={{ minWidth: 0 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${selected ? '#4C5FFF' : '#D8D8DA'}`,
                    display: 'grid',
                    placeItems: 'center',
                    flex: '0 0 auto',
                  }}
                >
                  {selected ? (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4C5FFF' }} />
                  ) : null}
                </Box>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: '#111827',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {pack.label}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: 14,
                  color: '#111827',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  flex: '0 0 auto',
                }}
              >
                {pack.coins} Coins
              </Typography>
            </Box>
          </ButtonBase>
        );
      })}
    </Stack>
  );
});

const QuantityControl = memo(function QuantityControl({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <Stack direction='row' alignItems='center' spacing={1} sx={{ flex: '0 0 auto' }}>
      {value > 0 ? (
        <ButtonBase
          aria-label='Decrease'
          onClick={onDecrement}
          sx={{
            width: 22,
            height: 22,
            borderRadius: 1,
            color: '#111827',
            fontSize: 18,
            lineHeight: 1,
            '&:hover': { backgroundColor: '#F7F7FB' },
          }}
        >
          −
        </ButtonBase>
      ) : (
        <Box aria-hidden sx={{ width: 22, height: 22 }} />
      )}

      <Typography
        component='span'
        sx={{
          minWidth: 14,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 500,
          color: '#111827',
        }}
      >
        {value}
      </Typography>

      <ButtonBase
        aria-label='Increase'
        onClick={onIncrement}
        sx={{
          width: 22,
          height: 22,
          borderRadius: 1,
          color: '#111827',
          fontSize: 18,
          lineHeight: 1,
          '&:hover': { backgroundColor: '#F7F7FB' },
        }}
      >
        +
      </ButtonBase>
    </Stack>
  );
});

const PricingList = memo(function PricingList({
  items,
  quantities,
  onChangeQty,
}: {
  items: PricingListItem[];
  quantities: Record<string, number>;
  onChangeQty: (id: string, next: number) => void;
}) {
  return (
    <Stack spacing={1.15} sx={{ width: '100%' }}>
      {items.map((item) => {
        const qty = quantities[item.id] ?? 0;
        return (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Stack direction='row' alignItems='center' spacing={1} sx={{ minWidth: 0 }}>
              <Typography
                  variant='subtitle2' color='text.primary' fontWeight='400'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </Typography>

              {item.badge ? (
                <Box
                  component='span'
                  sx={{
                    flex: '0 0 auto',
                    px: 0.75,
                    py: 0.1,
                    borderRadius: 1,
                    border: '1px solid #4C5FFF',
                    backgroundColor: '#fff',
                    color: '#4C5FFF',
                    fontSize: 11,
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {item.badge}
                </Box>
              ) : null}
            </Stack>

            <QuantityControl
              value={qty}
              onDecrement={() => onChangeQty(item.id, Math.max(0, qty - 1))}
              onIncrement={() => onChangeQty(item.id, qty + 1)}
            />
          </Box>
        );
      })}
    </Stack>
  );
});

const PricingFooter = memo(function PricingFooter({
  totalCoins,
  totalPriceLabel,
  comparisonLabel,
  onPayment,
  onOurPlans,
}: {
  totalCoins: number;
  totalPriceLabel: string;
  comparisonLabel: string | null;
  onPayment?: () => void;
  onOurPlans?: () => void;
}) {
  return (
    <Stack spacing={1.25} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 600 }}>Total</Typography>

        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>{totalCoins} Coins</Typography>

        <Box
          sx={{
            px: 1.1,
            py: 0.45,
            borderRadius: '10px',
            border: '1px solid #E8E8EE',
            backgroundColor: '#fff',
            fontSize: 13,
            fontWeight: 700,
            color: '#111827',
            flex: '0 0 auto',
          }}
        >
          {totalPriceLabel}
        </Box>
      </Box>

      {comparisonLabel ? (
        <Box
          sx={{
            width: 'fit-content',
            alignSelf: 'center',
            px: 1.25,
            py: 0.85,
            borderRadius: 2,
            backgroundColor: '#EEF0FF',
            color: '#4C5FFF',
            fontSize: 12,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {comparisonLabel}
        </Box>
      ) : null}

      <MuiButton
        fullWidth
        onClick={onPayment}
        endIcon={<ArrowOutwardIcon sx={{ fontSize: 18 }} />}
        sx={{
          borderRadius: 2.5,
          backgroundColor: '#111827',
          color: '#fff',
          py: 1.25,
          fontWeight: 700,
          '&:hover': { backgroundColor: '#0B1220' },
        }}
      >
        Payment
      </MuiButton>

      <MuiButton
        fullWidth
        variant='outlined'
        color='secondary'
        onClick={onOurPlans}
        sx={{
          borderRadius: 2.5,
          py: 1.15,
          fontWeight: 700,
          borderColor: '#E8E8EE',
          color: '#111827',
          backgroundColor: '#fff',
          '&:hover': { borderColor: '#D8DBE5', backgroundColor: '#F7F7FB' },
        }}
      >
        Our plans
      </MuiButton>
    </Stack>
  );
});

type CoinPricingCardProps = {
  onPayment?: () => void;
  onOurPlans?: () => void;
  coinCount?: number;
};

export default function CoinPricingCard({ onPayment, onOurPlans, coinCount }: CoinPricingCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('asset');
  const [selectedPackId, setSelectedPackId] = useState<string>('');

  const [featureItems, setFeatureItems] = useState<PricingListItem[]>([]);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [featureError, setFeatureError] = useState<string | null>(null);
  const [featurePricingById, setFeaturePricingById] = useState<Record<string, { coinPerAction: number; pricePerCoinAed: number }>>({});
  const [featureNameToId, setFeatureNameToId] = useState<Record<string, string>>({});

  const [coinPacks, setCoinPacks] = useState<CoinPack[]>([]);
  const [coinPackLoading, setCoinPackLoading] = useState(false);
  const [coinPackError, setCoinPackError] = useState<string | null>(null);
  const [coinPackageById, setCoinPackageById] = useState<Record<string, { coinAmount: number; priceAed: number; aedPerCoin: number }>>({});

  const [assetQty, setAssetQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(ASSET_ITEMS.map((i) => [i.id, i.initialQty])),
  );
  const [featureQty, setFeatureQty] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function run() {
      setFeatureLoading(true);
      setFeatureError(null);
      setCoinPackLoading(true);
      setCoinPackError(null);

      try {
        const [featuresRes, coinRes] = await Promise.all([
          fetch('/api/pricing/resume-feature-pricing', { cache: 'no-store', signal, headers: { Accept: 'application/json' } }),
          fetch('/api/pricing/coin-packages', { cache: 'no-store', signal, headers: { Accept: 'application/json' } }),
        ]);

        const featuresJson = (await featuresRes.json().catch(() => ({}))) as ApiListResponse<ResumeFeaturePricingRow>;
        const coinJson = (await coinRes.json().catch(() => ({}))) as ApiListResponse<CoinPackageRow>;

        if (!featuresRes.ok) throw new Error(featuresJson?.error || `HTTP ${featuresRes.status} (resume-feature-pricing)`);
        if (!coinRes.ok) throw new Error(coinJson?.error || `HTTP ${coinRes.status} (coin-packages)`);

        const featureRows = Array.isArray(featuresJson?.data) ? featuresJson.data : [];
        const nextFeaturePricingById: Record<string, { coinPerAction: number; pricePerCoinAed: number }> = {};
        const nextFeatureNameToId: Record<string, string> = {};
        const nextFeatureItems: PricingListItem[] = featureRows
          .map((row, idx) => {
            const label = safeStr(row?.feature_name) || `Feature ${idx + 1}`;
            const id = safeStr(row?.id) || slugifyId(label) || String(idx + 1);
            const badge = label.toLowerCase().includes('chatbot') ? 'Chatbot' : undefined;
            nextFeaturePricingById[id] = {
              coinPerAction: toFiniteNumber(row?.coin_per_action, 0),
              pricePerCoinAed: toFiniteNumber(row?.price_per_coin_aed, 0),
            };
            const key = normalizeKey(label);
            if (key) nextFeatureNameToId[key] = id;
            return { id, label, badge, initialQty: 0 };
          })
          .filter((x) => Boolean(x.id) && Boolean(x.label));

        const coinRows = Array.isArray(coinJson?.data) ? coinJson.data : [];
        const nextCoinPackageById: Record<string, { coinAmount: number; priceAed: number; aedPerCoin: number }> = {};
        const nextCoinPacks: CoinPack[] = coinRows
          .map((row, idx) => {
            const label = safeStr(row?.package_name) || `Package ${idx + 1}`;
            const id = safeStr(row?.id) || slugifyId(label) || String(idx + 1);
            const coinAmount = toFiniteNumber(row?.coin_amount, 0);
            const priceAed = toFiniteNumber(row?.price_aed, 0);
            const aedPerCoinRaw = toFiniteNumber(row?.aed_per_coin, 0);
            const aedPerCoin =
              aedPerCoinRaw > 0 ? aedPerCoinRaw : coinAmount > 0 && priceAed > 0 ? priceAed / coinAmount : 0;
            nextCoinPackageById[id] = { coinAmount, priceAed, aedPerCoin };
            return { id, label, coins: Number.isFinite(coinAmount) ? coinAmount : 0 };
          })
          .filter((x) => Boolean(x.id) && Boolean(x.label));

        setFeatureItems(nextFeatureItems);
        setFeaturePricingById(nextFeaturePricingById);
        setFeatureNameToId(nextFeatureNameToId);
        setCoinPacks(nextCoinPacks);
        setCoinPackageById(nextCoinPackageById);
      } catch (e) {
        if (signal.aborted) return;
        const msg = e instanceof Error ? e.message : 'Failed to load pricing data';
        setFeatureError(msg);
        setCoinPackError(msg);
        setFeatureItems([]);
        setFeaturePricingById({});
        setFeatureNameToId({});
        setCoinPacks([]);
        setCoinPackageById({});
      } finally {
        if (signal.aborted) return;
        setFeatureLoading(false);
        setCoinPackLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setFeatureQty((prev) => mergeQuantities(prev, featureItems));
  }, [featureItems]);

  useEffect(() => {
    if (coinPacks.length === 0) return;
    setSelectedPackId((prev) => {
      if (prev && coinPacks.some((p) => p.id === prev)) return prev;
      return coinPacks[0].id;
    });
  }, [coinPacks]);

  const qtyItems = useMemo(() => {
    if (activeTab === 'asset') return ASSET_ITEMS;
    if (activeTab === 'features') return featureItems;
    return null;
  }, [activeTab, featureItems]);

  const quantities = activeTab === 'asset' ? assetQty : activeTab === 'features' ? featureQty : null;

  const handleChangeQty = useCallback(
    (id: string, next: number) => {
      if (activeTab === 'asset') {
        setAssetQty((prev) => (prev[id] === next ? prev : { ...prev, [id]: next }));
        return;
      }
      if (activeTab === 'features') {
        setFeatureQty((prev) => (prev[id] === next ? prev : { ...prev, [id]: next }));
      }
    },
    [activeTab],
  );

  const handleSetAssetTab = useCallback(() => setActiveTab('asset'), []);
  const handleSetFeaturesTab = useCallback(() => setActiveTab('features'), []);
  const handleSetCoinTab = useCallback(() => setActiveTab('coin'), []);

  const safeCoinCount = Number.isFinite(Number(coinCount)) ? Number(coinCount) : 0;
  const handleSelectPack = useCallback((id: string) => setSelectedPackId(id), []);

  const unitPricePerCoinAed = useMemo(() => {
    const values = Object.values(featurePricingById);
    for (const v of values) {
      if (v && typeof v.pricePerCoinAed === 'number' && v.pricePerCoinAed > 0) return v.pricePerCoinAed;
    }
    return 0;
  }, [featurePricingById]);

  const totalCoins = useMemo(() => {
    let sum = 0;

    // Asset tab uses the same underlying "Input" features in resume_feature_pricing.
    const assetToPricingKey: Record<string, string> = {
      file: 'file input',
      image: 'images input',
      video: 'video input',
      voice: 'voice input',
    };

    for (const item of ASSET_ITEMS) {
      const qty = toFiniteNumber(assetQty[item.id], 0);
      if (qty <= 0) continue;
      const pricingId = featureNameToId[assetToPricingKey[item.id]] ?? '';
      const coinPerAction = pricingId ? featurePricingById[pricingId]?.coinPerAction ?? 0 : 0;
      sum += qty * coinPerAction;
    }

    for (const item of featureItems) {
      const qty = toFiniteNumber(featureQty[item.id], 0);
      if (qty <= 0) continue;
      const coinPerAction = featurePricingById[item.id]?.coinPerAction ?? 0;
      sum += qty * coinPerAction;
    }

    // Coins should be whole numbers.
    return Math.max(0, Math.round(sum));
  }, [assetQty, featureItems, featureNameToId, featurePricingById, featureQty]);

  const totalPriceAed = useMemo(() => totalCoins * unitPricePerCoinAed, [totalCoins, unitPricePerCoinAed]);

  const comparisonLabel = useMemo(() => {
    if (totalCoins <= 0) return null;
    if (!selectedPackId) return null;
    const pkg = coinPackageById[selectedPackId];
    if (!pkg || pkg.aedPerCoin <= 0) return null;
    if (unitPricePerCoinAed <= 0) return null;

    const packageEquivalent = totalCoins * pkg.aedPerCoin;
    if (packageEquivalent <= 0) return null;

    const deltaPercent = ((totalPriceAed - packageEquivalent) / packageEquivalent) * 100;
    if (!Number.isFinite(deltaPercent)) return null;
    const rounded = Math.round(Math.abs(deltaPercent));
    if (rounded === 0) return 'Same price as our packages';
    return `${rounded}% ${deltaPercent >= 0 ? 'pricier' : 'cheaper'} than our packages`;
  }, [coinPackageById, selectedPackId, totalCoins, totalPriceAed, unitPricePerCoinAed]);

  const totalPriceLabel = useMemo(() => {
    if (totalCoins <= 0) return 'AED 0';
    if (!Number.isFinite(totalPriceAed) || totalPriceAed <= 0) return '—';
    const rounded = Math.round(totalPriceAed * 100) / 100;
    return `AED ${rounded}`;
  }, [totalCoins, totalPriceAed]);

  const handleDirectGatewayPayment = useCallback(() => {
    // Keep existing behavior (e.g. close popover) then go directly to gateway start page.
    onPayment?.();

    const selectedLabel = coinPacks.find((p) => p.id === selectedPackId)?.label;
    const plan = normalizePlanId(selectedLabel) ?? normalizePlanId(selectedPackId) ?? 'plus';

    const url = `/payment/fiserv?plan=${encodeURIComponent(plan)}`;
    window.location.assign(url);
  }, [coinPacks, onPayment, selectedPackId]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Your Coin</Typography>
        <Stack direction='row' alignItems='center' spacing={0.75}>
          <CoinIcon />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{safeCoinCount} Coin</Typography>
        </Stack>
      </Box>

      <Box
        role='tablist'
        aria-label='Pricing tabs'
        sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 0.25 }}
      >
        <TabButton label='Asset' active={activeTab === 'asset'} onClick={handleSetAssetTab} />
        <TabButton label='Features' active={activeTab === 'features'} onClick={handleSetFeaturesTab} />
        <TabButton label='Coin' active={activeTab === 'coin'} onClick={handleSetCoinTab} />
      </Box>

      <Divider sx={{ borderColor: '#F0F0F2' }} />

      {activeTab === 'coin' ? (
        coinPackLoading ? (
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Loading coin packages…</Typography>
        ) : coinPackError ? (
          <Typography sx={{ fontSize: 13, color: 'error.main' }}>{coinPackError}</Typography>
        ) : coinPacks.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>No coin packages found.</Typography>
        ) : (
          <CoinPackList packs={coinPacks} selectedId={selectedPackId} onSelect={handleSelectPack} />
        )
      ) : qtyItems && quantities ? (
        activeTab === 'features' && featureLoading ? (
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Loading features…</Typography>
        ) : activeTab === 'features' && featureError ? (
          <Typography sx={{ fontSize: 13, color: 'error.main' }}>{featureError}</Typography>
        ) : activeTab === 'features' && featureItems.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>No features found.</Typography>
        ) : (
          <PricingList items={qtyItems} quantities={quantities} onChangeQty={handleChangeQty} />
        )
      ) : null}

      <Divider sx={{ borderColor: '#F0F0F2' }} />

      <PricingFooter
        totalCoins={totalCoins}
        totalPriceLabel={totalPriceLabel}
        comparisonLabel={comparisonLabel}
        onPayment={handleDirectGatewayPayment}
        onOurPlans={onOurPlans}
      />
    </>
  );
}

