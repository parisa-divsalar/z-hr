'use client';

import { ReactNode, useCallback, useState } from 'react';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';

interface UsePlanGateResult {
    guardAction: (action: () => void, featureName?: string) => void;
    planDialog: ReactNode;
    hasPaidPlan: boolean;
}

export const usePlanGate = (): UsePlanGateResult => {
    const { profile } = useUserProfile();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const planStatusRaw =
        (profile as any)?.plan_status ??
        (profile as any)?.planStatus ??
        null;
    const planStatus = String(planStatusRaw ?? '').trim().toLowerCase();
    const hasPaidPlan = planStatus === 'paid';
    const coinBalance = Number(profile?.coin ?? 0);
    const hasCoins = Number.isFinite(coinBalance) && coinBalance > 0;

    const guardAction = useCallback(
        (action: () => void, featureName?: string) => {
            // Allow if user is on a paid plan OR they have coin balance to spend.
            // Server-side APIs will still enforce exact coin costs and return 402 when insufficient.
            if (hasPaidPlan || hasCoins) {
                action();
                return;
            }

            if (featureName) {
                trackEvent('locked_feature_clicked', {
                    user_id: profile?.id || 'unknown',
                    feature_name: featureName,
                    timestamp: new Date().toISOString(),
                });
            }

            setIsDialogOpen(true);
        },
        [hasCoins, hasPaidPlan, profile?.id],
    );

    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const planDialog = (
        <PlanRequiredDialog open={isDialogOpen} onClose={closeDialog} />
    );

    return {
        guardAction,
        planDialog,
        hasPaidPlan,
    };
};

