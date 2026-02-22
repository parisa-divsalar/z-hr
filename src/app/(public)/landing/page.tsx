'use client';
import { useEffect, useMemo, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import IntroDialog from '@/components/Landing/IntroDialog';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useLocaleStore } from '@/store/common';
import { useWizardStore } from '@/store/wizard';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const { profile, isLoading: profileLoading, refreshProfile } = useUserProfile();
  const [_aiStatus, setAiStatus] = useState<AIStatus>('START');
  const [initialStep, setInitialStep] = useState<number>(1);
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
  const [refetchDone, setRefetchDone] = useState<boolean>(false);
  const resetWizard = useWizardStore((state) => state.resetWizard);

  const effectiveLoading = !refetchDone || profileLoading;
  const zeroCoinsMode = useMemo(() => {
    if (!refetchDone || profileLoading || profile == null) return false;
    const coins = Number(profile.coin);
    return Number.isFinite(coins) && coins <= 0;
  }, [refetchDone, profileLoading, profile]);

  useEffect(() => {
    let cancelled = false;
    refreshProfile(true)
      .then(() => {
        if (!cancelled) setRefetchDone(true);
      })
      .catch(() => {
        if (!cancelled) setRefetchDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  useEffect(() => {
    if (zeroCoinsMode) setIsIntroOpen(true);
  }, [zeroCoinsMode]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= 3) {
        setAiStatus('WIZARD');
        setInitialStep(step);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const wantsNew = String(searchParams.get('new') ?? '').trim();
    if (wantsNew === '1' || wantsNew.toLowerCase() === 'true') {
      resetWizard();
      setAiStatus('WIZARD');
      setInitialStep(1);
    }
  }, [resetWizard, searchParams]);

  const locale = useLocaleStore((s) => s.locale);
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <Stack width='100%' height='100%' dir={dir} sx={{ direction: dir }}>
      <IntroDialog
        open={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        showBackToDashboard
        backToDashboardHref='/dashboard'
        zeroCoinsMode={zeroCoinsMode}
        profileLoading={effectiveLoading}
      />
      {!zeroCoinsMode && <Wizard setAiStatus={setAiStatus} initialStep={initialStep} />}
    </Stack>
  );
}
