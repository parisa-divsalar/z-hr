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
  [k: string]: unknown;
};

type CoinPackageRow = {
  id?: number | string;
  package_name?: string;
  coin_amount?: number | string;
  [k: string]: unknown;
};

type CoinPack = { id: string; label: string; coins: number };

type ApiListResponse<T> = { data?: T[]; error?: string };

function safeStr(v: unknown): string {
  return String(v ?? '').trim();
}

function slugifyId(input: string): string {
  return safeStr(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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
  onPayment,
  onOurPlans,
}: {
  onPayment?: () => void;
  onOurPlans?: () => void;
}) {
  return (
    <Stack spacing={1.25} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', fontWeight: 600 }}>Total</Typography>

        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>100 Coins</Typography>

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
          $ 120
        </Box>
      </Box>

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
        15% pricier than our packages
      </Box>

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

  const [coinPacks, setCoinPacks] = useState<CoinPack[]>([]);
  const [coinPackLoading, setCoinPackLoading] = useState(false);
  const [coinPackError, setCoinPackError] = useState<string | null>(null);

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
        const nextFeatureItems: PricingListItem[] = featureRows
          .map((row, idx) => {
            const label = safeStr(row?.feature_name) || `Feature ${idx + 1}`;
            const id = safeStr(row?.id) || slugifyId(label) || String(idx + 1);
            const badge = label.toLowerCase().includes('chatbot') ? 'Chatbot' : undefined;
            return { id, label, badge, initialQty: 0 };
          })
          .filter((x) => Boolean(x.id) && Boolean(x.label));

        const coinRows = Array.isArray(coinJson?.data) ? coinJson.data : [];
        const nextCoinPacks: CoinPack[] = coinRows
          .map((row, idx) => {
            const label = safeStr(row?.package_name) || `Package ${idx + 1}`;
            const id = safeStr(row?.id) || slugifyId(label) || String(idx + 1);
            const coins = Number(row?.coin_amount ?? 0);
            return { id, label, coins: Number.isFinite(coins) ? coins : 0 };
          })
          .filter((x) => Boolean(x.id) && Boolean(x.label));

        setFeatureItems(nextFeatureItems);
        setCoinPacks(nextCoinPacks);
      } catch (e) {
        if (signal.aborted) return;
        const msg = e instanceof Error ? e.message : 'Failed to load pricing data';
        setFeatureError(msg);
        setCoinPackError(msg);
        setFeatureItems([]);
        setCoinPacks([]);
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

      <PricingFooter onPayment={onPayment} onOurPlans={onOurPlans} />
    </>
  );
}

