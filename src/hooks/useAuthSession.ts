'use client';

import { useEffect, useRef, useState } from 'react';

import { apiClientClient } from '@/services/api-client';
import { useAuthStore } from '@/store/auth';

type AuthSessionState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

/**
 * Detects whether the user is authenticated.
 *
 * Priority:
 * 1) `useAuthStore().accessToken` (localStorage / in-memory)
 * 2) httpOnly cookie session validated via `/api/users/me`
 */
export function useAuthSession(): AuthSessionState {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(accessToken));
  const [isLoading, setIsLoading] = useState(!accessToken);
  const requestIdRef = useRef(0);

  useEffect(() => {
    // If we have an accessToken in the store, we're authenticated.
    if (accessToken) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Otherwise, validate cookie-based session.
    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    apiClientClient
      .get('users/me')
      .then(() => {
        if (requestIdRef.current !== requestId) return;
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
      });
  }, [accessToken]);

  return { isAuthenticated, isLoading };
}



















