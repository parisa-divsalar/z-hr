'use client';

import { useEffect, useMemo, useState } from 'react';

import { Stack } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import IntroDialog from '@/components/Landing/IntroDialog';
import { AIStatus } from '@/components/Landing/type';
import Wizard from '@/components/Landing/Wizard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';
import { apiClientClient } from '@/services/api-client';
import { useWizardStore } from '@/store/wizard';

import { ResumeBuilderRoot } from './styled';

export default function ResumeBuilderPage() {
    const searchParams = useSearchParams();
    const { profile, isLoading: profileLoading, refreshProfile } = useUserProfile();
    const [_aiStatus, setAiStatus] = useState<AIStatus>('START');
    const [initialStep, setInitialStep] = useState<number>(1);
    const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
    const [refetchDone, setRefetchDone] = useState<boolean>(false);
    const setRequestId = useWizardStore((state) => state.setRequestId);

    // Only allow form / wizard after we have completed a fresh refetch on this page (avoid stale cache).
    const effectiveLoading = !refetchDone || profileLoading;
    const zeroCoinsMode = useMemo(() => {
        if (!refetchDone || profileLoading || profile == null) return false;
        const coins = Number(profile.coin);
        return Number.isFinite(coins) && coins <= 0;
    }, [refetchDone, profileLoading, profile]);

    const resetWizard = useWizardStore((state) => state.resetWizard);

    // Force a fresh profile fetch when entering resume-builder; do not show form until this completes.
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
    const requestIdFromStore = useWizardStore((state) => state.requestId);
    const setData = useWizardStore((state) => state.setData);

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
            // Start fresh: clear persisted requestId + wizard data.
            resetWizard();
            setAiStatus('WIZARD');
            setInitialStep(1);
        }
    }, [searchParams, resetWizard]);

    useEffect(() => {
        const wantsNew = String(searchParams.get('new') ?? '').trim();
        if (wantsNew === '1' || wantsNew.toLowerCase() === 'true') return;
        const raw = searchParams.get('requestId') ?? searchParams.get('RequestId');
        if (!raw) return;
        const trimmed = raw.trim();
        if (!trimmed) return;
        const normalized = trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1).trim() : trimmed;
        if (normalized) setRequestId(normalized);
    }, [searchParams, setRequestId]);

    useEffect(() => {
        const wantsNew = String(searchParams.get('new') ?? '').trim();
        if (wantsNew === '1' || wantsNew.toLowerCase() === 'true') return;

        const raw = searchParams.get('requestId') ?? searchParams.get('RequestId');
        const normalizedFromQuery = raw
            ? (() => {
                  const trimmed = raw.trim();
                  if (!trimmed) return null;
                  return trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1).trim() : trimmed;
              })()
            : null;

        const effectiveRequestId = normalizedFromQuery || requestIdFromStore;
        if (!effectiveRequestId) return;

        let cancelled = false;

        const stripAttachments = (section: any) => ({
            ...(section ?? {}),
            text: String(section?.text ?? ''),
            voices: [],
            files: [],
        });

        (async () => {
            try {
                const res = await apiClientClient.get('wizard/save', {
                    params: { requestId: effectiveRequestId },
                });
                const payload = res?.data?.data?.data ?? null;
                if (cancelled || !payload || typeof payload !== 'object') return;

                // Keep text fields, drop attachments (files/voices can't be restored after leaving the browser session).
                const nextData: any = {
                    ...payload,
                    background: stripAttachments((payload as any).background),
                    jobDescription: stripAttachments((payload as any).jobDescription),
                    additionalInfo: stripAttachments((payload as any).additionalInfo),
                    experiences: Array.isArray((payload as any).experiences)
                        ? (payload as any).experiences.map((x: any) => stripAttachments(x))
                        : [],
                    certificates: Array.isArray((payload as any).certificates)
                        ? (payload as any).certificates.map((x: any) => stripAttachments(x))
                        : [],
                };
                setData(nextData);

                // If URL doesn't explicitly set step, restore it from saved payload (if present).
                const urlStep = String(searchParams.get('step') ?? '').trim();
                if (!urlStep) {
                    const savedStepRaw = String((payload as any)?.step ?? '').trim();
                    const savedStep = Number.parseInt(savedStepRaw, 10);
                    if (Number.isFinite(savedStep) && savedStep >= 1 && savedStep <= 3) {
                        setAiStatus('WIZARD');
                        setInitialStep(savedStep);
                    }
                }
            } catch {
                // ignore load failures
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [searchParams, requestIdFromStore, setData]);

    useEffect(() => {
        trackEvent('resume_started', {
            timestamp: new Date().toISOString(),
        });
    }, []);

    const layoutHeight =
        'calc(max(var(--app-height), 100vh) - var(--navbar-height) - var(--footer-height) - 2 * var(--children-padding))';

    return (
        <ResumeBuilderRoot
            id='resume-builder-root'
            sx={(theme) => ({
                height: layoutHeight,
                maxHeight: layoutHeight,
                minHeight: 0,
                [theme.breakpoints.down('md')]: {
                    height: 'auto',
                    maxHeight: 'none',
                    minHeight: 0,
                },
            })}
        >
            <Stack width='100%' height='100%'>
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
        </ResumeBuilderRoot>
    );
}
