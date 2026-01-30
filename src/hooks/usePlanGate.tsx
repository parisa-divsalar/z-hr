'use client';

import { ReactNode, useCallback, useState } from 'react';

import PlanRequiredDialog from '@/components/Landing/Wizard/Step1/Common/PlanRequiredDialog';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UsePlanGateResult {
    guardAction: (action: () => void) => void;
    planDialog: ReactNode;
    hasCoins: boolean;
}

export const usePlanGate = (): UsePlanGateResult => {
    const { profile } = useUserProfile();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const hasCoins = Boolean(profile?.coin && profile.coin > 0);

    const guardAction = useCallback(
        (action: () => void) => {
            if (hasCoins) {
                action();
                return;
            }

            setIsDialogOpen(true);
        },
        [hasCoins],
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

