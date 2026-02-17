'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type MoreFeaturesAccess = {
  unlockedKeys: string[];
  enabledKeys: string[];
};

let cachedAccess: MoreFeaturesAccess | null = null;
let accessRequest: Promise<MoreFeaturesAccess | null> | null = null;

const fetchAccess = async (): Promise<MoreFeaturesAccess | null> => {
  const res = await fetch('/api/more-features/access', { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error(`HTTP ${res.status}`);
  }
  const json = (await res.json()) as any;
  return (json?.data ?? null) as MoreFeaturesAccess | null;
};

export const useMoreFeaturesAccess = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  const [access, setAccess] = useState<MoreFeaturesAccess | null>(cachedAccess);
  const [isLoading, setIsLoading] = useState(!cachedAccess && enabled);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) {
      if (isMounted.current) setIsLoading(false);
      return cachedAccess;
    }

    setIsLoading(true);
    const req = accessRequest ?? fetchAccess();
    accessRequest = req;

    try {
      const result = await req;
      if (accessRequest === req) accessRequest = null;
      cachedAccess = result;
      if (isMounted.current) {
        setAccess(result);
        setError(null);
      }
      return result;
    } catch (e) {
      if (accessRequest === req) accessRequest = null;
      if (isMounted.current) {
        setAccess(null);
        setError('Failed to load feature access');
      }
      return null;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    if (cachedAccess) {
      setAccess(cachedAccess);
      setIsLoading(false);
      setError(null);
      return;
    }
    void refresh();
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const handler = () => void refresh();
    window.addEventListener('zcv:more-features-access-changed', handler);
    return () => window.removeEventListener('zcv:more-features-access-changed', handler);
  }, [enabled, refresh]);

  return { access, isLoading, error, refresh };
};

