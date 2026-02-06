'use client';

import { ReactNode, useCallback, useState } from 'react';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trackEvent } from '@/lib/analytics';

interface UsePlanGateResult {
    guardAction: (action: () => void, featureName?: string) => void;
    planDialog: ReactNode;
    hasCoins: boolean;
}

export const usePlanGate = (): UsePlanGateResult => {
    const { profile } = useUserProfile();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const hasCoins = Boolean(profile?.coin && profile.coin > 0);

    const guardAction = useCallback(
        (action: () => void, featureName?: string) => {
            if (hasCoins) {
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
        [hasCoins, profile?.id],
    );

    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const planDialog = (
        <PlanRequiredDialog open={isDialogOpen} onClose={closeDialog} />
    );

    return {
        guardAction,
        planDialog,
        hasCoins,
    };
};

