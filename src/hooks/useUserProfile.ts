'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

export interface UserProfile {
    id: number;
    email: string;
    name: string | null;
    coin: number | null;
}

let cachedProfile: UserProfile | null = null;
let profileRequest: Promise<UserProfile | null> | null = null;
let lastAccessToken: string | null = null;

const fetchCurrentUserProfile = async (): Promise<UserProfile | null> => {
    const response = await apiClientClient.get('users/me');
    return response?.data?.data ?? null;
};

export const useUserProfile = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [profile, setProfile] = useState<UserProfile | null>(cachedProfile);
    const [isLoading, setIsLoading] = useState(!cachedProfile && Boolean(accessToken));
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
        if (!accessToken) {
            cachedProfile = null;
            profileRequest = null;
            if (isMounted.current) {
                setProfile(null);
                setError(null);
                setIsLoading(false);
            }
            return null;
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
            cachedProfile = result;
            setProfile(result);
            setError(null);
            return result;
        } catch (fetchError) {
            if (profileRequest === request) {
                profileRequest = null;
            }
            if (!isMounted.current) return null;
            setProfile(null);
            setError('Failed to load user profile');
            return null;
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        if (lastAccessToken !== accessToken) {
            lastAccessToken = accessToken;
            cachedProfile = null;
            profileRequest = null;
        }

        if (!accessToken) {
            setProfile(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        if (cachedProfile) {
            setProfile(cachedProfile);
            setIsLoading(false);
            setError(null);
            return;
        }

        void refreshProfile();
    }, [accessToken, refreshProfile]);

    return { profile, isLoading, error, refreshProfile };
};




