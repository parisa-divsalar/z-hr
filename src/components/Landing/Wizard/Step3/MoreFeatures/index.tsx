import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import { Typography, Grid, Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import ResumeMoreTemplates from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesLeft';
import ResumeTemplatesRight, {
  MoreFeatureSuggestion,
} from '@/components/Landing/Wizard/Step3/MoreFeatures/ResumeTemplatesRight';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';
import {
  featureKeyFromTitle,
  readMoreFeaturesSelection,
  type MoreFeaturesSelection,
  writeMoreFeaturesSelection,
} from '@/utils/moreFeaturesSelection';
import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { useMoreFeaturesAccess } from '@/hooks/useMoreFeaturesAccess';
import { PrivateRoutes, PublicRoutes } from '@/config/routes';

interface MoreFeaturesProps {
  setStage: (stage: 'RESUME_EDITOR' | 'MORE_FEATURES') => void;
}

const MoreFeatures: FunctionComponent<MoreFeaturesProps> = (props) => {
  const { setStage } = props;
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const t = getMainTranslations(locale).landing.wizard.moreFeatures;
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  const requestId = useWizardStore((state) => state.requestId);
  const [suggestions, setSuggestions] = useState<MoreFeatureSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [selection, setSelection] = useState<MoreFeaturesSelection>(() => readMoreFeaturesSelection(requestId));
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const { access, refresh: refreshAccess } = useMoreFeaturesAccess({ enabled: true });

  useEffect(() => {
    setSelection(readMoreFeaturesSelection(requestId));
  }, [requestId]);

  const selectionKeyFor = (suggestion: Pick<MoreFeatureSuggestion, 'id' | 'title'>): string => {
    // Prefer stable semantic key derived from feature name (pricing `feature_name`),
    // fallback to id for legacy rows that don't map cleanly.
    return featureKeyFromTitle(suggestion.title) || String(suggestion.id ?? '').trim() || '';
  };

  useEffect(() => {
    // Merge server-enabled features into local selection (so checked state persists across reloads/devices).
    const enabledKeys = (access?.enabledKeys ?? []).filter(Boolean);
    if (enabledKeys.length === 0) return;
    setSelection((prev) => {
      const next = { ...(prev ?? {}) };
      let changed = false;
      for (const k of enabledKeys) {
        if (!next[k]) {
          next[k] = true;
          changed = true;
        }
      }
      if (changed) writeMoreFeaturesSelection(requestId, next);
      return changed ? next : prev;
    });
  }, [access?.enabledKeys, requestId]);

  const toggleSuggestion = async (suggestion: Pick<MoreFeatureSuggestion, 'id' | 'title'>, checked: boolean) => {
    const key = selectionKeyFor(suggestion);
    if (!key) return;

    if (pendingKey && pendingKey !== key) return; // one at a time
    setPendingKey(key);

    try {
      if (checked) {
        const res = await fetch('/api/more-features/access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'enable', featureName: suggestion.title }),
        });

        if (res.status === 402) {
          setPlanDialogOpen(true);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        // Reflect selection locally only after server confirms (coin deducted / unlocked).
        setSelection((prev) => {
          const next = { ...prev, [key]: true };
          writeMoreFeaturesSelection(requestId, { [key]: true });
          return next;
        });

        // Refresh global coin display + access cache.
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('zcv:profile-changed'));
          window.dispatchEvent(new Event('zcv:more-features-access-changed'));
        }
        void refreshAccess();
        return;
      }

      // checked === false => disable (no refund; keeps unlocked, only hides/locks in UI)
      const res = await fetch('/api/more-features/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable', featureName: suggestion.title }),
      });
      if (!res.ok && res.status !== 401) throw new Error(`HTTP ${res.status}`);

      setSelection((prev) => {
        const next = { ...prev, [key]: false };
        writeMoreFeaturesSelection(requestId, { [key]: false });
        return next;
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('zcv:more-features-access-changed'));
      }
      void refreshAccess();
    } finally {
      setPendingKey(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadSuggestions = async () => {
      setLoadingSuggestions(true);
      setSuggestionsError(null);
      try {
        const res = await fetch('/api/more-features', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as MoreFeatureSuggestion[];
        if (isMounted) setSuggestions(Array.isArray(json) ? json : []);
      } catch (error) {
        if (isMounted) {
          setSuggestionsError(error instanceof Error ? error.message : t.failedToLoad);
          setSuggestions([]);
        }
      } finally {
        if (isMounted) setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const leftSuggestions = suggestions.slice(0, 3);
  const rightSuggestions = suggestions.slice(3, 6);

  const leftWithSelection = useMemo(() => {
    return leftSuggestions.map((s) => {
      const key = selectionKeyFor(s);
      return { ...s, __featureKey: key, __checked: key ? Boolean(selection[key]) : false };
    });
  }, [leftSuggestions, selection]);

  const rightWithSelection = useMemo(() => {
    return rightSuggestions.map((s) => {
      const key = selectionKeyFor(s);
      return { ...s, __featureKey: key, __checked: key ? Boolean(selection[key]) : false, __pending: pendingKey === key };
    });
  }, [rightSuggestions, selection, pendingKey]);

  return (
    <>
      <Stack textAlign='center' mt={2} mb={2} dir={dir} sx={{ direction: dir }}>
        <Typography variant='h5' color='text.primary' fontWeight='500' mt={0.5}>
          {t.title}
        </Typography>
        <Typography variant='h6' color='text.primary' mt={2} fontWeight='400'>
          {t.subtitle}
        </Typography>
      </Stack>
      <Grid container spacing={{ xs: 2, md: 3 }} mt={{ xs: 1, md: 2 }} dir={dir} sx={{ direction: dir }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {loadingSuggestions ? (
            <Typography variant='subtitle2' color='text.secondary' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {t.loadingSuggestions}
            </Typography>
          ) : suggestionsError ? (
            <Typography variant='subtitle2' color='error' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {suggestionsError}
            </Typography>
          ) : leftWithSelection.length === 0 ? (
            <Typography variant='subtitle2' color='text.secondary' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {t.noSuggestions}
            </Typography>
          ) : (
            leftWithSelection.map((suggestion, index) =>
              index === 0 ? (
                <ResumeMoreTemplates
                  key={suggestion.id}
                  suggestion={suggestion}
                  checked={Boolean((suggestion as any).__checked)}
                  onCheckedChange={(checked) => toggleSuggestion(suggestion, checked)}
                  dir={dir}
                  coinLabel={t.coinLabel}
                  locale={locale}
                />
              ) : (
                <Box key={suggestion.id} mt={2.5}>
                  <ResumeMoreTemplates
                    suggestion={suggestion}
                    checked={Boolean((suggestion as any).__checked)}
                    onCheckedChange={(checked) => toggleSuggestion(suggestion, checked)}
                    dir={dir}
                    coinLabel={t.coinLabel}
                    locale={locale}
                  />
                </Box>
              ),
            )
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {loadingSuggestions ? (
            <Typography variant='subtitle2' color='text.secondary' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {t.loadingSuggestions}
            </Typography>
          ) : suggestionsError ? (
            <Typography variant='subtitle2' color='error' sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {suggestionsError}
            </Typography>
          ) : (
            <ResumeTemplatesRight
              suggestions={rightWithSelection as any}
              getChecked={(s) => {
                const key = selectionKeyFor(s as any);
                return key ? Boolean(selection[key]) : false;
              }}
              onToggle={(s, checked) => toggleSuggestion(s as any, checked)}
              dir={dir}
              noSuggestionsText={t.noSuggestions}
              coinLabel={t.coinLabel}
              answerLabel={t.answer}
              locale={locale}
            />
          )}
        </Grid>
      </Grid>

      <PlanRequiredDialog
        open={planDialogOpen}
        onClose={() => setPlanDialogOpen(false)}
        title={t.insufficientCoins}
        headline={t.insufficientCoinsHeadline}
        bodyText={t.insufficientCoinsBody}
        primaryLabel={t.goToPayment}
        primaryHref={PrivateRoutes.payment}
        secondaryLabel={t.pricing}
        secondaryHref={PublicRoutes.pricing}
      />

      <Stack
        dir={dir}
        direction={{ xs: 'column', sm: dir === 'rtl' ? 'row-reverse' : 'row' }}
        gap={{ xs: 2, sm: 3 }}
        justifyContent='center'
        alignItems='center'
        p={{ xs: 2, sm: 3, md: 5 }}
        sx={{ direction: dir }}
      >
        <MuiButton
          text={t.back}
          variant='outlined'
          color='secondary'
          size='large'
          startIcon={dir === 'ltr' ? <ArrowBackIcon style={{ color: '#111113' }} /> : undefined}
          endIcon={dir === 'rtl' ? <ArrowBackIcon style={{ color: '#111113' }} /> : undefined}
          onClick={() => setStage('RESUME_EDITOR')}
        />
        <MuiButton
          text={t.submit}
          variant='contained'
          color='secondary'
          size='large'
          onClick={() => {
            const qs = new URLSearchParams();
            if (requestId) qs.set('requestId', requestId);
            router.push(`/resume-generator${qs.toString() ? `?${qs.toString()}` : ''}`);
          }}
        />
      </Stack>
    </>
  );
};

export default MoreFeatures;
