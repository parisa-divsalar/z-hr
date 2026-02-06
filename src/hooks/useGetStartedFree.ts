'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { PublicRoutes } from '@/config/routes';
import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

function getAccessTokenFromAuthStorage(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem('auth');
        if (!raw) return null;

        const parsed = JSON.parse(raw) as { state?: { accessToken?: unknown } } | null;
        const token = parsed?.state?.accessToken;
        return typeof token === 'string' && token.trim() ? token : null;
    } catch {
        return null;
    }
}

type UseGetStartedFreeResult = {
    onGetStartedFree: () => Promise<void>;
    isRouting: boolean;
};

/**
 * Centralized CTA logic for "Get Started Free".
 *
 * Rules:
 * - If user has an access token => go to Landing
 * - Otherwise => go to Login
 *
 * Note: if token is not in local storage but user has a cookie session,
 * we validate it via `/api/users/me` on-demand (on click).
 */
export function useGetStartedFree(): UseGetStartedFreeResult {
    const router = useRouter();
    const storeAccessToken = useAuthStore((s) => s.accessToken);
    const [isRouting, setIsRouting] = useState(false);

    const onGetStartedFree = useCallback(async () => {
        if (isRouting) return;
        setIsRouting(true);

        try {
            const token = storeAccessToken || useAuthStore.getState().accessToken || getAccessTokenFromAuthStorage();
            if (token) {
                router.push(PublicRoutes.landing);
                return;
            }

            // No token in the client store/storage; fallback to cookie session check.
            try {
                await apiClientClient.get('users/me');
                router.push(PublicRoutes.landing);
            } catch {
                router.push(PublicRoutes.login);
            }
        } finally {
            setIsRouting(false);
        }
    }, [isRouting, router, storeAccessToken]);

    return { onGetStartedFree, isRouting };
}


