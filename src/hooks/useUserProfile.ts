'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

import type { AxiosError } from 'axios';

export interface UserProfile {
    id: number;
    email: string;
    name: string | null;
    coin: number | null;
    plan_status?: string | null;
    has_used_free_plan?: boolean;
    mainSkill?: string;
    dateOfBirth?: string;
}

let cachedProfile: UserProfile | null = null;
let profileRequest: Promise<UserProfile | null> | null = null;
let lastAccessToken: string | null = null;
let didTryCookieSessionProfile = false;

const fetchCurrentUserProfile = async (): Promise<UserProfile | null> => {
    const response = await apiClientClient.get('users/me');
    return response?.data?.data ?? null;
};

export const useUserProfile = (options?: { enabled?: boolean }) => {
    const enabled = options?.enabled ?? true;
    const accessToken = useAuthStore((state) => state.accessToken);
    const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
    const [isLoading, setIsLoading] = useState(
        !cachedProfile && enabled && (Boolean(accessToken) || !didTryCookieSessionProfile),
    );
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
        if (!enabled) {
            if (isMounted.current) setIsLoading(false);
            return cachedProfile;
        }

        // We can fetch profile either via Bearer token (accessToken) or via cookie session (withCredentials).
        // To avoid hammering `/users/me` for guests, we only try cookie-session once until auth state changes.
        if (!accessToken && didTryCookieSessionProfile) {
            if (isMounted.current) {
                setIsLoading(false);
            }
            return cachedProfile;
        }

        setIsLoading(true);
        const request = profileRequest ?? fetchCurrentUserProfile();
        profileRequest = request;

        try {
            const result = await request;
            if (profileRequest === request) {
                profileRequest = null;
            }
            if (!isMounted.current) {
                return result;
            }
            didTryCookieSessionProfile = true;
            cachedProfile = result;
            setProfile(result);
            setError(null);
            return result;
        } catch (e) {
            if (profileRequest === request) {
                profileRequest = null;
            }
            if (!isMounted.current) return null;

            didTryCookieSessionProfile = true;
            const err = e as AxiosError;
            const status = err?.response?.status;

            // If the user isn't authenticated, this is expected—don't surface an error.
            if (status === 401) {
                setProfile(null);
                setError(null);
                return null;
            }

            setProfile(null);
            setError('Failed to load user profile');
            return null;
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [accessToken, enabled]);

    useEffect(() => {
        if (!enabled) {
            setIsLoading(false);
            return;
        }

        if (lastAccessToken !== accessToken) {
            lastAccessToken = accessToken;
            cachedProfile = null;
            profileRequest = null;
            didTryCookieSessionProfile = false;
        }

        if (cachedProfile) {
            setProfile(cachedProfile);
            setIsLoading(false);
            setError(null);
            return;
        }

        void refreshProfile();
    }, [accessToken, enabled, refreshProfile]);

    // Allow any part of the app to trigger a profile refresh (e.g. after spending coins).
    useEffect(() => {
        if (!enabled) return;
        if (typeof window === 'undefined') return;

        const handler = () => {
            void refreshProfile();
        };

        window.addEventListener('zcv:profile-changed', handler);
        return () => {
            window.removeEventListener('zcv:profile-changed', handler);
        };
    }, [enabled, refreshProfile]);

    return { profile, isLoading, error, refreshProfile };
};









